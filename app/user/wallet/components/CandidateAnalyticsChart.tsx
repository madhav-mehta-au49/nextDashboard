'use client';

import React from 'react';
import { PointsStats, PointsTransaction } from '@/app/user/types/points';
import { 
  FaUserTie, 
  FaFileAlt, 
  FaEye, 
  FaRocket, 
  FaTrophy,
  FaChartLine,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaBullseye
} from 'react-icons/fa';

interface CandidateAnalyticsChartProps {
  stats: PointsStats;
  transactions: PointsTransaction[];
}

interface CandidateMetrics {
  resumesViewed: number;
  applicationsSubmitted: number;
  profileBoosts: number;
  premiumFeatures: number;
  successRate: number;
  avgPointsPerApplication: number;
  monthlyTrend: 'up' | 'down' | 'stable';
  topSpendingCategory: string;
}

const CandidateAnalyticsChart: React.FC<CandidateAnalyticsChartProps> = ({ 
  stats, 
  transactions 
}) => {
  // Calculate candidate-specific metrics
  const calculateMetrics = (): CandidateMetrics => {
    const spentTransactions = transactions.filter(t => t.type === 'spent');
    
    // Categorize spending
    const resumeViews = spentTransactions.filter(t => 
      t.description.toLowerCase().includes('resume') || 
      t.description.toLowerCase().includes('profile')
    ).length;
    
    const applications = spentTransactions.filter(t => 
      t.description.toLowerCase().includes('application') ||
      t.description.toLowerCase().includes('apply')
    ).length;
    
    const boosts = spentTransactions.filter(t => 
      t.description.toLowerCase().includes('boost') ||
      t.description.toLowerCase().includes('priority')
    ).length;
    
    const premium = spentTransactions.filter(t => 
      t.description.toLowerCase().includes('premium') ||
      t.description.toLowerCase().includes('analytics')
    ).length;
    
    // Calculate success metrics
    const totalSpent = stats.current_month.spent;
    const avgPointsPerApp = applications > 0 ? totalSpent / applications : 0;
    
    // Determine trend
    const currentSpent = stats.current_month.spent;
    const lastSpent = stats.last_month.spent;
    let monthlyTrend: 'up' | 'down' | 'stable' = 'stable';
    
    if (currentSpent > lastSpent * 1.1) monthlyTrend = 'up';
    else if (currentSpent < lastSpent * 0.9) monthlyTrend = 'down';
    
    // Find top spending category
    const categories = stats.top_categories;
    const topCategory = categories.length > 0 ? categories[0].category : 'job_applications';
    
    return {
      resumesViewed: resumeViews,
      applicationsSubmitted: applications,
      profileBoosts: boosts,
      premiumFeatures: premium,
      successRate: Math.min(85 + Math.random() * 10, 95), // Mock success rate
      avgPointsPerApplication: Math.round(avgPointsPerApp),
      monthlyTrend,
      topSpendingCategory: topCategory
    };
  };

  const metrics = calculateMetrics();

  // Get recommendation based on spending patterns
  const getRecommendations = () => {
    const recommendations = [];
    
    if (metrics.avgPointsPerApplication > 15) {
      recommendations.push({
        type: 'cost-optimization',
        title: 'Optimize Application Strategy',
        description: 'Consider targeting fewer, higher-quality positions to reduce cost per application.',
        icon: FaBullseye,
        color: 'text-yellow-600'
      });
    }
    
    if (metrics.profileBoosts === 0 && stats.current_month.spent > 20) {
      recommendations.push({
        type: 'visibility',
        title: 'Boost Your Profile',
        description: 'Profile boosts can increase your visibility by 3x. Consider investing in visibility.',
        icon: FaRocket,
        color: 'text-blue-600'
      });
    }
    
    if (metrics.premiumFeatures === 0) {
      recommendations.push({
        type: 'insights',
        title: 'Unlock Analytics',
        description: 'Premium analytics can help you understand which applications are most effective.',
        icon: FaChartLine,
        color: 'text-purple-600'
      });
    }
    
    return recommendations.slice(0, 2); // Show max 2 recommendations
  };

  const recommendations = getRecommendations();

  return (
    <div className="space-y-6">
      {/* Candidate Performance Overview */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FaUserTie className="text-blue-500" />
            Candidate Performance Analytics
          </h3>
        </div>
        
        <div className="p-6">
          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Applications</p>
                  <p className="text-2xl font-bold text-blue-600">{metrics.applicationsSubmitted}</p>
                  <p className="text-xs text-gray-500">This month</p>
                </div>
                <FaFileAlt className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Profile Views</p>
                  <p className="text-2xl font-bold text-green-600">{metrics.resumesViewed}</p>
                  <p className="text-xs text-gray-500">Purchased</p>
                </div>
                <FaEye className="h-8 w-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Profile Boosts</p>
                  <p className="text-2xl font-bold text-purple-600">{metrics.profileBoosts}</p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
                <FaRocket className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-yellow-600">{metrics.successRate.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">Estimated</p>
                </div>
                <FaTrophy className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </div>
          
          {/* Spending Efficiency */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-4">Spending Efficiency</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg. Points per Application</span>
                  <span className="font-semibold text-gray-900">{metrics.avgPointsPerApplication} pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Monthly Trend</span>
                  <div className="flex items-center">
                    {metrics.monthlyTrend === 'up' && (
                      <FaArrowUp className="text-red-500 mr-1 h-3 w-3" />
                    )}
                    {metrics.monthlyTrend === 'down' && (
                      <FaArrowDown className="text-green-500 mr-1 h-3 w-3" />
                    )}
                    <span className={`text-sm font-medium ${
                      metrics.monthlyTrend === 'up' ? 'text-red-600' :
                      metrics.monthlyTrend === 'down' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {metrics.monthlyTrend === 'up' ? 'Increasing' :
                       metrics.monthlyTrend === 'down' ? 'Decreasing' : 'Stable'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Top Category</span>
                  <span className="font-semibold text-gray-900 capitalize">
                    {metrics.topSpendingCategory.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-4">Monthly Comparison</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Current Month</span>
                    <span className="text-sm font-medium">{stats.current_month.spent} pts</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ 
                        width: `${Math.min((stats.current_month.spent / Math.max(stats.current_month.spent, stats.last_month.spent)) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Previous Month</span>
                    <span className="text-sm font-medium">{stats.last_month.spent} pts</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-gray-400 rounded-full"
                      style={{ 
                        width: `${Math.min((stats.last_month.spent / Math.max(stats.current_month.spent, stats.last_month.spent)) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Smart Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Smart Recommendations</h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full bg-white shadow-sm`}>
                    <rec.icon className={`h-5 w-5 ${rec.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Application Timeline Visualization */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FaCalendarAlt className="text-gray-500" />
            Application Timeline
          </h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {transactions
              .filter(t => t.type === 'spent')
              .slice(0, 5)
              .map((transaction, index) => {
                const isJobApp = transaction.description.toLowerCase().includes('application') || 
                                transaction.description.toLowerCase().includes('apply');
                const isBoost = transaction.description.toLowerCase().includes('boost');
                const isPremium = transaction.description.toLowerCase().includes('premium');
                
                return (
                  <div key={transaction.id || index} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        isJobApp ? 'bg-blue-100' :
                        isBoost ? 'bg-purple-100' :
                        isPremium ? 'bg-yellow-100' : 'bg-gray-100'
                      }`}>
                        {isJobApp ? <FaFileAlt className="h-5 w-5 text-blue-600" /> :
                         isBoost ? <FaRocket className="h-5 w-5 text-purple-600" /> :
                         isPremium ? <FaChartLine className="h-5 w-5 text-yellow-600" /> :
                         <FaEye className="h-5 w-5 text-gray-600" />}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-red-600">
                            -{transaction.points} pts
                          </p>
                          {isJobApp && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Application
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateAnalyticsChart;
