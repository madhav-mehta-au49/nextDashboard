'use client';

import React, { useState } from 'react';
import { PointsStats, PointsTransaction } from '@/app/user/types/points';
import { 
  FaChartBar, 
  FaFire, 
  FaLightbulb, 
  FaMobileAlt,
  FaDesktop,
  FaTabletAlt,
  FaCalendarWeek,
  FaBolt,
  FaTarget,
  FaUsers,
  FaClock,
  FaTrendingUp
} from 'react-icons/fa';

interface MobileDashboardMetricsProps {
  stats: PointsStats;
  transactions: PointsTransaction[];
  userRole: 'candidate' | 'hr' | 'company';
}

const MobileDashboardMetrics: React.FC<MobileDashboardMetricsProps> = ({ 
  stats, 
  transactions, 
  userRole 
}) => {
  const [activeMetric, setActiveMetric] = useState<'overview' | 'activity' | 'insights'>('overview');

  // Calculate mobile-specific metrics
  const calculateMobileMetrics = () => {
    const recentTransactions = transactions.slice(0, 7); // Last week
    const todayTransactions = transactions.filter(t => {
      const today = new Date();
      const transactionDate = new Date(t.created_at);
      return transactionDate.toDateString() === today.toDateString();
    });

    const weeklySpent = recentTransactions
      .filter(t => t.type === 'spent')
      .reduce((sum, t) => sum + t.points, 0);

    const efficiency = stats.current_month.spent > 0 
      ? Math.round((stats.current_month.earned / stats.current_month.spent) * 100)
      : 100;

    const dailyAverage = Math.round(stats.current_month.spent / 30);

    return {
      todayActivity: todayTransactions.length,
      weeklySpent,
      efficiency,
      dailyAverage,
      streak: Math.floor(Math.random() * 7) + 1, // Mock streak
      momentum: efficiency > 80 ? 'high' : efficiency > 60 ? 'medium' : 'low'
    };
  };

  const mobileMetrics = calculateMobileMetrics();

  // Get quick actions based on user role
  const getQuickActions = () => {
    switch (userRole) {
      case 'candidate':
        return [
          { icon: FaTarget, label: 'Apply to Jobs', color: 'text-blue-600', bgColor: 'bg-blue-50' },
          { icon: FaUsers, label: 'View Profiles', color: 'text-green-600', bgColor: 'bg-green-50' },
          { icon: FaBolt, label: 'Boost Profile', color: 'text-purple-600', bgColor: 'bg-purple-50' },
          { icon: FaChartBar, label: 'View Analytics', color: 'text-orange-600', bgColor: 'bg-orange-50' }
        ];
      case 'hr':
        return [
          { icon: FaUsers, label: 'Search Candidates', color: 'text-blue-600', bgColor: 'bg-blue-50' },
          { icon: FaTarget, label: 'Post Jobs', color: 'text-green-600', bgColor: 'bg-green-50' },
          { icon: FaChartBar, label: 'HR Analytics', color: 'text-purple-600', bgColor: 'bg-purple-50' },
          { icon: FaBolt, label: 'Premium Tools', color: 'text-orange-600', bgColor: 'bg-orange-50' }
        ];
      default:
        return [
          { icon: FaUsers, label: 'Bulk Access', color: 'text-blue-600', bgColor: 'bg-blue-50' },
          { icon: FaChartBar, label: 'Market Insights', color: 'text-green-600', bgColor: 'bg-green-50' },
          { icon: FaBolt, label: 'Enterprise Tools', color: 'text-purple-600', bgColor: 'bg-purple-50' },
          { icon: FaTarget, label: 'Team Management', color: 'text-orange-600', bgColor: 'bg-orange-50' }
        ];
    }
  };

  const quickActions = getQuickActions();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Mobile-First Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Quick Dashboard</h3>
            <p className="text-sm opacity-90">Mobile Optimized</p>
          </div>
          <FaMobileAlt className="h-6 w-6 opacity-75" />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-50 border-b">
        {[
          { key: 'overview', label: 'Overview', icon: FaChartBar },
          { key: 'activity', label: 'Activity', icon: FaClock },
          { key: 'insights', label: 'Insights', icon: FaLightbulb }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveMetric(tab.key as any)}
            className={`flex-1 px-3 py-3 text-sm font-medium transition-colors ${
              activeMetric === tab.key
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-1">
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {activeMetric === 'overview' && (
          <div className="space-y-4">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Current Points</p>
                    <p className="text-lg font-bold text-blue-900">{stats.current_month.earned - stats.current_month.spent}</p>
                  </div>
                  <div className="p-1.5 bg-blue-100 rounded-full">
                    <FaFire className="h-3 w-3 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-green-600 font-medium">Efficiency</p>
                    <p className="text-lg font-bold text-green-900">{mobileMetrics.efficiency}%</p>
                  </div>
                  <div className="p-1.5 bg-green-100 rounded-full">
                    <FaTrendingUp className="h-3 w-3 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-purple-600 font-medium">Daily Avg</p>
                    <p className="text-lg font-bold text-purple-900">{mobileMetrics.dailyAverage}</p>
                  </div>
                  <div className="p-1.5 bg-purple-100 rounded-full">
                    <FaCalendarWeek className="h-3 w-3 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-orange-600 font-medium">Streak</p>
                    <p className="text-lg font-bold text-orange-900">{mobileMetrics.streak} days</p>
                  </div>
                  <div className="p-1.5 bg-orange-100 rounded-full">
                    <FaBolt className="h-3 w-3 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className={`${action.bgColor} rounded-lg p-3 text-left transition-all hover:scale-105 active:scale-95`}
                  >
                    <div className="flex items-center gap-2">
                      <action.icon className={`h-4 w-4 ${action.color}`} />
                      <span className="text-sm font-medium text-gray-700">{action.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeMetric === 'activity' && (
          <div className="space-y-4">
            {/* Today's Activity */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">Today's Activity</h4>
                <span className="text-xs text-gray-500">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((mobileMetrics.todayActivity / 5) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {mobileMetrics.todayActivity}/5 actions
                </span>
              </div>
            </div>

            {/* Recent Transactions (Mobile-optimized) */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h4>
              <div className="space-y-2">
                {transactions.slice(0, 3).map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className={`w-2 h-2 rounded-full ${
                        transaction.type === 'spent' ? 'bg-red-400' : 'bg-green-400'
                      }`}></div>
                      <span className="text-sm text-gray-700 truncate">
                        {transaction.description.length > 25 
                          ? transaction.description.substring(0, 25) + '...'
                          : transaction.description
                        }
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${
                      transaction.type === 'spent' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.type === 'spent' ? '-' : '+'}{transaction.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">This Week</h4>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold text-blue-600">{mobileMetrics.weeklySpent}</p>
                  <p className="text-xs text-gray-600">Points Spent</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-purple-600">{Math.round(mobileMetrics.weeklySpent / 7)}</p>
                  <p className="text-xs text-gray-600">Daily Average</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMetric === 'insights' && (
          <div className="space-y-4">
            {/* Momentum Indicator */}
            <div className={`rounded-lg p-3 ${
              mobileMetrics.momentum === 'high' ? 'bg-green-50' :
              mobileMetrics.momentum === 'medium' ? 'bg-yellow-50' : 'bg-red-50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <FaBolt className={`h-4 w-4 ${
                  mobileMetrics.momentum === 'high' ? 'text-green-600' :
                  mobileMetrics.momentum === 'medium' ? 'text-yellow-600' : 'text-red-600'
                }`} />
                <h4 className="text-sm font-medium text-gray-700">Current Momentum</h4>
              </div>
              <p className={`text-sm font-medium capitalize ${
                mobileMetrics.momentum === 'high' ? 'text-green-700' :
                mobileMetrics.momentum === 'medium' ? 'text-yellow-700' : 'text-red-700'
              }`}>
                {mobileMetrics.momentum} Activity Level
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {mobileMetrics.momentum === 'high' 
                  ? 'Great job! You\'re using points efficiently.'
                  : mobileMetrics.momentum === 'medium'
                  ? 'Good pace. Consider optimizing your strategy.'
                  : 'Low activity. Time to boost your engagement!'
                }
              </p>
            </div>

            {/* Smart Tips */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Smart Tips</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                  <FaLightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Optimize Timing</p>
                    <p className="text-xs text-blue-700">
                      {userRole === 'candidate' 
                        ? 'Apply to jobs during peak hours (9-11 AM) for better visibility.'
                        : 'Post jobs early in the week for maximum candidate engagement.'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
                  <FaTarget className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Focus Strategy</p>
                    <p className="text-xs text-green-700">
                      Target quality over quantity. Selective applications yield better results.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 bg-purple-50 rounded-lg">
                  <FaFire className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">Boost Performance</p>
                    <p className="text-xs text-purple-700">
                      Use profile boosts strategically during high-traffic periods.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Device Optimization Tip */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <FaDesktop className="h-4 w-4 text-gray-600" />
                <h4 className="text-sm font-medium text-gray-700">Multi-Device Usage</h4>
              </div>
              <div className="flex items-center justify-around text-center">
                <div className="flex flex-col items-center">
                  <FaMobileAlt className="h-4 w-4 text-blue-600 mb-1" />
                  <span className="text-xs text-gray-600">Mobile</span>
                  <span className="text-xs font-medium">65%</span>
                </div>
                <div className="flex flex-col items-center">
                  <FaTabletAlt className="h-4 w-4 text-green-600 mb-1" />
                  <span className="text-xs text-gray-600">Tablet</span>
                  <span className="text-xs font-medium">20%</span>
                </div>
                <div className="flex flex-col items-center">
                  <FaDesktop className="h-4 w-4 text-purple-600 mb-1" />
                  <span className="text-xs text-gray-600">Desktop</span>
                  <span className="text-xs font-medium">15%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileDashboardMetrics;
