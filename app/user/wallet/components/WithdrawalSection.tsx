'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, WithdrawalRequest, PaymentMethod } from '@/app/user/types/wallet';
import { 
  getPaymentMethods, 
  createWithdrawalRequest, 
  cancelWithdrawalRequest,
  getWithdrawalFees 
} from '@/services/wallet/walletApi';
import PaymentMethodManager from './PaymentMethodManager';
import { 
  FaPlus, 
  FaCreditCard, 
  FaUniversity, 
  FaPaypal,
  FaBitcoin,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle 
} from 'react-icons/fa';

interface WithdrawalSectionProps {
  withdrawalRequests: WithdrawalRequest[];
  wallet: Wallet | null;
  userId: string;
  onRefresh: () => void;
}

const WithdrawalSection: React.FC<WithdrawalSectionProps> = ({
  withdrawalRequests,
  wallet,
  userId,
  onRefresh
}) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showNewWithdrawal, setShowNewWithdrawal] = useState(false);
  const [showPaymentMethodManager, setShowPaymentMethodManager] = useState(false);
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: '',
    paymentMethodId: ''
  });
  const [withdrawalFees, setWithdrawalFees] = useState<{
    fees: number;
    net_amount: number;
    processing_time: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPaymentMethods();
  }, [userId]);

  useEffect(() => {
    if (withdrawalForm.amount && withdrawalForm.paymentMethodId) {
      calculateFees();
    } else {
      setWithdrawalFees(null);
    }
  }, [withdrawalForm.amount, withdrawalForm.paymentMethodId]);

  const fetchPaymentMethods = async () => {
    try {
      const methods = await getPaymentMethods(userId);
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
    }
  };

  const calculateFees = async () => {
    try {
      const amount = parseFloat(withdrawalForm.amount);
      if (amount > 0 && withdrawalForm.paymentMethodId) {
        const fees = await getWithdrawalFees(userId, amount, withdrawalForm.paymentMethodId);
        setWithdrawalFees(fees);
      }
    } catch (error) {
      console.error('Failed to calculate fees:', error);
    }
  };

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawalForm.amount || !withdrawalForm.paymentMethodId) return;

    try {
      setLoading(true);
      setError(null);

      await createWithdrawalRequest(userId, {
        amount: parseFloat(withdrawalForm.amount),
        payment_method_id: withdrawalForm.paymentMethodId,
        currency: wallet?.currency
      });

      setWithdrawalForm({ amount: '', paymentMethodId: '' });
      setShowNewWithdrawal(false);
      setWithdrawalFees(null);
      onRefresh();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create withdrawal request');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelWithdrawal = async (withdrawalId: string) => {
    try {
      await cancelWithdrawalRequest(userId, withdrawalId);
      onRefresh();
    } catch (error) {
      console.error('Failed to cancel withdrawal:', error);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'bank_account': return <FaUniversity className="w-5 h-5" />;
      case 'paypal': return <FaPaypal className="w-5 h-5" />;
      case 'crypto_wallet': return <FaBitcoin className="w-5 h-5" />;
      default: return <FaCreditCard className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
      case 'processing': return <FaClock className="w-4 h-4 text-yellow-500" />;
      case 'rejected':
      case 'cancelled': return <FaTimesCircle className="w-4 h-4 text-red-500" />;
      default: return <FaClock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const availableBalance = wallet?.balance || 0;
  const minWithdrawal = 10; // Minimum withdrawal amount

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Withdrawals</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPaymentMethodManager(true)}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            <FaCreditCard className="w-4 h-4" />
            <span>Manage Payment Methods</span>
          </button>
          <button
            onClick={() => setShowNewWithdrawal(true)}
            disabled={availableBalance < minWithdrawal || paymentMethods.length === 0}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPlus className="w-4 h-4" />
            <span>New Withdrawal</span>
          </button>
        </div>
      </div>

      {/* Available Balance Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Available for Withdrawal</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {formatCurrency(availableBalance, wallet?.currency)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Minimum Withdrawal</p>
            <p className="text-lg font-medium text-gray-900">
              {formatCurrency(minWithdrawal, wallet?.currency)}
            </p>
          </div>
        </div>
        {availableBalance < minWithdrawal && (
          <div className="mt-4 flex items-center space-x-2 text-yellow-600">
            <FaExclamationTriangle className="w-4 h-4" />
            <span className="text-sm">
              You need at least {formatCurrency(minWithdrawal, wallet?.currency)} to make a withdrawal
            </span>
          </div>
        )}
      </div>

      {/* New Withdrawal Form */}
      {showNewWithdrawal && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">New Withdrawal Request</h3>
            <button
              onClick={() => {
                setShowNewWithdrawal(false);
                setWithdrawalForm({ amount: '', paymentMethodId: '' });
                setWithdrawalFees(null);
                setError(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Withdrawal Amount
              </label>
              <input
                type="number"
                min={minWithdrawal}
                max={availableBalance}
                step="0.01"
                value={withdrawalForm.amount}
                onChange={(e) => setWithdrawalForm({ ...withdrawalForm, amount: e.target.value })}
                placeholder={`Min: ${formatCurrency(minWithdrawal, wallet?.currency)}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                value={withdrawalForm.paymentMethodId}
                onChange={(e) => setWithdrawalForm({ ...withdrawalForm, paymentMethodId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a payment method</option>
                {paymentMethods.filter(method => method.is_verified && method.status === 'active').map(method => (
                  <option key={method.id} value={method.id}>
                    {method.name} ({method.type.replace('_', ' ')})
                  </option>
                ))}
              </select>
              {paymentMethods.filter(method => method.is_verified && method.status === 'active').length === 0 && (
                <p className="text-sm text-red-600 mt-1">
                  No verified payment methods available. Please add one first.
                </p>
              )}
            </div>

            {/* Fee Calculation */}
            {withdrawalFees && (
              <div className="bg-gray-50 rounded-md p-4">
                <h4 className="font-medium text-gray-900 mb-2">Withdrawal Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Withdrawal Amount:</span>
                    <span>{formatCurrency(parseFloat(withdrawalForm.amount), wallet?.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Fee:</span>
                    <span>{formatCurrency(withdrawalFees.fees, wallet?.currency)}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-1">
                    <span>You'll Receive:</span>
                    <span>{formatCurrency(withdrawalFees.net_amount, wallet?.currency)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Processing Time:</span>
                    <span>{withdrawalFees.processing_time}</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading || !withdrawalForm.amount || !withdrawalForm.paymentMethodId}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Submit Withdrawal Request'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNewWithdrawal(false);
                  setWithdrawalForm({ amount: '', paymentMethodId: '' });
                  setWithdrawalFees(null);
                  setError(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Withdrawal History */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Withdrawal History</h3>
        </div>

        {withdrawalRequests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No withdrawal requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {withdrawalRequests.map((request) => {
                  const paymentMethod = paymentMethods.find(method => method.id === request.payment_method_id);
                  
                  return (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Request #{request.id.slice(0, 8)}...
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(request.requested_at).toLocaleDateString()}
                          </div>
                          {request.processed_at && (
                            <div className="text-xs text-gray-500">
                              Processed: {new Date(request.processed_at).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {paymentMethod && getPaymentMethodIcon(paymentMethod.type)}
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-900">
                              {paymentMethod?.name || 'Unknown Method'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {paymentMethod?.type.replace('_', ' ') || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(request.amount, request.currency)}
                          </div>
                          {request.fees > 0 && (
                            <div className="text-xs text-gray-500">
                              Fee: {formatCurrency(request.fees, request.currency)}
                            </div>
                          )}
                          <div className="text-xs text-green-600">
                            Net: {formatCurrency(request.net_amount, request.currency)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(request.status)}
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </div>
                        {request.rejection_reason && (
                          <div className="text-xs text-red-600 mt-1">
                            {request.rejection_reason}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {request.status === 'pending' && (
                          <button
                            onClick={() => handleCancelWithdrawal(request.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Method Manager Modal */}
      {showPaymentMethodManager && (
        <PaymentMethodManager
          userId={userId}
          paymentMethods={paymentMethods}
          onClose={() => setShowPaymentMethodManager(false)}
          onUpdate={() => {
            fetchPaymentMethods();
            setShowPaymentMethodManager(false);
          }}
        />
      )}
    </div>
  );
};

export default WithdrawalSection;
