export interface LendingSettings {
    currency: string;
    amount: number;
    rate: number;
    period: number;
    autoRenew: boolean;
  }
  
  export interface LendingOffer {
    id: number;
    currency: string;
    amount: number;
    rate: number;
    period: number;
    direction: string;
    status: string;
    created_at: string;
    updated_at: string;
    expires_at: string;
  }
  
  export interface WalletBalance {
    currency: string;
    available: number;
    total: number;
  }
  
  export interface LendingHistory {
    id: number;
    currency: string;
    amount: number;
    rate: number;
    period: number;
    created_at: string;
    closed_at: string | null;
    status: string;
    earnings: number;
  }