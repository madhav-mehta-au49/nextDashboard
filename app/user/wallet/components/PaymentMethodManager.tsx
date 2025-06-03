'use client';

import React, { useState } from 'react';
import { PaymentMethod } from '@/app/user/types/wallet';
import {
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod
} from '@/services/wallet/walletApi';
import {
  FaUniversity,
  FaPaypal,
  FaBitcoin,
  FaCreditCard,
  FaPlus,
  FaEdit,
  FaTrash,
  FaStar,
  FaTimes,
  FaCheck
} from 'react-icons/fa';

interface PaymentMethodManagerProps {
  userId: string;
  paymentMethods: PaymentMethod[];
  onClose: () => void;
  onUpdate: () => void;
}

const PaymentMethodManager: React.FC<PaymentMethodManagerProps> = ({
  userId,
  paymentMethods,
  onClose,
  onUpdate
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'bank_account' as 'bank_account' | 'paypal' | 'stripe' | 'crypto_wallet',
    name: '',
    details: {
      account_number: '',
      routing_number: '',
      bank_name: '',
      account_holder_name: '',
      paypal_email: '',
      crypto_address: '',
      crypto_type: ''
    }
  });

  const resetForm = () => {
    setFormData({
      type: 'bank_account',
      name: '',
      details: {
        account_number: '',
        routing_number: '',
        bank_name: '',
        account_holder_name: '',
        paypal_email: '',
        crypto_address: '',
        crypto_type: ''
      }
    });
    setEditingMethod(null);
    setShowAddForm(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingMethod) {
        await updatePaymentMethod(userId, editingMethod.id, {
          name: formData.name,
          details: formData.details
        });
      } else {
        await addPaymentMethod(userId, {
          type: formData.type,
          name: formData.name,
          details: formData.details
        });
      }

      resetForm();
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save payment method');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (methodId: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return;

    try {
      setLoading(true);
      await deletePaymentMethod(userId, methodId);
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete payment method');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (methodId: string) => {
    try {
      setLoading(true);
      await setDefaultPaymentMethod(userId, methodId);
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to set default payment method');
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData({
      type: method.type,
      name: method.name,
      details: {
        account_number: method.details.account_number || '',
        routing_number: method.details.routing_number || '',
        bank_name: method.details.bank_name || '',
        account_holder_name: method.details.account_holder_name || '',
        paypal_email: method.details.paypal_email || '',
        crypto_address: method.details.crypto_address || '',
        crypto_type: method.details.crypto_type || ''
      }
    });
    setShowAddForm(true);
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'bank_account': return <FaUniversity className="w-5 h-5" />;
      case 'paypal': return <FaPaypal className="w-5 h-5" />;
      case 'crypto_wallet': return <FaBitcoin className="w-5 h-5" />;
      default: return <FaCreditCard className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending_verification': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderFormFields = () => {
    switch (formData.type) {
      case 'bank_account':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Holder Name
              </label>
              <input
                type="text"
                value={formData.details.account_holder_name}
                onChange={(e) => setFormData({
                  ...formData,
                  details: { ...formData.details, account_holder_name: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                value={formData.details.bank_name}
                onChange={(e) => setFormData({
                  ...formData,
                  details: { ...formData.details, bank_name: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={formData.details.account_number}
                onChange={(e) => setFormData({
                  ...formData,
                  details: { ...formData.details, account_number: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Routing Number
              </label>
              <input
                type="text"
                value={formData.details.routing_number}
                onChange={(e) => setFormData({
                  ...formData,
                  details: { ...formData.details, routing_number: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </>
        );

      case 'paypal':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PayPal Email
            </label>
            <input
              type="email"
              value={formData.details.paypal_email}
              onChange={(e) => setFormData({
                ...formData,
                details: { ...formData.details, paypal_email: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        );

      case 'crypto_wallet':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cryptocurrency Type
              </label>
              <select
                value={formData.details.crypto_type}
                onChange={(e) => setFormData({
                  ...formData,
                  details: { ...formData.details, crypto_type: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select cryptocurrency</option>
                <option value="bitcoin">Bitcoin (BTC)</option>
                <option value="ethereum">Ethereum (ETH)</option>
                <option value="usdc">USD Coin (USDC)</option>
                <option value="usdt">Tether (USDT)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wallet Address
              </label>
              <input
                type="text"
                value={formData.details.crypto_address}
                onChange={(e) => setFormData({
                  ...formData,
                  details: { ...formData.details, crypto_address: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your wallet address"
                required
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Add New Button */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <FaPlus className="w-4 h-4" />
              <span>Add Payment Method</span>
            </button>
          )}

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingMethod ? 'Edit Payment Method' : 'Add New Payment Method'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({
                      ...formData,
                      type: e.target.value as typeof formData.type
                    })}
                    disabled={!!editingMethod}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    required
                  >
                    <option value="bank_account">Bank Account</option>
                    <option value="paypal">PayPal</option>
                    <option value="crypto_wallet">Crypto Wallet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Method Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., My Main Bank Account"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {renderFormFields()}

                {error && (
                  <div className="text-red-600 text-sm">{error}</div>
                )}

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingMethod ? 'Update' : 'Add')} Payment Method
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Payment Methods List */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Your Payment Methods</h3>

            {paymentMethods.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No payment methods added yet. Add one to start receiving withdrawals.
              </div>
            ) : (
              <div className="grid gap-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`border rounded-lg p-4 ${method.is_default ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-gray-600">
                          {getPaymentMethodIcon(method.type)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{method.name}</h4>
                            {method.is_default && (
                              <FaStar className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {method.type.replace('_', ' ')}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(method.status)}`}>
                              {method.status.replace('_', ' ')}
                            </span>
                            {method.is_verified && (
                              <div className="flex items-center text-green-600">
                                <FaCheck className="w-3 h-3 mr-1" />
                                <span className="text-xs">Verified</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {!method.is_default && method.is_verified && method.status === 'active' && (
                          <button
                            onClick={() => handleSetDefault(method.id)}
                            disabled={loading}
                            className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(method)}
                          disabled={loading}
                          className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(method.id)}
                          disabled={loading || method.is_default}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Method Details */}
                    <div className="mt-2 text-sm text-gray-600">
                      {method.type === 'bank_account' && method.details.bank_name && (
                        <p>{method.details.bank_name} - ****{method.details.account_number?.slice(-4)}</p>
                      )}
                      {method.type === 'paypal' && method.details.paypal_email && (
                        <p>{method.details.paypal_email}</p>
                      )}
                      {method.type === 'crypto_wallet' && method.details.crypto_type && (
                        <p>{method.details.crypto_type.toUpperCase()} - {method.details.crypto_address?.slice(0, 10)}...{method.details.crypto_address?.slice(-10)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodManager;
