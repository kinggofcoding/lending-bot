import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  TextField, 
  FormControlLabel, 
  Switch, 
  Button, 
  Divider,
  Slider,
  MenuItem,
  Alert,
} from '@mui/material';

interface LendingStrategy {
  enabled: boolean;
  minRate: number;
  autoRenew: boolean;
  preferredPeriod: number;
  rateNotification: number;
}

const Settings: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [strategies, setStrategies] = useState<Record<string, LendingStrategy>>({
    USD: { enabled: true, minRate: 2.5, autoRenew: true, preferredPeriod: 2, rateNotification: 5 },
    BTC: { enabled: true, minRate: 1.0, autoRenew: true, preferredPeriod: 2, rateNotification: 2 },
    ETH: { enabled: false, minRate: 0.5, autoRenew: false, preferredPeriod: 2, rateNotification: 1 },
    USDT: { enabled: true, minRate: 3.0, autoRenew: true, preferredPeriod: 2, rateNotification: 5 },
  });
  
  const handleStrategyChange = (currency: string, field: keyof LendingStrategy, value: any) => {
    setStrategies(prev => ({
      ...prev,
      [currency]: {
        ...prev[currency],
        [field]: value
      }
    }));
    setSaved(false);
  };
  
  const handleSave = () => {
    // 在實際應用中，這裡應該發送API請求來保存設置
    console.log('保存策略設置:', strategies);
    setSaved(true);
    
    // 3秒後清除保存成功消息
    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };
  
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        放貸策略設置
      </Typography>
      
      {saved && (
        <Alert severity="success" sx={{ mb: 2 }}>
          設置已成功保存！
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {Object.entries(strategies).map(([currency, strategy]) => (
          <Grid item xs={12} md={6} key={currency}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{currency} 策略</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={strategy.enabled}
                      onChange={(e) => handleStrategyChange(currency, 'enabled', e.target.checked)}
                    />
                  }
                  label={strategy.enabled ? '已啟用' : '已停用'}
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography gutterBottom>
                最低接受年利率: {strategy.minRate}%
              </Typography>
              <Slider
                value={strategy.minRate}
                onChange={(_, value) => handleStrategyChange(currency, 'minRate', value)}
                aria-labelledby="min-rate-slider"
                valueLabelDisplay="auto"
                step={0.1}
                marks
                min={0}
                max={10}
                disabled={!strategy.enabled}
              />
              
              <Box sx={{ mt: 3 }}>
                <TextField
                  select
                  label="首選放貸期限"
                  value={strategy.preferredPeriod}
                  onChange={(e) => handleStrategyChange(currency, 'preferredPeriod', parseInt(e.target.value))}
                  fullWidth
                  disabled={!strategy.enabled}
                  sx={{ mb: 2 }}
                >
                  <MenuItem value={2}>2天</MenuItem>
                  <MenuItem value={7}>7天</MenuItem>
                  <MenuItem value={14}>14天</MenuItem>
                  <MenuItem value={30}>30天</MenuItem>
                </TextField>
                
                <TextField
                  label="利率變動通知閾值 (%)"
                  type="number"
                  value={strategy.rateNotification}
                  onChange={(e) => handleStrategyChange(currency, 'rateNotification', parseFloat(e.target.value))}
                  fullWidth
                  inputProps={{ step: 0.1, min: 0 }}
                  disabled={!strategy.enabled}
                  sx={{ mb: 2 }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={strategy.autoRenew}
                      onChange={(e) => handleStrategyChange(currency, 'autoRenew', e.target.checked)}
                      disabled={!strategy.enabled}
                    />
                  }
                  label="自動續借"
                />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSave}
          size="large"
        >
          保存設置
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;