import axios from 'axios';
import crypto from 'crypto';

/**
 * 獲取用戶錢包餘額
 */
export const getWalletBalances = async (apiKey: string, apiSecret: string) => {
  try {
    const nonce = Date.now().toString();
    const body = {
      request: '/v1/balances',
      nonce
    };

    const payload = Buffer.from(JSON.stringify(body)).toString('base64');
    const signature = crypto
      .createHmac('sha384', apiSecret)
      .update(payload)
      .digest('hex');

    const response = await axios.post('https://api.bitfinex.com/v1/balances', body, {
      headers: {
        'X-BFX-APIKEY': apiKey,
        'X-BFX-PAYLOAD': payload,
        'X-BFX-SIGNATURE': signature,
      }
    });

    // 過濾出存款錢包的餘額
    const depositWallets = response.data.filter((wallet: any) => wallet.type === 'deposit');
    
    return depositWallets;
  } catch (error) {
    console.error('獲取錢包餘額失敗:', error);
    throw error;
  }
};
