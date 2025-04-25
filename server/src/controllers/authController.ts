import { Request, Response } from 'express';
import { validateBitfinexCredentials } from '../services/bitfinex/authService';

/**
 * 處理用戶登錄
 */
export const login = async (req: Request, res: Response) => {
  const { apiKey, apiSecret } = req.body;

  if (!apiKey || !apiSecret) {
    return res.status(400).json({ error: 'API密鑰和密碼是必須的' });
  }

  try {
    // 驗證Bitfinex API憑證
    const isValid = await validateBitfinexCredentials(apiKey, apiSecret);
    
    if (!isValid) {
      return res.status(401).json({ error: '無效的API憑證' });
    }

    // 在實際應用中，這裡應該創建和返回JWT令牌
    res.json({
      success: true,
      token: 'demo_token', // 在實際應用中應該是JWT令牌
      expiresIn: 3600, // 令牌過期時間（秒）
    });
  } catch (error) {
    console.error('登錄失敗:', error);
    res.status(500).json({ error: '登錄時發生錯誤' });
  }
};
