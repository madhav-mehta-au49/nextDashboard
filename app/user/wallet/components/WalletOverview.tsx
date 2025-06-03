'use client';

import React from 'react';
import { Wallet, WalletStats } from '@/app/user/types/wallet';
import {
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaDollarSign,
  FaSyncAlt
} from 'react-icons/fa';

interface WalletOverviewProps {
  wallet: Wallet | null;
  stats: WalletStats | null;
  onRefresh: () => void;
}

const WalletOverview: React.FC<WalletOverviewProps> = ({ wallet, stats, onRefresh }) => {
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      case 'frozen': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Wallet Overview</h2>
        <button
          onClick={onRefresh}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <FaSyncAlt className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Current Balance */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Balance</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(wallet?.balance || 0, wallet?.currency)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaWallet className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(wallet?.status || 'active')}`}>
              {wallet?.status || 'Active'}
            </span>
          </div>
        </div>

        {/* Total Earned */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earned</p>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(wallet?.total_earned || 0, wallet?.currency)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaArrowUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              This month: {formatCurrency(stats?.this_month_earnings || 0, wallet?.currency)}
            </p>
          </div>
        </div>

        {/* Total Withdrawn */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Withdrawn</p>
              <p className="text-3xl font-bold text-red-600">
                {formatCurrency(wallet?.total_withdrawn || 0, wallet?.currency)}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <FaArrowDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Last month: {formatCurrency(stats?.last_month_earnings || 0, wallet?.currency)}
            </p>
          </div>
        </div>

        {/* Pending Withdrawals */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Withdrawals</p>
              <p className="text-3xl font-bold text-yellow-600">
                {formatCurrency(wallet?.pending_withdrawals || 0, wallet?.currency)}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaClock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Processing requests</p>
          </div>
        </div>
      </div>

      {/* Earning Sources */}
      {stats?.top_earning_source && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Earning Source</h3>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <FaDollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{stats.top_earning_source.name}</h4>
              <p className="text-sm text-gray-600">{stats.top_earning_source.description}</p>
              {stats.top_earning_source.rate && (
                <p className="text-sm font-medium text-green-600">
                  Rate: {formatCurrency(stats.top_earning_source.rate, stats.top_earning_source.currency)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions Preview */}
      {stats?.recent_transactions && stats.recent_transactions.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {stats.recent_transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{transaction.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletOverview;
