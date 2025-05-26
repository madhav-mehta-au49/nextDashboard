// Wallet API service functions
import axios from 'axios';
import { Wallet, Transaction, PaymentMethod, WithdrawalRequest, WalletStats, ReferralProgram } from '../types/wallet';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Wallet Management
export const getWallet = async (userId: string): Promise<Wallet> => {
  const response = await axios.get(`${API_BASE}/users/${userId}/wallet`);
  return response.data.data;
};

export const getWalletStats = async (userId: string): Promise<WalletStats> => {
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
  const response = await axios.get(`${API_BASE}/users/${userId}/wallet/transactions`, { params });
  return response.data;
};

export const getTransaction = async (userId: string, transactionId: string): Promise<Transaction> => {
  const response = await axios.get(`${API_BASE}/users/${userId}/wallet/transactions/${transactionId}`);
  return response.data.data;
};

// Payment Methods
export const getPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  const response = await axios.get(`${API_BASE}/users/${userId}/payment-methods`);
  return response.data.data;
};

export const addPaymentMethod = async (userId: string, paymentMethod: Partial<PaymentMethod>): Promise<PaymentMethod> => {
  const response = await axios.post(`${API_BASE}/users/${userId}/payment-methods`, paymentMethod);
  return response.data.data;
};

export const updatePaymentMethod = async (
  userId: string, 
  paymentMethodId: string, 
  updates: Partial<PaymentMethod>
): Promise<PaymentMethod> => {
  const response = await axios.put(`${API_BASE}/users/${userId}/payment-methods/${paymentMethodId}`, updates);
  return response.data.data;
};

export const deletePaymentMethod = async (userId: string, paymentMethodId: string): Promise<void> => {
  await axios.delete(`${API_BASE}/users/${userId}/payment-methods/${paymentMethodId}`);
};

export const setDefaultPaymentMethod = async (userId: string, paymentMethodId: string): Promise<void> => {
  await axios.post(`${API_BASE}/users/${userId}/payment-methods/${paymentMethodId}/set-default`);
};

export const verifyPaymentMethod = async (userId: string, paymentMethodId: string, verificationData: any): Promise<void> => {
  await axios.post(`${API_BASE}/users/${userId}/payment-methods/${paymentMethodId}/verify`, verificationData);
};

// Withdrawal Management
export const getWithdrawalRequests = async (userId: string): Promise<WithdrawalRequest[]> => {
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
  const response = await axios.post(`${API_BASE}/users/${userId}/wallet/withdrawals`, withdrawalData);
  return response.data.data;
};

export const cancelWithdrawalRequest = async (userId: string, withdrawalId: string): Promise<void> => {
  await axios.post(`${API_BASE}/users/${userId}/wallet/withdrawals/${withdrawalId}/cancel`);
};

export const getWithdrawalFees = async (userId: string, amount: number, paymentMethodId: string): Promise<{
  fees: number;
  net_amount: number;
  processing_time: string;
}> => {
  const response = await axios.get(`${API_BASE}/users/${userId}/wallet/withdrawal-fees`, {
    params: { amount, payment_method_id: paymentMethodId }
  });
  return response.data.data;
};

// Referral Program
export const getReferralProgram = async (userId: string): Promise<ReferralProgram> => {
  const response = await axios.get(`${API_BASE}/users/${userId}/referral-program`);
  return response.data.data;
};

export const generateReferralCode = async (userId: string): Promise<{ code: string }> => {
  const response = await axios.post(`${API_BASE}/users/${userId}/referral-program/generate-code`);
  return response.data.data;
};

export const getReferralEarnings = async (userId: string): Promise<{
  total_referrals: number;
  total_earnings: number;
  recent_referrals: any[];
}> => {
  const response = await axios.get(`${API_BASE}/users/${userId}/referral-program/earnings`);
  return response.data.data;
};

// Earnings Management
export const getEarningsSummary = async (userId: string, period: 'week' | 'month' | 'year' = 'month'): Promise<{
  total_earnings: number;
  earnings_by_source: { [key: string]: number };
  earnings_timeline: { date: string; amount: number }[];
}> => {
  const response = await axios.get(`${API_BASE}/users/${userId}/wallet/earnings`, { params: { period } });
  return response.data.data;
};

// Wallet Actions
export const addFunds = async (userId: string, amount: number, paymentMethodId: string): Promise<Transaction> => {
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
  const response = await axios.post(`${API_BASE}/users/${userId}/wallet/purchase-premium`, {
    service_type: serviceType,
    duration
  });
  return response.data.data;
};

// Notifications
export const getWalletNotifications = async (userId: string): Promise<any[]> => {
  const response = await axios.get(`${API_BASE}/users/${userId}/wallet/notifications`);
  return response.data.data;
};

export const markNotificationRead = async (userId: string, notificationId: string): Promise<void> => {
  await axios.post(`${API_BASE}/users/${userId}/wallet/notifications/${notificationId}/read`);
};
