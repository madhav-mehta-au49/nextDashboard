// Mock data for wallet system testing
import { Wallet, Transaction, PaymentMethod, WithdrawalRequest, WalletStats, ReferralProgram } from '@/app/user/types/wallet';

// Mock Wallet Data
export const mockWallet: Wallet = {
  id: 'wallet_1',
  user_id: 'user_123',
  balance: 2450.75,
  total_earned: 8320.50,
  total_withdrawn: 5869.75,
  pending_withdrawals: 250.00,
  currency: 'USD',
  status: 'active',
  created_at: '2024-01-15T10:30:00Z',
  updated_at: '2025-05-26T08:15:00Z'
};

// Mock Transactions Data
export const mockTransactions: Transaction[] = [
  {
    id: 'txn_001',
    wallet_id: 'wallet_1',
    type: 'credit',
    category: 'earning',
    amount: 150.00,
    currency: 'USD',
    description: 'Job completion bonus - Senior React Developer',
    reference_type: 'job_completion',
    reference_id: 'job_456',
    status: 'completed',
    metadata: {
      job_id: 'job_456',
      company_id: 'company_789'
    },
    created_at: '2025-05-25T14:30:00Z',
    updated_at: '2025-05-25T14:30:00Z'
  },
  {
    id: 'txn_002',
    wallet_id: 'wallet_1',
    type: 'credit',
    category: 'bonus',
    amount: 50.00,
    currency: 'USD',
    description: 'Referral bonus - John Doe joined',
    reference_type: 'referral',
    reference_id: 'ref_123',
    status: 'completed',
    metadata: {
      referral_id: 'ref_123'
    },
    created_at: '2025-05-24T09:15:00Z',
    updated_at: '2025-05-24T09:15:00Z'
  },
  {
    id: 'txn_003',
    wallet_id: 'wallet_1',
    type: 'debit',
    category: 'withdrawal',
    amount: 500.00,
    currency: 'USD',
    description: 'Withdrawal to Bank Account ***1234',
    reference_type: 'withdrawal_request',
    reference_id: 'wd_001',
    status: 'completed',
    metadata: {
      withdrawal_method: 'bank_account'
    },
    created_at: '2025-05-23T16:45:00Z',
    updated_at: '2025-05-23T18:20:00Z'
  },
  {
    id: 'txn_004',
    wallet_id: 'wallet_1',
    type: 'credit',
    category: 'earning',
    amount: 200.00,
    currency: 'USD',
    description: 'Profile view milestone reward',
    reference_type: 'premium_service',
    reference_id: 'milestone_001',
    status: 'completed',
    created_at: '2025-05-22T11:20:00Z',
    updated_at: '2025-05-22T11:20:00Z'
  },
  {
    id: 'txn_005',
    wallet_id: 'wallet_1',
    type: 'debit',
    category: 'fee',
    amount: 5.00,
    currency: 'USD',
    description: 'Transaction fee for withdrawal',
    reference_type: 'withdrawal_request',
    reference_id: 'wd_001',
    status: 'completed',
    created_at: '2025-05-23T16:45:00Z',
    updated_at: '2025-05-23T18:20:00Z'
  }
];

// Mock Payment Methods
export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_001',
    user_id: 'user_123',
    type: 'bank_account',
    name: 'Chase Checking Account',
    details: {
      account_number: '****1234',
      routing_number: '021000021',
      bank_name: 'Chase Bank',
      account_holder_name: 'John Doe'
    },
    is_verified: true,
    is_default: true,
    status: 'active',
    created_at: '2024-02-10T08:30:00Z',
    updated_at: '2024-02-10T08:30:00Z'
  },
  {
    id: 'pm_002',
    user_id: 'user_123',
    type: 'paypal',
    name: 'PayPal Account',
    details: {
      paypal_email: 'john.doe@email.com'
    },
    is_verified: true,
    is_default: false,
    status: 'active',
    created_at: '2024-03-15T12:00:00Z',
    updated_at: '2024-03-15T12:00:00Z'
  },
  {
    id: 'pm_003',
    user_id: 'user_123',
    type: 'crypto_wallet',
    name: 'Bitcoin Wallet',
    details: {
      crypto_address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      crypto_type: 'BTC'
    },
    is_verified: false,
    is_default: false,
    status: 'pending_verification',
    created_at: '2025-05-20T15:30:00Z',
    updated_at: '2025-05-20T15:30:00Z'
  }
];

// Mock Withdrawal Requests
export const mockWithdrawalRequests: WithdrawalRequest[] = [
  {
    id: 'wd_001',
    wallet_id: 'wallet_1',
    payment_method_id: 'pm_001',
    amount: 500.00,
    currency: 'USD',
    status: 'completed',
    requested_at: '2025-05-23T16:45:00Z',
    processed_at: '2025-05-23T18:20:00Z',
    transaction_id: 'txn_003',
    fees: 5.00,
    net_amount: 495.00,
    processing_time_estimate: '1-2 business days'
  },
  {
    id: 'wd_002',
    wallet_id: 'wallet_1',
    payment_method_id: 'pm_002',
    amount: 250.00,
    currency: 'USD',
    status: 'pending',
    requested_at: '2025-05-26T10:15:00Z',
    fees: 2.50,
    net_amount: 247.50,
    processing_time_estimate: 'Within 24 hours'
  }
];

// Mock Wallet Stats
export const mockWalletStats: WalletStats = {
  current_balance: 2450.75,
  total_earned: 8320.50,
  total_withdrawn: 5869.75,
  pending_withdrawals: 250.00,
  this_month_earnings: 675.00,
  last_month_earnings: 520.00,
  top_earning_source: {
    type: 'job_completion',
    name: 'Job Completions',
    description: 'Earnings from completed job projects',
    rate: 150.00,
    currency: 'USD',
    is_active: true
  },
  recent_transactions: mockTransactions.slice(0, 5)
};

// Mock Referral Program
export const mockReferralProgram: ReferralProgram = {
  id: 'ref_prog_001',
  code: 'JOHNDOE2025',
  referrer_bonus: 50.00,
  referee_bonus: 25.00,
  min_qualification: 'Complete profile and apply to at least 3 jobs',
  is_active: true,
  usage_count: 12,
  total_earned: 600.00
};

// Mock Earnings Summary
export const mockEarningsSummary = {
  total_earnings: 675.00,
  earnings_by_source: {
    job_completion: 450.00,
    referral_bonus: 125.00,
    profile_views: 75.00,
    skill_endorsement: 25.00
  },
  earnings_timeline: [
    { date: '2025-05-26', amount: 50.00 },
    { date: '2025-05-25', amount: 150.00 },
    { date: '2025-05-24', amount: 75.00 },
    { date: '2025-05-23', amount: 200.00 },
    { date: '2025-05-22', amount: 100.00 },
    { date: '2025-05-21', amount: 0.00 },
    { date: '2025-05-20', amount: 100.00 }
  ]
};

// Mock Referral Earnings
export const mockReferralEarnings = {
  total_referrals: 12,
  total_earnings: 600.00,
  recent_referrals: [
    {
      id: 'ref_001',
      name: 'Alice Johnson',
      created_at: '2025-05-24T09:15:00Z',
      bonus_amount: 50.00,
      status: 'qualified'
    },
    {
      id: 'ref_002',
      name: 'Bob Smith',
      created_at: '2025-05-20T14:30:00Z',
      bonus_amount: 50.00,
      status: 'qualified'
    },
    {
      id: 'ref_003',
      name: 'Carol Davis',
      created_at: '2025-05-18T11:45:00Z',
      bonus_amount: 50.00,
      status: 'qualified'
    },
    {
      id: 'ref_004',
      name: 'David Wilson',
      created_at: '2025-05-15T16:20:00Z',
      bonus_amount: 50.00,
      status: 'pending'
    }
  ]
};

// Mock Withdrawal Fees
export const mockWithdrawalFees = {
  fees: 5.00,
  net_amount: 495.00,
  processing_time: '1-2 business days'
};

// Mock Wallet Notifications
export const mockWalletNotifications = [
  {
    id: 'notif_001',
    type: 'withdrawal_completed',
    title: 'Withdrawal Completed',
    message: 'Your withdrawal of $500.00 has been processed successfully.',
    created_at: '2025-05-23T18:20:00Z',
    read: false
  },
  {
    id: 'notif_002',
    type: 'referral_bonus',
    title: 'Referral Bonus Earned',
    message: 'You earned $50.00 for referring Alice Johnson.',
    created_at: '2025-05-24T09:15:00Z',
    read: false
  },
  {
    id: 'notif_003',
    type: 'earning_received',
    title: 'Payment Received',
    message: 'You received $150.00 for completing the Senior React Developer project.',
    created_at: '2025-05-25T14:30:00Z',
    read: true
  }
];

// Utility functions for generating more mock data
export const generateMockTransaction = (overrides: Partial<Transaction> = {}): Transaction => {
  const baseTransaction: Transaction = {
    id: `txn_${Date.now()}`,
    wallet_id: 'wallet_1',
    type: Math.random() > 0.7 ? 'debit' : 'credit',
    category: 'earning',
    amount: Math.floor(Math.random() * 500) + 50,
    currency: 'USD',
    description: 'Mock transaction',
    status: 'completed',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  };
  
  return baseTransaction;
};

export const generateMockTransactions = (count: number): Transaction[] => {
  return Array.from({ length: count }, (_, index) => 
    generateMockTransaction({
      id: `txn_mock_${index + 1}`,
      created_at: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString()
    })
  );
};
