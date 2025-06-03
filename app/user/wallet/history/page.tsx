'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FaArrowLeft,
  FaCoins,
  FaCalendar,
  FaFileAlt,
  FaArrowUp,
  FaArrowDown,
  FaSearch,
  FaFilter,
  FaDownload
} from 'react-icons/fa';
import { useUser } from '../../contexts/UserContext';
import { mockTransactionsData } from '@/services/wallet/pointsMockData';
import { PointsTransaction } from '../../types/points';

// Simple UI components using Tailwind CSS
const Card = ({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`} onClick={onClick}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

const Button = ({
  children,
  variant = "default",
  className = "",
  onClick,
  disabled = false
}: {
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center";
  const variants = {
    default: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
    outline: "border border-gray-300 hover:bg-gray-50 text-gray-700",
    ghost: "hover:bg-gray-100 text-gray-600"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Badge = ({
  children,
  variant = "default",
  className = ""
}: {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "success" | "warning" | "destructive";
  className?: string;
}) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    destructive: "bg-red-100 text-red-800"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const TransactionHistoryPage = () => {
  const router = useRouter();
  const { userRole } = useUser();
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<PointsTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Get transactions for the current user role
      const userTransactions = mockTransactionsData.filter(
        transaction => transaction.metadata?.user_role === userRole
      );
      setTransactions(userTransactions);
      setFilteredTransactions(userTransactions);
      setLoading(false);
    }, 1000);
  }, [userRole]);

  useEffect(() => {
    let result = transactions;

    // Filter by type
    if (filter !== 'all') {
      result = result.filter(t => t.type === filter);
    }

    // Filter by search term
    if (searchTerm) {
      result = result.filter(t =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
    if (dateRange.start) {
      result = result.filter(t => new Date(t.created_at) >= new Date(dateRange.start));
    }

    if (dateRange.end) {
      result = result.filter(t => new Date(t.created_at) <= new Date(dateRange.end));
    }

    setFilteredTransactions(result);
  }, [filter, searchTerm, dateRange, transactions]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned':
        return <FaArrowUp className="h-4 w-4 text-green-600" />;
      case 'spent':
        return <FaArrowDown className="h-4 w-4 text-red-600" />;
      case 'purchased':
        return <FaCoins className="h-4 w-4 text-blue-600" />;
      case 'refunded':
        return <FaArrowUp className="h-4 w-4 text-purple-600" />;
      default:
        return <FaCoins className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned':
        return 'text-green-600';
      case 'spent':
        return 'text-red-600';
      case 'purchased':
        return 'text-blue-600';
      case 'refunded':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTransactionAmount = (transaction: PointsTransaction) => {
    switch (transaction.type) {
      case 'earned':
      case 'purchased':
      case 'refunded':
        return `+${transaction.points}`;
      case 'spent':
        return `-${transaction.points}`;
      default:
        return transaction.points.toString();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryBadge = (category: string) => {
    const categoryStyles: Record<string, string> = {
      resume_access: 'bg-blue-100 text-blue-800',
      job_application: 'bg-green-100 text-green-800',
      profile_boost: 'bg-purple-100 text-purple-800',
      company_access: 'bg-yellow-100 text-yellow-800',
      purchase: 'bg-indigo-100 text-indigo-800',
      bonus: 'bg-teal-100 text-teal-800',
      refund: 'bg-gray-100 text-gray-800'
    };

    const categoryLabel: Record<string, string> = {
      resume_access: 'Resume Access',
      job_application: 'Job Application',
      profile_boost: 'Profile Boost',
      company_access: 'Company Access',
      purchase: 'Purchase',
      bonus: 'Bonus',
      refund: 'Refund'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryStyles[category] || 'bg-gray-100 text-gray-800'}`}>
        {categoryLabel[category] || category}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            <span>Back</span>
          </button>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaFileAlt className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
                <p className="text-gray-600">View your points transactions and activity</p>
              </div>
            </div>

            <Button variant="outline" className="hidden sm:flex items-center">
              <FaDownload className="mr-2 h-4 w-4" />
              Export History
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search transactions..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                />
              </div>
              <span className="text-gray-500">to</span>
              <input
                type="date"
                className="pl-4 pr-4 py-2 flex-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Transactions</option>
                <option value="earned">Points Earned</option>
                <option value="spent">Points Spent</option>
                <option value="purchased">Points Purchased</option>
                <option value="refunded">Points Refunded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Transactions</CardTitle>
              <span className="text-sm text-gray-500">
                {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transaction' : 'transactions'} found
              </span>
            </div>
          </CardHeader>

          {loading ? (
            <CardContent className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading transactions...</p>
            </CardContent>
          ) : filteredTransactions.length === 0 ? (
            <CardContent className="text-center py-12">
              <FaFileAlt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No transactions found</h3>
              <p className="text-gray-600">
                {searchTerm || filter !== 'all' || dateRange.start || dateRange.end
                  ? 'Try adjusting your filters to see more results'
                  : 'You haven\'t made any transactions yet'}
              </p>
              {(searchTerm || filter !== 'all' || dateRange.start || dateRange.end) && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('');
                    setFilter('all');
                    setDateRange({ start: '', end: '' });
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.description}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {transaction.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(transaction.created_at)}</div>
                        <div className="text-sm text-gray-500">{formatTime(transaction.created_at)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getCategoryBadge(transaction.category)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                            transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                          }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <span className={getTransactionColor(transaction.type)}>
                          {getTransactionAmount(transaction)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Summary Card */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Points Earned</p>
                  <p className="text-2xl font-bold text-green-600">
                    +{transactions
                      .filter(t => t.type === 'earned' || t.type === 'purchased' || t.type === 'refunded')
                      .reduce((sum, t) => sum + t.points, 0)}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <FaArrowUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Points Spent</p>
                  <p className="text-2xl font-bold text-red-600">
                    -{transactions
                      .filter(t => t.type === 'spent')
                      .reduce((sum, t) => sum + t.points, 0)}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <FaArrowDown className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Net Balance Change</p>
                  <p className={`text-2xl font-bold ${transactions.reduce((sum, t) =>
                    sum + (t.type === 'spent' ? -t.points : t.points), 0) >= 0
                      ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {transactions.reduce((sum, t) =>
                      sum + (t.type === 'spent' ? -t.points : t.points), 0) >= 0 ? '+' : ''}
                    {transactions.reduce((sum, t) =>
                      sum + (t.type === 'spent' ? -t.points : t.points), 0)}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaCoins className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryPage;