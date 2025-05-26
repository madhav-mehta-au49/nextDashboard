'use client';

import React from 'react';
import { PointsTransaction } from '@/app/user/types/points';
import { 
  FaArrowUp, 
  FaArrowDown, 
  FaRegCalendarAlt, 
  FaChartLine, 
  FaRegClock,
  FaTag
} from 'react-icons/fa';

interface SpendingPatternChartProps {
  transactions: PointsTransaction[];
  period?: 'week' | 'month' | 'year';
}

const SpendingPatternChart: React.FC<SpendingPatternChartProps> = ({ 
  transactions,
  period = 'month'
}) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: period === 'year' ? 'numeric' : undefined
    }).format(date);
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Get category emoji
  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'resume_access': return '📄';
      case 'job_application': return '📝';
      case 'profile_boost': return '🚀';
      case 'company_access': return '🏢';
      case 'purchase': return '💰';
      case 'bonus': return '🎁';
      case 'refund': return '💸';
      default: return '🔄';
    }
  };

  // Get badge color based on transaction type
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'earned': return 'bg-green-100 text-green-800';
      case 'spent': return 'bg-red-100 text-red-800';
      case 'purchased': return 'bg-blue-100 text-blue-800';
      case 'refunded': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate spending trends
  const calculateTrends = () => {
    // Group transactions by day/week/month
    const spent = transactions.filter(t => t.type === 'spent');
    const earned = transactions.filter(t => t.type === 'earned' || t.type === 'purchased');
    
    // Get total points spent/earned
    const totalSpent = spent.reduce((sum, t) => sum + t.points, 0);
    const totalEarned = earned.reduce((sum, t) => sum + t.points, 0);
    
    // Get most expensive transaction
    const mostExpensive = [...spent].sort((a, b) => b.points - a.points)[0];
    
    // Calculate average spend
    const averageSpend = spent.length > 0 ? totalSpent / spent.length : 0;
    
    return {
      totalSpent,
      totalEarned,
      netChange: totalEarned - totalSpent,
      mostExpensive,
      averageSpend
    };
  };

  const trends = calculateTrends();

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Spending Patterns</h3>
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <FaRegCalendarAlt className="h-4 w-4" />
            <span>This {period}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">Net Change</p>
                <p className={`text-xl font-bold ${trends.netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trends.netChange >= 0 ? '+' : ''}{trends.netChange} pts
                </p>
              </div>
              <div className={`p-2 rounded-full ${trends.netChange >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                {trends.netChange >= 0 ? 
                  <FaArrowUp className="h-5 w-5 text-green-600" /> : 
                  <FaArrowDown className="h-5 w-5 text-red-600" />
                }
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">Points Earned</p>
                <p className="text-xl font-bold text-green-600">+{trends.totalEarned} pts</p>
              </div>
              <div className="p-2 rounded-full bg-green-100">
                <FaArrowUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">Points Spent</p>
                <p className="text-xl font-bold text-red-600">-{trends.totalSpent} pts</p>
              </div>
              <div className="p-2 rounded-full bg-red-100">
                <FaArrowDown className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Spending Insights */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">Spending Insights</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-full bg-blue-100">
                <FaChartLine className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Transaction</p>
                <p className="text-lg font-semibold text-gray-900">
                  {Math.round(trends.averageSpend)} points
                </p>
              </div>
            </div>
            
            {trends.mostExpensive && (
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-yellow-100">
                  <FaTag className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Largest Expense</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {trends.mostExpensive.points} points
                  </p>
                  <p className="text-xs text-gray-500">{trends.mostExpensive.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Transactions Timeline */}
        <div>
          <h4 className="font-medium text-gray-700 mb-4">Recent Activity</h4>
          
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction, index) => (
              <div key={transaction.id || index} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full ${
                  transaction.type === 'earned' || transaction.type === 'purchased' 
                    ? 'bg-green-100' 
                    : transaction.type === 'refunded'
                    ? 'bg-yellow-100'
                    : 'bg-red-100'
                }`}>
                  <span className="text-lg">{getCategoryEmoji(transaction.category)}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {transaction.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeColor(transaction.type)}`}>
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <FaRegClock className="h-3 w-3 mr-1" />
                          {formatDate(transaction.created_at)} {formatTime(transaction.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className={`font-semibold ${
                      transaction.type === 'earned' || transaction.type === 'purchased' 
                        ? 'text-green-600' 
                        : transaction.type === 'refunded'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'earned' || transaction.type === 'purchased' || transaction.type === 'refunded'
                        ? `+${transaction.points}`
                        : `-${transaction.points}`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {transactions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No transactions found for this period
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingPatternChart;
