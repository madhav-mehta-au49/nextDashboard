// Wallet system types
export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  total_earned: number;
  total_withdrawn: number;
  pending_withdrawals: number;
  currency: string;
  status: 'active' | 'suspended' | 'frozen';
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  type: 'credit' | 'debit';
  category: 'earning' | 'withdrawal' | 'refund' | 'fee' | 'bonus' | 'payment';
  amount: number;
  currency: string;
  description: string;
  reference_type?: 'job_completion' | 'referral' | 'premium_service' | 'withdrawal_request';
  reference_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';  metadata?: {
    job_id?: string;
    company_id?: string;
    referral_id?: string;
    withdrawal_method?: string;
    payment_method_id?: string;
    recipient_id?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  type: 'bank_account' | 'paypal' | 'stripe' | 'crypto_wallet';
  name: string;
  details: {
    account_number?: string;
    routing_number?: string;
    bank_name?: string;
    account_holder_name?: string;
    paypal_email?: string;
    crypto_address?: string;
    crypto_type?: string;
  };
  is_verified: boolean;
  is_default: boolean;
  status: 'active' | 'inactive' | 'pending_verification';
  created_at: string;
  updated_at: string;
}

export interface WithdrawalRequest {
  id: string;
  wallet_id: string;
  payment_method_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected' | 'cancelled';
  requested_at: string;
  processed_at?: string;
  rejection_reason?: string;
  transaction_id?: string;
  fees: number;
  net_amount: number;
  processing_time_estimate: string;
}

export interface EarningSource {
  type: 'job_completion' | 'referral_bonus' | 'profile_views' | 'skill_endorsement';
  name: string;
  description: string;
  rate?: number;
  currency?: string;
  is_active: boolean;
}

export interface WalletStats {
  current_balance: number;
  total_earned: number;
  total_withdrawn: number;
  pending_withdrawals: number;
  this_month_earnings: number;
  last_month_earnings: number;
  top_earning_source: EarningSource;
  recent_transactions: Transaction[];
}

export interface ReferralProgram {
  id: string;
  code: string;
  referrer_bonus: number;
  referee_bonus: number;
  min_qualification: string;
  is_active: boolean;
  usage_count: number;
  total_earned: number;
}
