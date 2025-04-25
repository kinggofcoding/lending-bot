import axios from 'axios';
import { LendingSettings } from '../types/bitfinex';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050/api';

// 獲取活躍放貸訂單
export const getActiveOffers = async () => {
  const response = await axios.get(`${API_URL}/offers`);
  console.log(response.data)
  return response.data;
};

// 創建新的放貸訂單
export const createOffer = async (settings: LendingSettings) => {
  const response = await axios.post(`${API_URL}/offers`, settings);
  return response.data;
};
