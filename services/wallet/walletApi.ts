// Wallet API service functions
import axios from 'axios';
import { Wallet, Transaction, PaymentMethod, WithdrawalRequest, WalletStats, ReferralProgram } from '@/app/user/types/wallet';
import {
  mockWallet,
  mockTransactions,
  mockPaymentMethods,
  mockWithdrawalRequests,
  mockWalletStats,
  mockReferralProgram,
  mockEarningsSummary,
  mockReferralEarnings,
  mockWithdrawalFees,
  mockWalletNotifications,
  generateMockTransactions
} from './mockData';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Mock mode flag - set to true to use mock data
const USE_MOCK_DATA = true;

// Helper function to simulate API delay
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Wallet Management
export const getWallet = async (userId: string): Promise<Wallet> => {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return mockWallet;
  }
  const response = await axios.get(`${API_BASE}/users/${userId}/wallet`);
  return response.data.data;
};

export const getWalletStats = async (userId: string): Promise<WalletStats> => {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return mockWalletStats;
  }
  const response = await axios.get(`${API_BASE}/users/${userId}/wallet/stats`);
  return response.data.data;
};

// Transaction Management
export const getTransactions = async (
  userId: string, 
  params?: {
    type?: 'credit' | 'debit';
    category?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
    page?: number;
  }
): Promise<{ data: Transaction[]; pagination: any }> => {
  if (USE_MOCK_DATA) {
    await mockDelay();
    let filteredTransactions = [...mockTransactions];
    
    // Apply filters
    if (params?.type) {
      filteredTransactions = filteredTransactions.filter(t => t.type === params.type);
    }
    if (params?.category) {
      filteredTransactions = filteredTransactions.filter(t => t.category === params.category);
    }
    if (params?.status) {
      filteredTransactions = filteredTransactions.filter(t => t.status === params.status);
    }
    
    // Sort by created_at desc
    filteredTransactions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    // Apply pagination
    const limit = params?.limit || 10;
    const page = params?.page || 1;
    const offset = (page - 1) * limit;
    const paginatedData = filteredTransactions.slice(offset, offset + limit);
    
    return {
      data: paginatedData,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(filteredTransactions.length / limit),
        total_items: filteredTransactions.length,
        per_page: limit
      }
    };
  }
  const response = await axios.get(`${API_BASE}/users/${userId}/wallet/transactions`, { params });
  return response.data;
};

export const getTransaction = async (userId: string, transactionId: string): Promise<Transaction> => {
  if (USE_MOCK_DATA) {
    await mockDelay();
    const transaction = mockTransactions.find(t => t.id === transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return transaction;
  }
  const response = await axios.get(`${API_BASE}/users/${userId}/wallet/transactions/${transactionId}`);
  return response.data.data;
};

// Payment Methods
export const getPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return mockPaymentMethods;
  }
  const response = await axios.get(`${API_BASE}/users/${userId}/payment-methods`);
  return response.data.data;
};

export const addPaymentMethod = async (userId: string, paymentMethod: Partial<PaymentMethod>): Promise<PaymentMethod> => {
  if (USE_MOCK_DATA) {
    await mockDelay();
    const newPaymentMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      user_id: userId,
      type: paymentMethod.type || 'bank_account',
      name: paymentMethod.name || 'New Payment Method',
      details: paymentMethod.details || {},
      is_verified: false,
      is_default: false,
      status: 'pending_verification',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...paymentMethod
    };
    return newPaymentMethod;
  }
  const response = await axios.post(`${API_BASE}/users/${userId}/payment-methods`, paymentMethod);
  return response.data.data;
};

export const updatePaymentMethod = async (
  userId: string, 
  paymentMethodId: string, 
  updates: Partial<PaymentMethod>
): Promise<PaymentMethod> => {
  if (USE_MOCK_DATA) {
    await mockDelay();
    const paymentMethod = mockPaymentMethods.find(pm => pm.id === paymentMethodId);
    if (!paymentMethod) {
      throw new Error('Payment method not found');
    }
    return { ...paymentMethod, ...updates, updated_at: new Date().toISOString() };
  }
  const response = await axios.put(`${API_BASE}/users/${userId}/payment-methods/${paymentMethodId}`, updates);
  return response.data.data;
};

export const deletePaymentMethod = async (userId: string, paymentMethodId: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return;
  }
  await axios.delete(`${API_BASE}/users/${userId}/payment-methods/${paymentMethodId}`);
};

export const setDefaultPaymentMethod = async (userId: string, paymentMethodId: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return;
  }
  await axios.post(`${API_BASE}/users/${userId}/payment-methods/${paymentMethodId}/set-default`);
};

export const verifyPaymentMethod = async (userId: string, paymentMethodId: string, verificationData: any): Promise<void> => {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return;
  }
  await axios.post(`${API_BASE}/users/${userId}/payment-methods/${paymentMethodId}/verify`, verificationData);
};

// Withdrawal Management
export const getWithdrawalRequests = async (userId: string): Promise<WithdrawalRequest[]> => {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return mockWithdrawalRequests;
  }
  const response = await axios.get(`${API_BASE}/users/${userId}/wallet/withdrawals`);
  return response.data.data;
};

export const createWithdrawalRequest = async (
  userId: string, 
  withdrawalData: {
    payment_method_id: string;
    amount: number;
    currency?: string;
  }
): Promise<WithdrawalRequest> => {
  if (USE_MOCK_DATA) {
    await mockDelay();
    const newWithdrawal: WithdrawalRequest = {
      id: `wd_${Date.now()}`,
      wallet_id: 'wallet_1',
      payment_method_id: withdrawalData.payment_method_id,
      amount: withdrawalData.amount,
      currency: withdrawalData.currency || 'USD',
      status: 'pending',
      requested_at: new Date().toISOString(),
      fees: withdrawalData.amount * 0.01, // 1% fee
      net_amount: withdrawalData.amount * 0.99,
      processing_time_estimate: '1-2 business days'
    };
    return newWithdrawal;
  }
  const response = await axios.post(`${API_BASE}/users/${userId}/wallet/withdrawals`, withdrawalData);
  return response.data.data;
};

export const cancelWithdrawalRequest = async (userId: string, withdrawalId: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return;
  }
  await axios.post(`${API_BASE}/users/${userId}/wallet/withdrawals/${withdrawalId}/cancel`);
};

export const getWithdrawalFees = async (userId: string, amount: number, paymentMethodId: string): Promise<{
  fees: number;
  net_amount: number;
  processing_time: string;
}> => {
  if (USE_MOCK_DATA) {
    await mockDelay();
    const fees = amount * 0.01; // 1% fee
    return {
      fees,
      net_amount: amount - fees,
      processing_time: '1-2 business days'
    };
  }
  const response = await axios.get(`${API_BASE}/users/${userId}/wallet/withdrawal-fees`, {
    params: { amount, payment_method_id: paymentMethodId }
  });
  return response.data.data;
};

// Referral Program
export const getReferralProgram = async (userId: string): Promise<ReferralProgram> => {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return mockReferralProgram;
  }
  const response = await axios.get(`${API_BASE}/users/${userId}/referral-program`);
  return response.data.data;
};

export const generateReferralCode = async (userId: string): Promise<{ code: string }> => {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return { code: `USER${userId.slice(-4).toUpperCase()}2025` };
  }
  const response = await axios.post(`${API_BASE}/users/${userId}/referral-program/generate-code`);
  return response.data.data;
};

export const getReferralEarnings = async (userId: string): Promise<{
  total_referrals: number;
  total_earnings: number;
  recent_referrals: any[];
}> => {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return mockReferralEarnings;
  }
  const response = await axios.get(`${API_BASE}/users/${userId}/referral-program/earnings`);
  return response.data.data;
};

// Earnings Management
export const getEarningsSummary = async (userId: string, period: 'week' | 'month' | 'year' = 'month'): Promise<{
  total_earnings: number;
  earnings_by_source: { [key: string]: number };
  earnings_timeline: { date: string; amount: number }[];
}> => {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return mockEarningsSummary;
  }
  const response = await axios.get(`${API_BASE}/users/${userId}/wallet/earnings`, { params: { period } });
  return response.data.data;
};

// Wallet Actions
export const addFunds = async (userId: string, amount: number, paymentMethodId: string): Promise<Transaction> => {
  if (USE_MOCK_DATA) {
    await mockDelay();
    const newTransaction: Transaction = {
      id: `txn_${Date.now()}`,
      wallet_id: 'wallet_1',
      type: 'credit',
      category: 'payment',
      amount,
      currency: 'USD',
      description: `Added funds via payment method`,
      status: 'completed',      metadata: {
        payment_method_id: paymentMethodId
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return newTransaction;
  }
  const response = await axios.post(`${API_BASE}/users/${userId}/wallet/add-funds`, {
    amount,
    payment_method_id: paymentMethodId
  });
  return response.data.data;
};

export const transferFunds = async (
  userId: string, 
  recipientId: string, 
  amount: number, 
  description?: string
): Promise<Transaction> => {
  if (USE_MOCK_DATA) {
    await mockDelay();
    const newTransaction: Transaction = {
      id: `txn_${Date.now()}`,
      wallet_id: 'wallet_1',
      type: 'debit',
      category: 'payment',
      amount,
      currency: 'USD',
      description: description || `Transfer to user ${recipientId}`,
      status: 'completed',
      metadata: {
        recipient_id: recipientId
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return newTransaction;
  }
  const response = await axios.post(`${API_BASE}/users/${userId}/wallet/transfer`, {
    recipient_id: recipientId,
    amount,
    description
  });
  return response.data.data;
};

// Premium Services
export const purchasePremiumService = async (
  userId: string, 
  serviceType: string, 
  duration: number
): Promise<Transaction> => {
  if (USE_MOCK_DATA) {
    await mockDelay();
    const serviceAmounts = {
      'profile_boost': 29.99,
      'priority_listing': 19.99,
      'premium_badge': 9.99
    };
    const amount = serviceAmounts[serviceType as keyof typeof serviceAmounts] || 29.99;
    
    const newTransaction: Transaction = {
      id: `txn_${Date.now()}`,
      wallet_id: 'wallet_1',
      type: 'debit',
      category: 'payment',
      amount,
      currency: 'USD',
      description: `Premium service: ${serviceType} for ${duration} months`,
      reference_type: 'premium_service',
      reference_id: `service_${Date.now()}`,
      status: 'completed',
      metadata: {
        service_type: serviceType,
        duration: duration
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return newTransaction;
  }
  const response = await axios.post(`${API_BASE}/users/${userId}/wallet/purchase-premium`, {
    service_type: serviceType,
    duration
  });
  return response.data.data;
};

// Notifications
export const getWalletNotifications = async (userId: string): Promise<any[]> => {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return mockWalletNotifications;
  }
  const response = await axios.get(`${API_BASE}/users/${userId}/wallet/notifications`);
  return response.data.data;
};

export const markNotificationRead = async (userId: string, notificationId: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return;
  }
  await axios.post(`${API_BASE}/users/${userId}/wallet/notifications/${notificationId}/read`);
};
