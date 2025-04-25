import axios from 'axios';
import crypto from 'crypto';

/**
 * 驗證Bitfinex API憑證
 */
export const validateBitfinexCredentials = async (apiKey: string, apiSecret: string): Promise<boolean> => {
  try {
    // 構建請求參數
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

    // 發送請求到Bitfinex API
    const response = await axios.post('https://api.bitfinex.com/v1/balances', body, {
      headers: {
        'X-BFX-APIKEY': apiKey,
        'X-BFX-PAYLOAD': payload,
        'X-BFX-SIGNATURE': signature,
      }
    });

    // 如果請求成功，憑證有效
    return response.status === 200;
  } catch (error) {
    // 請求失敗，憑證無效或其他錯誤
    console.error('驗證Bitfinex憑證失敗:', error);
    return false;
  }
};