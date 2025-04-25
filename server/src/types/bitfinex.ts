export interface LendingSettings {
    currency: string;
    amount: number;
    rate: number;    // 年利率，例如0.05表示5%
    period: number;  // 期限，以天為單位
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