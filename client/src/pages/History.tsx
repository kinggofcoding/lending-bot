import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  CircularProgress,
  Chip
} from '@mui/material';

interface HistoryRecord {
  id: number;
  currency: string;
  amount: number;
  rate: number;
  period: number;
  status: string;
  created_at: string;
  completed_at: string | null;
  earnings: number;
}

const History: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  useEffect(() => {
    // 模擬API加載歷史記錄
    const loadHistory = async () => {
      // 實際應用中，這裡應該是從API獲取數據
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 生成模擬數據
      const mockHistory: HistoryRecord[] = Array.from({ length: 35 }, (_, i) => ({
        id: i + 1,
        currency: ['USD', 'BTC', 'ETH', 'USDT'][Math.floor(Math.random() * 4)],
        amount: parseFloat((Math.random() * 1000).toFixed(2)),
        rate: parseFloat((Math.random() * 0.1).toFixed(4)),
        period: [2, 7, 14, 30][Math.floor(Math.random() * 4)],
        status: ['completed', 'expired', 'canceled'][Math.floor(Math.random() * 3)],
        created_at: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
        completed_at: Math.random() > 0.2 ? new Date(Date.now() - Math.random() * 10 * 86400000).toISOString() : null,
        earnings: parseFloat((Math.random() * 10).toFixed(2)),
      }));
      
      setHistory(mockHistory);
      setLoading(false);
    };
    
    loadHistory();
  }, []);
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'expired':
        return 'warning';
      case 'canceled':
        return 'error';
      default:
        return 'default';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'expired':
        return '已過期';
      case 'canceled':
        return '已取消';
      default:
        return status;
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        放貸歷史記錄
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>貨幣</TableCell>
                    <TableCell align="right">金額</TableCell>
                    <TableCell align="right">年利率</TableCell>
                    <TableCell align="right">期限(天)</TableCell>
                    <TableCell align="center">狀態</TableCell>
                    <TableCell align="right">創建日期</TableCell>
                    <TableCell align="right">完成日期</TableCell>
                    <TableCell align="right">收益</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow key={row.id}>
                        <TableCell component="th" scope="row">
                          {row.id}
                        </TableCell>
                        <TableCell>{row.currency}</TableCell>
                        <TableCell align="right">{row.amount.toFixed(2)}</TableCell>
                        <TableCell align="right">{(row.rate * 100).toFixed(2)}%</TableCell>
                        <TableCell align="right">{row.period}</TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={getStatusLabel(row.status)}
                            color={getStatusColor(row.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">{formatDate(row.created_at)}</TableCell>
                        <TableCell align="right">{formatDate(row.completed_at)}</TableCell>
                        <TableCell align="right">
                          {row.status === 'completed' ? `+${row.earnings.toFixed(2)}` : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={history.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="每頁行數:"
            />
          </>
        )}
      </Paper>
    </Box>
  );
};

export default History;