import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  IconButton,
  Chip,
  Typography,
  Box
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

interface Offer {
  id: number;
  currency: string;
  amount: number;
  rate: number;
  period: number;
  status: string;
  created_at: string;
  expires_at: string;
}

interface ActiveOffersListProps {
  offers: Offer[];
}

const ActiveOffersList: React.FC<ActiveOffersListProps> = ({ offers }) => {
  if (offers.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          目前沒有活躍的放貸訂單
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>貨幣</TableCell>
            <TableCell align="right">金額</TableCell>
            <TableCell align="right">利率</TableCell>
            <TableCell align="right">期限</TableCell>
            <TableCell align="right">狀態</TableCell>
            <TableCell align="right">到期日</TableCell>
            <TableCell align="right">操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {offers.map((offer) => (
            <TableRow key={offer.id}>
              <TableCell component="th" scope="row">
                {offer.currency === 'UST' ? 'USDT' : offer.currency}
              </TableCell>
              <TableCell align="right">{offer.amount ? offer.amount.toFixed(2) : ''}</TableCell>
              <TableCell align="right">{offer.rate ? (offer.rate * 1).toFixed(2) : ''}%</TableCell>
              <TableCell align="right">{offer.period} 天</TableCell>
              <TableCell align="right">
                <Chip 
                  label={offer.status} 
                  color={offer.status === 'active' ? 'success' : 'default'} 
                  size="small" 
                />
              </TableCell>
              <TableCell align="right">{new Date(offer.expires_at).toLocaleDateString()}</TableCell>
              <TableCell align="right">
                <IconButton size="small" color="error">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ActiveOffersList;
