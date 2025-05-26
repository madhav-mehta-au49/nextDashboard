'use client';

import React from 'react';
import { PointsStats } from '@/app/user/types/points';
import { FaCoins, FaChartBar, FaExchangeAlt, FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface PointsUsageChartProps {
  stats: PointsStats;
  userRole: 'candidate' | 'hr' | 'company';
}

const PointsUsageChart: React.FC<PointsUsageChartProps> = ({ stats, userRole }) => {
  // Helper function to format category names
  const formatCategoryName = (name: string) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper function to get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'resume_access':
        return <FaCoins className="text-blue-500" />;
      case 'job_applications':
        return <FaExchangeAlt className="text-green-500" />;
      case 'company_access':
        return <FaCoins className="text-purple-500" />;
      case 'premium_features':
        return <FaChartBar className="text-yellow-500" />;
      default:
        return <FaCoins className="text-gray-500" />;
    }
  };

  // Helper function to get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'resume_access':
        return 'bg-blue-100 text-blue-800';
      case 'job_applications':
        return 'bg-green-100 text-green-800';
      case 'company_access':
        return 'bg-purple-100 text-purple-800';
      case 'premium_features':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function for chart bar
  const getBarWidth = (percentage: number) => {
    return `${Math.max(percentage, 5)}%`; // Minimum 5% width for visibility
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Points Usage Analytics</h3>
      </div>
      
      <div className="p-6">
        {/* Current/Previous Month Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-700">Current Month</h4>
              <span className="text-xs font-medium text-gray-500">Points</span>
            </div>
            <div className="flex items-end space-x-4">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-gray-900">{stats.current_month.net_change}</span>
                <div className="flex items-center mt-1">
                  {stats.current_month.net_change >= 0 ? (
                    <>
                      <FaArrowUp className="text-green-500 mr-1 h-3 w-3" />
                      <span className="text-xs text-green-600">Net Gain</span>
                    </>
                  ) : (
                    <>
                      <FaArrowDown className="text-red-500 mr-1 h-3 w-3" />
                      <span className="text-xs text-red-600">Net Loss</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex-1 flex items-center space-x-2">
                <div className="flex flex-col items-center">
                  <span className="text-xs font-medium text-green-600">+{stats.current_month.earned}</span>
                  <div className="h-16 w-8 bg-gray-200 rounded-t-lg relative overflow-hidden">
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-green-400 rounded-t-lg"
                      style={{ height: `${(stats.current_month.earned / Math.max(stats.current_month.earned + stats.current_month.spent, 1)) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs mt-1">Earned</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs font-medium text-red-600">-{stats.current_month.spent}</span>
                  <div className="h-16 w-8 bg-gray-200 rounded-t-lg relative overflow-hidden">
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-red-400 rounded-t-lg"
                      style={{ height: `${(stats.current_month.spent / Math.max(stats.current_month.earned + stats.current_month.spent, 1)) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs mt-1">Spent</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-700">Previous Month</h4>
              <span className="text-xs font-medium text-gray-500">Points</span>
            </div>
            <div className="flex items-end space-x-4">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-gray-900">{stats.last_month.net_change}</span>
                <div className="flex items-center mt-1">
                  {stats.last_month.net_change >= 0 ? (
                    <>
                      <FaArrowUp className="text-green-500 mr-1 h-3 w-3" />
                      <span className="text-xs text-green-600">Net Gain</span>
                    </>
                  ) : (
                    <>
                      <FaArrowDown className="text-red-500 mr-1 h-3 w-3" />
                      <span className="text-xs text-red-600">Net Loss</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex-1 flex items-center space-x-2">
                <div className="flex flex-col items-center">
                  <span className="text-xs font-medium text-green-600">+{stats.last_month.earned}</span>
                  <div className="h-16 w-8 bg-gray-200 rounded-t-lg relative overflow-hidden">
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-green-400 rounded-t-lg"
                      style={{ height: `${(stats.last_month.earned / Math.max(stats.last_month.earned + stats.last_month.spent, 1)) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs mt-1">Earned</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs font-medium text-red-600">-{stats.last_month.spent}</span>
                  <div className="h-16 w-8 bg-gray-200 rounded-t-lg relative overflow-hidden">
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-red-400 rounded-t-lg"
                      style={{ height: `${(stats.last_month.spent / Math.max(stats.last_month.earned + stats.last_month.spent, 1)) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs mt-1">Spent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Category Breakdown Chart */}
        <div className="mt-8">
          <h4 className="font-medium text-gray-700 mb-4">Points Spending by Category</h4>
          
          <div className="space-y-4">
            {stats.top_categories.map((category, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center">
                      {getCategoryIcon(category.category)}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {formatCategoryName(category.category)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(category.category)}`}>
                      {category.percentage.toFixed(1)}%
                    </span>
                    <span className="text-sm font-medium text-gray-900">{category.amount} pts</span>
                  </div>
                </div>
                
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      category.category === 'resume_access' ? 'bg-blue-500' :
                      category.category === 'job_applications' ? 'bg-green-500' :
                      category.category === 'company_access' ? 'bg-purple-500' :
                      category.category === 'premium_features' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}
                    style={{ width: getBarWidth(category.percentage) }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Role-specific metrics */}
        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-4">
            {userRole === 'candidate' ? 'Candidate' : 
             userRole === 'hr' ? 'HR Professional' : 'Enterprise'} Metrics
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            {userRole === 'candidate' && (
              <>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-600">Applications</div>
                  <div className="text-lg font-bold">{stats.spending_breakdown.job_applications}</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-600">Premium Features</div>
                  <div className="text-lg font-bold">{stats.spending_breakdown.premium_features}</div>
                </div>
              </>
            )}
            
            {userRole === 'hr' && (
              <>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-600">Candidates Viewed</div>
                  <div className="text-lg font-bold">{stats.spending_breakdown.resume_access}</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-600">Analytics Usage</div>
                  <div className="text-lg font-bold">{stats.spending_breakdown.premium_features}</div>
                </div>
              </>
            )}
            
            {userRole === 'company' && (
              <>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-600">Bulk Resumes</div>
                  <div className="text-lg font-bold">{stats.spending_breakdown.resume_access}</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-600">Market Insights</div>
                  <div className="text-lg font-bold">{stats.spending_breakdown.other}</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsUsageChart;
