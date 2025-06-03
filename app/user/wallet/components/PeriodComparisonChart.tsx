'use client';

import React, { useState } from 'react';
import { PointsStats } from '@/app/user/types/points';
import {
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaEquals,
  FaChartBar,
  FaTrendingUp,
  FaTrendingDown
} from 'react-icons/fa';

interface PeriodComparisonChartProps {
  stats: PointsStats;
  userRole: 'candidate' | 'hr' | 'company';
}

interface PeriodData {
  label: string;
  earned: number;
  spent: number;
  net: number;
}

const PeriodComparisonChart: React.FC<PeriodComparisonChartProps> = ({
  stats,
  userRole
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  // Generate mock data for different periods
  const generatePeriodData = (): PeriodData[] => {
    switch (selectedPeriod) {
      case 'week':
        return [
          { label: 'This Week', earned: Math.round(stats.current_month.earned / 4), spent: Math.round(stats.current_month.spent / 4), net: Math.round(stats.current_month.net_change / 4) },
          { label: 'Last Week', earned: Math.round(stats.last_month.earned / 4), spent: Math.round(stats.last_month.spent / 4), net: Math.round(stats.last_month.net_change / 4) },
          { label: '2 Weeks Ago', earned: Math.round(stats.last_month.earned / 3), spent: Math.round(stats.last_month.spent / 3), net: Math.round(stats.last_month.net_change / 3) },
          { label: '3 Weeks Ago', earned: Math.round(stats.last_month.earned / 2), spent: Math.round(stats.last_month.spent / 2), net: Math.round(stats.last_month.net_change / 2) },
        ];
      case 'quarter':
        return [
          { label: 'Q1 2025', earned: stats.current_month.earned * 3, spent: stats.current_month.spent * 3, net: stats.current_month.net_change * 3 },
          { label: 'Q4 2024', earned: stats.last_month.earned * 3, spent: stats.last_month.spent * 3, net: stats.last_month.net_change * 3 },
          { label: 'Q3 2024', earned: Math.round(stats.last_month.earned * 2.5), spent: Math.round(stats.last_month.spent * 2.5), net: Math.round(stats.last_month.net_change * 2.5) },
        ];
      default: // month
        return [
          { label: 'May 2025', earned: stats.current_month.earned, spent: stats.current_month.spent, net: stats.current_month.net_change },
          { label: 'Apr 2025', earned: stats.last_month.earned, spent: stats.last_month.spent, net: stats.last_month.net_change },
          { label: 'Mar 2025', earned: Math.round(stats.last_month.earned * 0.8), spent: Math.round(stats.last_month.spent * 0.8), net: Math.round(stats.last_month.net_change * 0.8) },
          { label: 'Feb 2025', earned: Math.round(stats.last_month.earned * 1.2), spent: Math.round(stats.last_month.spent * 1.2), net: Math.round(stats.last_month.net_change * 1.2) },
        ];
    }
  };

  const periodData = generatePeriodData();
  const maxValue = Math.max(...periodData.map(p => Math.max(p.earned, p.spent)));

  // Calculate trend
  const calculateTrend = () => {
    if (periodData.length < 2) return 'stable';
    const latest = periodData[0].net;
    const previous = periodData[1].net;

    if (latest > previous * 1.1) return 'up';
    if (latest < previous * 0.9) return 'down';
    return 'stable';
  };

  const trend = calculateTrend();

  // Get role-specific insights
  const getRoleInsights = () => {
    const currentNet = periodData[0].net;
    const previousNet = periodData[1].net;
    const change = currentNet - previousNet;

    switch (userRole) {
      case 'candidate':
        return {
          title: 'Application Efficiency',
          insight: change > 0
            ? 'Your application strategy is improving! You\'re spending more efficiently.'
            : change < 0
              ? 'Consider optimizing your application targets to reduce point spending.'
              : 'Your spending pattern is stable. Consider diversifying your application strategy.',
          suggestion: 'Focus on quality applications over quantity for better ROI.'
        };
      case 'hr':
        return {
          title: 'Recruitment ROI',
          insight: change > 0
            ? 'Your recruitment efficiency is increasing! Good candidate targeting.'
            : change < 0
              ? 'Consider refining your candidate search criteria to optimize spending.'
              : 'Stable recruitment patterns. Look for opportunities to scale efficiently.',
          suggestion: 'Use analytics to identify the most successful candidate profiles.'
        };
      case 'company':
        return {
          title: 'Talent Acquisition Efficiency',
          insight: change > 0
            ? 'Your talent acquisition is becoming more cost-effective.'
            : change < 0
              ? 'Review your hiring strategy to optimize point allocation.'
              : 'Consistent talent acquisition patterns. Consider expanding your reach.',
          suggestion: 'Leverage bulk purchasing and enterprise features for better value.'
        };
      default:
        return {
          title: 'Performance Overview',
          insight: 'Track your points usage patterns over time.',
          suggestion: 'Monitor trends to optimize your strategy.'
        };
    }
  };

  const insights = getRoleInsights();

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-4 sm:px-6 py-5 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FaChartBar className="text-blue-500" />
            Period Comparison
          </h3>

          {/* Period Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['week', 'month', 'quarter'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 capitalize ${selectedPeriod === period
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Trend Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Trend</span>
            <div className="flex items-center gap-2">
              {trend === 'up' && <FaTrendingUp className="text-green-500 h-4 w-4" />}
              {trend === 'down' && <FaTrendingDown className="text-red-500 h-4 w-4" />}
              {trend === 'stable' && <FaEquals className="text-gray-500 h-4 w-4" />}
              <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' :
                  trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                {trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable'}
              </span>
            </div>
          </div>
        </div>

        {/* Comparison Chart */}
        <div className="space-y-4 mb-6">
          {periodData.map((period, index) => (
            <div key={period.label} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{period.label}</span>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-600">+{period.earned}</span>
                  <span className="text-red-600">-{period.spent}</span>
                  <span className={`font-medium ${period.net >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {period.net >= 0 ? '+' : ''}{period.net}
                  </span>
                </div>
              </div>

              {/* Visual Bar Chart */}
              <div className="flex items-center gap-1 h-6">
                {/* Earned Bar */}
                <div className="flex-1 bg-gray-200 rounded-l-lg overflow-hidden">
                  <div
                    className="h-full bg-green-400 rounded-l-lg transition-all duration-300"
                    style={{ width: `${maxValue > 0 ? (period.earned / maxValue) * 100 : 0}%` }}
                  ></div>
                </div>

                {/* Spent Bar */}
                <div className="flex-1 bg-gray-200 rounded-r-lg overflow-hidden">
                  <div
                    className="h-full bg-red-400 rounded-r-lg transition-all duration-300"
                    style={{ width: `${maxValue > 0 ? (period.spent / maxValue) * 100 : 0}%` }}
                  ></div>
                </div>

                {/* Net Change Indicator */}
                <div className="flex items-center ml-2">
                  {period.net > 0 && <FaArrowUp className="text-green-500 h-3 w-3" />}
                  {period.net < 0 && <FaArrowDown className="text-red-500 h-3 w-3" />}
                  {period.net === 0 && <FaEquals className="text-gray-500 h-3 w-3" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <span className="text-gray-600">Earned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-400 rounded"></div>
            <span className="text-gray-600">Spent</span>
          </div>
        </div>

        {/* Role-specific Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
            <FaCalendarAlt className="text-blue-500 h-4 w-4" />
            {insights.title}
          </h4>
          <p className="text-sm text-gray-700 mb-2">{insights.insight}</p>
          <p className="text-xs text-blue-600 font-medium">{insights.suggestion}</p>
        </div>
      </div>
    </div>
  );
};

export default PeriodComparisonChart;
