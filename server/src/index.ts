import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';

import apiRoutes from './api/routes';
import { initBitfinexService } from './services/bitfinex/bitfinexService';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// 中間件
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use(morgan('dev'));

// API路由
app.use('/api', apiRoutes);

// WebSocket連接
io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// 啟動服務器
const PORT = process.env.PORT || 5050;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // 初始化Bitfinex服務
  initBitfinexService(io);
});