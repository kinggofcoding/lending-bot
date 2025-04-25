import React, { useState } from 'react';
import { 
  Box, TextField, MenuItem, Button, Grid, 
  FormControlLabel, Switch, Typography, Alert
} from '@mui/material';
import { createOffer } from '../services/api';
import { LendingSettings } from '../types/bitfinex';

interface RateData {
  [currency: string]: {
    rate: number;
    available: number;
  };
}

interface NewOfferFormProps {
  currentRates: RateData;
}

const NewOfferForm: React.FC<NewOfferFormProps> = ({ currentRates }) => {
  const [settings, setSettings] = useState<LendingSettings>({
    currency: 'USD',
    amount: 100,
    rate: 0.05, // 5%
    period: 2, // 2天
    autoRenew: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = event.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await createOffer(settings);
      setSuccess('成功創建放貸訂單！');
    } catch (err) {
      setError('創建訂單失敗，請檢查設置並重試');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="貨幣"
            name="currency"
            value={settings.currency}
            onChange={handleChange}
          >
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="BTC">BTC</MenuItem>
            <MenuItem value="ETH">ETH</MenuItem>
            <MenuItem value="USDT">USDT</MenuItem>
          </TextField>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="金額"
            name="amount"
            type="number"
            value={settings.amount}
            onChange={handleChange}
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="年利率 (%)"
            name="rate"
            type="number"
            value={settings.rate * 100}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setSettings(prev => ({
                ...prev,
                rate: value / 100
              }));
            }}
            inputProps={{ min: 0, step: 0.01 }}
            helperText={`當前最佳利率: ${
              currentRates[settings.currency] 
                ? (currentRates[settings.currency].rate * 100).toFixed(2) + '%' 
                : '載入中...'
            }`}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="期限 (天)"
            name="period"
            type="number"
            value={settings.period}
            onChange={handleChange}
            inputProps={{ min: 2, max: 30 }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch 
                checked={settings.autoRenew}
                onChange={handleChange}
                name="autoRenew"
              />
            }
            label="自動續借"
          />
        </Grid>
        
        <Grid item xs={12}>
          <Button 
            fullWidth 
            variant="contained" 
            color="primary" 
            type="submit"
            disabled={loading}
          >
            {loading ? '處理中...' : '創建放貸訂單'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewOfferForm;