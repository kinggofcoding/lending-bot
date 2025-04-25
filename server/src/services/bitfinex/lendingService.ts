import axios from 'axios';
import crypto from 'crypto';
import { Server } from 'socket.io';
import { LendingSettings } from '../../types/bitfinex';

// 記錄當前的放貸策略
let lendingStrategies: Record<string, LendingSettings> = {
  USD: { currency: 'USD', amount: 0, rate: 0.05, period: 2, autoRenew: true },
  BTC: { currency: 'BTC', amount: 0, rate: 0.01, period: 2, autoRenew: true },
  ETH: { currency: 'ETH', amount: 0, rate: 0.01, period: 2, autoRenew: true },
  USDT: { currency: 'USDT', amount: 0, rate: 0.05, period: 2, autoRenew: true }
};

/**
 * 初始化放貸機器人
 */
export function initLendingBot(io: Server, apiKey: string, apiSecret: string) {
  console.log('初始化放貸機器人');
  
  // 定期監控最佳放貸利率
  const rateMonitorInterval = setInterval(async () => {
    try {
      const rates = await getBestLendingRates();
      io.emit('lending:rates', rates);
      
      // 檢查是否應該根據策略提交新訂單
      await checkAndCreateOffers(apiKey, apiSecret, rates);
    } catch (error) {
      console.error('監控利率時發生錯誤:', error);
    }
  }, 60000); // 每分鐘更新一次
  
  // 定期檢查過期的訂單
  const expiryCheckInterval = setInterval(async () => {
    try {
      await checkExpiringOffers(apiKey, apiSecret);
    } catch (error) {
      console.error('檢查過期訂單時發生錯誤:', error);
    }
  }, 300000); // 每5分鐘檢查一次
  
  return {
    stop: () => {
      clearInterval(rateMonitorInterval);
      clearInterval(expiryCheckInterval);
      console.log('放貸機器人已停止');
    }
  };
}

/**
 * 獲取最佳放貸利率
 */
async function getBestLendingRates() {
  try {
    const currencies = ['USD', 'BTC', 'ETH', 'USDT'];
    const rates: Record<string, { rate: number, available: number }> = {};
    
    for (const currency of currencies) {
      const response = await axios.get(`https://api.bitfinex.com/v1/lendbook/${currency}`);
      if (response.data && response.data.asks && response.data.asks.length > 0) {
        // 找到第一個有效的出價
        let validAsk = response.data.asks[0];
        const bestRate = parseFloat(validAsk.rate);
        const available = parseFloat(validAsk.amount);
        rates[currency] = { rate: bestRate, available };
      }
    }
    
    return rates;
  } catch (error) {
    console.error('獲取最佳放貸利率失敗:', error);
    throw error;
  }
}

/**
 * 根據最佳利率和策略檢查是否應該創建新訂單
 */
async function checkAndCreateOffers(apiKey: string, apiSecret: string, currentRates: Record<string, { rate: number, available: number }>) {
  for (const [currency, settings] of Object.entries(lendingStrategies)) {
    // 只處理啟用的策略和有足夠額度的貨幣
    if (settings.amount <= 0 || !currentRates[currency]) continue;
    
    const currentRate = currentRates[currency].rate;
    
    // 如果當前利率高於策略中設置的最低利率，創建訂單
    if (currentRate >= settings.rate) {
      try {
        await submitLendingOffer(apiKey, apiSecret, {
          ...settings,
          rate: currentRate // 使用當前市場利率
        });
        console.log(`已為${currency}創建新的放貸訂單，利率: ${currentRate * 100}%`);
      } catch (error) {
        console.error(`為${currency}創建訂單失敗:`, error);
      }
    }
  }
}

/**
 * 檢查即將到期的訂單，並根據策略決定是否續借
 */
async function checkExpiringOffers(apiKey: string, apiSecret: string) {
  try {
    // 獲取活躍訂單
    const activeOffers = await getActiveOffers(apiKey, apiSecret);
    const now = Date.now();
    
    for (const offer of activeOffers) {
      // 檢查訂單是否即將到期 (24小時內)
      const expiryTime = new Date(offer.expires_at).getTime();
      const timeToExpiry = expiryTime - now;
      
      if (timeToExpiry < 24 * 60 * 60 * 1000) { // 24小時內
        const strategy = lendingStrategies[offer.currency];
        
        // 如果策略啟用了自動續借
        if (strategy && strategy.autoRenew) {
          // 取消當前訂單
          await cancelOffer(apiKey, apiSecret, offer.id);
          
          // 獲取最新利率
          const rates = await getBestLendingRates();
          const currentRate = rates[offer.currency]?.rate || strategy.rate;
          
          // 創建新訂單
          await submitLendingOffer(apiKey, apiSecret, {
            ...strategy,
            amount: offer.amount,
            rate: Math.max(currentRate, strategy.rate) // 使用當前利率和策略利率中的較高者
          });
          
          console.log(`已為到期的${offer.currency}訂單自動續借，新利率: ${Math.max(currentRate, strategy.rate) * 100}%`);
        }
      }
    }
  } catch (error) {
    console.error('檢查到期訂單失敗:', error);
    throw error;
  }
}

/**
 * 提交放貸訂單
 */
export async function submitLendingOffer(apiKey: string, apiSecret: string, settings: LendingSettings) {
  try {
    const nonce = Date.now().toString();
    const dailyRate = settings.rate / 365; // 年利率轉換為日利率
    
    const body = {
      request: '/v1/offer/new',
      nonce,
      currency: settings.currency,
      amount: settings.amount.toString(),
      rate: dailyRate.toString(),
      period: settings.period,
      direction: 'lend'
    };
    
    const payload = Buffer.from(JSON.stringify(body)).toString('base64');
    const signature = crypto
      .createHmac('sha384', apiSecret)
      .update(payload)
      .digest('hex');
    
    const response = await axios.post('https://api.bitfinex.com/v1/offer/new', body, {
      headers: {
        'X-BFX-APIKEY': apiKey,
        'X-BFX-PAYLOAD': payload,
        'X-BFX-SIGNATURE': signature,
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('提交放貸訂單失敗:', error);
    throw error;
  }
}

/**
 * 獲取活躍的放貸訂單
 */
export async function getActiveOffers(apiKey: string, apiSecret: string) {
  try {
    const nonce = Date.now().toString();
    const body = {
      request: '/v1/offers',
      nonce
    };
    
    const payload = Buffer.from(JSON.stringify(body)).toString('base64');
    const signature = crypto
      .createHmac('sha384', apiSecret)
      .update(payload)
      .digest('hex');
    
    const response = await axios.post('https://api.bitfinex.com/v1/offers', body, {
      headers: {
        'X-BFX-APIKEY': apiKey,
        'X-BFX-PAYLOAD': payload,
        'X-BFX-SIGNATURE': signature,
      }
    });
    
    // 過濾出活躍的放貸訂單
    return response.data.filter((offer: any) => offer.direction === 'lend');
  } catch (error) {
    console.error('獲取活躍訂單失敗:', error);
    throw error;
  }
}

/**
 * 取消放貸訂單
 */
export async function cancelOffer(apiKey: string, apiSecret: string, offerId: number) {
  try {
    const nonce = Date.now().toString();
    const body = {
      request: '/v1/offer/cancel',
      nonce,
      offer_id: offerId
    };
    
    const payload = Buffer.from(JSON.stringify(body)).toString('base64');
    const signature = crypto
      .createHmac('sha384', apiSecret)
      .update(payload)
      .digest('hex');
    
    const response = await axios.post('https://api.bitfinex.com/v1/offer/cancel', body, {
      headers: {
        'X-BFX-APIKEY': apiKey,
        'X-BFX-PAYLOAD': payload,
        'X-BFX-SIGNATURE': signature,
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('取消放貸訂單失敗:', error);
    throw error;
  }
}

/**
 * 獲取放貸歷史
 */
export async function getLendingHistory(apiKey: string, apiSecret: string, limit: number = 50) {
  try {
    const nonce = Date.now().toString();
    const body = {
      request: '/v1/history',
      nonce,
      currency: 'all',
      limit: limit.toString()
    };
    
    const payload = Buffer.from(JSON.stringify(body)).toString('base64');
    const signature = crypto
      .createHmac('sha384', apiSecret)
      .update(payload)
      .digest('hex');
    
    const response = await axios.post('https://api.bitfinex.com/v1/history', body, {
      headers: {
        'X-BFX-APIKEY': apiKey,
        'X-BFX-PAYLOAD': payload,
        'X-BFX-SIGNATURE': signature,
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('獲取放貸歷史失敗:', error);
    throw error;
  }
}

/**
 * 更新放貸策略
 */
export function updateLendingStrategy(currency: string, strategy: LendingSettings) {
  lendingStrategies[currency] = strategy;
  return { success: true };
}

/**
 * 獲取當前放貸策略
 */
export function getLendingStrategies() {
  return lendingStrategies;
}