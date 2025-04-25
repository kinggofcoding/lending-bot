import { Server } from 'socket.io';
import axios from 'axios';
import crypto from 'crypto';

// Bitfinex API配置
const API_KEY = process.env.BITFINEX_API_KEY || '';
const API_SECRET = process.env.BITFINEX_API_SECRET || '';
const BITFINEX_API_URL = 'https://api.bitfinex.com';

// 代表放貸設置的接口
export interface LendingSettings {
  currency: string;
  amount: number;
  rate: number;
  period: number;
  autoRenew: boolean;
}

// 初始化Bitfinex服務
export function initBitfinexService(io: Server) {
  console.log('Initializing Bitfinex service');
  
  // 定期檢查最佳放貸利率
  setInterval(async () => {
    try {
      const rates = await getBestLendingRates();
      io.emit('lending:rates', rates);
    } catch (error) {
      console.error('Error fetching lending rates:', error);
    }
  }, 60000); // 每分鐘更新一次
}

// 獲取最佳放貸利率
async function getBestLendingRates() {
  try {
    const currencies = ['USD', 'BTC', 'ETH', 'UST'];
    const rates: Record<string, { rate: number, available: number }> = {};
    
    for (const currency of currencies) {
      const response = await axios.get(`${BITFINEX_API_URL}/v1/lendbook/${currency}`);
      if (response.data && response.data.asks && response.data.asks.length > 0) {
        const bestRate = parseFloat(response.data.asks[0].rate);
        const available = parseFloat(response.data.asks[0].amount);
        rates[currency] = { rate: bestRate, available };
      }
    }
    
    return rates;
  } catch (error) {
    console.error('Error fetching best lending rates:', error);
    throw error;
  }
}

// 提交放貸訂單
export async function submitLendingOffer(settings: LendingSettings) {
  try {
    const nonce = Date.now().toString();
    const body = {
      request: '/v1/offer/new',
      nonce,
      currency: settings.currency,
      amount: settings.amount.toString(),
      rate: (settings.rate / 365).toString(), // 年利率轉換為日利率
      period: settings.period,
      direction: 'lend'
    };
    
    const payload = Buffer.from(JSON.stringify(body)).toString('base64');
    const signature = crypto
      .createHmac('sha384', API_SECRET)
      .update(payload)
      .digest('hex');
    
    const response = await axios.post(`${BITFINEX_API_URL}/v1/offer/new`, body, {
      headers: {
        'X-BFX-APIKEY': API_KEY,
        'X-BFX-PAYLOAD': payload,
        'X-BFX-SIGNATURE': signature,
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error submitting lending offer:', error);
    throw error;
  }
}

// 獲取活躍的放貸訂單
export async function getActiveOffers() {
  try {
    const nonce = Date.now().toString();
    const body = {
      request: '/v1/offers',
      nonce
    };
    
    const payload = Buffer.from(JSON.stringify(body)).toString('base64');
    const signature = crypto
      .createHmac('sha384', API_SECRET)
      .update(payload)
      .digest('hex');
    
    const response = await axios.post(`${BITFINEX_API_URL}/v1/offers`, body, {
      headers: {
        'X-BFX-APIKEY': API_KEY,
        'X-BFX-PAYLOAD': payload,
        'X-BFX-SIGNATURE': signature,
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting active offers:', error);
    throw error;
  }
}