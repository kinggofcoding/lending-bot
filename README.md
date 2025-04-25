Bitfinex 自動放貸機器人
這是一個使用TypeScript開發的Bitfinex自動放貸機器人，幫助用戶自動化在Bitfinex平台上的資金放貸業務，尋找最佳利率並自動續借。
功能特點

即時監控Bitfinex不同貨幣的放貸利率
基於設定的策略自動提交放貸訂單
可視化儀表板展示當前利率和活躍訂單
支持自動續借功能
實時推送市場利率變化通知
支持多種數字貨幣（USD、BTC、ETH、USDT等）

技術棧
前端

React + TypeScript
Material UI 組件庫
React Router 路由管理
Socket.io Client 實時通訊
Chart.js 數據可視化

後端

Node.js + Express + TypeScript
Socket.io 實時通訊
Axios HTTP客戶端
Bitfinex API 整合

安裝與運行
環境要求

Node.js v16+
npm 或 yarn
Docker (可選)

使用Docker運行
最簡單的啟動方式是使用Docker Compose:

複製環境變量配置文件

bashcp .env.example .env

編輯.env文件，填入您的Bitfinex API密鑰

BITFINEX_API_KEY=your_api_key_here
BITFINEX_API_SECRET=your_api_secret_here

使用Docker Compose啟動服務

bashdocker-compose up -d
應用將在以下地址可用:

前端: http://localhost:3000
後端: http://localhost:5000

手動運行
後端設置

進入server目錄

bashcd server

安裝依賴

bashnpm install

啟動開發服務器

bashnpm run dev
前端設置

進入client目錄

bashcd client

安裝依賴

bashnpm install

啟動開發服務器

bashnpm start
配置
在.env文件中可以配置以下參數:

PORT: 後端服務器端口
CLIENT_URL: 前端URL (用於CORS配置)
BITFINEX_API_KEY: Bitfinex API密鑰
BITFINEX_API_SECRET: Bitfinex API密鑰
其他可選配置如資料庫連接參數等

Bitfinex API密鑰設置
要使用此機器人，您需要從Bitfinex獲取API密鑰:

登錄您的Bitfinex帳戶
前往API管理頁面
創建新API密鑰

確保API密鑰有以下權限:
讀取餘額
讀取資金記錄
發起資金操作
讀取放貸記錄
創建/取消放貸訂單



使用指南
登入系統

打開前端頁面 (默認為 http://localhost:3000)
輸入您的API密鑰和密鑰密碼 (也可在環境變數中預設)

儀表板
儀表板顯示關鍵信息:

各種貨幣的當前放貸利率
活躍的放貸訂單
歷史收益統計

創建放貸訂單

在儀表板頁面找到"創建新放貸訂單"表單
選擇貨幣類型 (USD, BTC, ETH等)
輸入放貸金額
設置目標年利率 (%)
設置放貸期限 (天數)
選擇是否自動續借
點擊"創建放貸訂單"按鈕提交

自動策略設置
在設置頁面，您可以配置自動放貸策略:

設置最低接受利率
配置資金分配比例
配置自動續借選項
設置利率變化提醒閾值

項目結構
bitfinex-lending-bot/
├── client/                 # 前端部分
│   ├── public/             # 靜態資源
│   └── src/                # 源代碼
│       ├── components/     # React組件
│       ├── pages/          # 頁面組件
│       ├── hooks/          # 自定義hooks
│       ├── services/       # API服務
│       ├── contexts/       # 上下文管理
│       ├── utils/          # 工具函數
│       └── types/          # TypeScript類型定義
│
├── server/                 # 後端部分
│   └── src/                # 源代碼
│       ├── api/            # API路由
│       ├── config/         # 配置文件
│       ├── controllers/    # 控制器
│       ├── models/         # 數據模型
│       ├── services/       # 業務邏輯服務
│       │   └── bitfinex/   # Bitfinex API交互
│       ├── utils/          # 工具函數
│       └── types/          # TypeScript類型
│
└── shared/                 # 前後端共享代碼
安全注意事項

請勿在公共場合共享您的API密鑰
建議只賦予API密鑰必要的最小權限
可以設置API密鑰的IP地址限制，只允許從特定IP訪問
定期審查API密鑰的使用情況

開發路線圖

 支持更多加密貨幣
 添加高級策略選項 (動態利率調整)
 歷史數據分析和收益報告
 電子郵件和移動通知
 自動化測試套件

貢獻
歡迎提交問題和拉取請求來幫助改進這個項目。
許可證
MIT
