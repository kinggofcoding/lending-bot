import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: (apiKey: string, apiSecret: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 檢查本地存儲中是否有認證令牌
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      setIsAuthenticated(!!token);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (apiKey: string, apiSecret: string) => {
    // 在實際應用中，這裡應該發送API請求進行驗證
    // 出於演示目的，我們只是模擬API驗證
    
    // 模擬API請求延遲
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 保存認證信息到本地存儲
    localStorage.setItem('auth_token', 'demo_token');
    localStorage.setItem('api_key', apiKey);
    
    // 更新認證狀態
    setIsAuthenticated(true);
    
    // 導航到儀表板
    navigate('/');
  };

  const logout = () => {
    // 清除本地存儲的認證信息
    localStorage.removeItem('auth_token');
    localStorage.removeItem('api_key');
    
    // 更新認證狀態
    setIsAuthenticated(false);
    
    // 導航到登錄頁面
    navigate('/login');
  };

  const value = {
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};