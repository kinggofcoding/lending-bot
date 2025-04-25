import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, Button, CircularProgress } from '@mui/material';
import { useSocket } from '../contexts/SocketContext';
import { getActiveOffers } from '../services/api';
import RateChart from '../components/RateChart';
import ActiveOffersList from '../components/ActiveOffersList';
import NewOfferForm from '../components/NewOfferForm';

interface RateData {
  [currency: string]: {
    rate: number;
    available: number;
  };
}

const Dashboard: React.FC = () => {
  const { socket } = useSocket();
  const [loading, setLoading] = useState(true);
  const [rateData, setRateData] = useState<RateData>({});
  const [activeOffers, setActiveOffers] = useState([]);

  useEffect(() => {
    // 加載活躍訂單
    const loadActiveOffers = async () => {
      try {
        const offers = await getActiveOffers();
        setActiveOffers(offers);
      } catch (error) {
        console.error('Failed to load active offers', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadActiveOffers();
    
    // 監聽實時利率更新
    if (socket) {
      socket.on('lending:rates', (rates: RateData) => {
        setRateData(rates);
      });
    }
    
    return () => {
      if (socket) {
        socket.off('lending:rates');
      }
    };
  }, [socket]);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bitfinex 放貸機器人儀表板
      </Typography>
      
      <Grid container spacing={3}>
        {/* 利率圖表 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              當前利率
            </Typography>
            {Object.keys(rateData).length > 0 ? (
              <RateChart data={rateData} />
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* 活躍訂單列表 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              活躍放貸訂單
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <ActiveOffersList offers={activeOffers} />
            )}
          </Paper>
        </Grid>
        
        {/* 新訂單表單 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              創建新放貸訂單
            </Typography>
            <NewOfferForm currentRates={rateData} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;