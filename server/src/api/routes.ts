import { Router } from 'express';
import { submitLendingOffer, LendingSettings } from '../services/bitfinex/bitfinexService';
import { getActiveOffers } from '../services/bitfinex/lendingService';

const router = Router();

const apiKey = process.env.BITFINEX_API_KEY || '60a3be019c0e19f0b93edcf5b1fb8edb45aa1213add'
const apiSecret = process.env.BITFINEX_API_SECRET || '47c3896d7b4149b120e2535614e7d61dfa34b0d177e'

// 獲取活躍放貸訂單
router.get('/offers', async (req, res) => {
  try {
    const offers = await getActiveOffers(apiKey, apiSecret);
    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active offers' });
  }
});

// 創建新的放貸訂單
router.post('/offers', async (req, res) => {
  try {
    const settings: LendingSettings = req.body;
    const result = await submitLendingOffer(settings);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit lending offer' });
  }
});

export default router;