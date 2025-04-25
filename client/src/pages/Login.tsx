import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid,
  Link,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(apiKey, apiSecret);
    } catch (err) {
      setError('登錄失敗，請檢查您的API密鑰和密碼');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh'
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            width: '100%' 
          }}
        >
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Bitfinex 自動放貸機器人
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            請輸入您的Bitfinex API密鑰以繼續
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="apiKey"
              label="API密鑰"
              name="apiKey"
              autoFocus
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="apiSecret"
              label="API密碼"
              type="password"
              id="apiSecret"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : '登入'}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="https://www.bitfinex.com/api" target="_blank" variant="body2">
                  如何獲取API密鑰?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          請確保您的API密鑰具有放貸操作權限
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;