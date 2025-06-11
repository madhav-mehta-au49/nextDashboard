'use client';

import React, { useState } from 'react';
import { PointsStats, PointsTransaction } from '@/app/user/types/points';
import {
  FaChartLine,
  FaDollarSign,
  FaPercentage,
  FaEquals,
  FaCalendarAlt,
  FaInfoCircle,
  FaLightbulb,
  FaArrowRight,
  FaAward
} from 'react-icons/fa';
import { FaArrowTrendUp, FaArrowTrendDown, FaBullseye } from 'react-icons/fa6';

interface ROIAnalyticsChartProps {
  stats: PointsStats;
  transactions: PointsTransaction[];
  userRole: 'candidate' | 'hr' | 'company';
}

interface ROIMetrics {
  totalInvestment: number;
  totalReturns: number;
  roi: number;
  trend: 'up' | 'down' | 'stable';
  efficiency: number;
  recommendations: string[];
  categoryROI: { category: string; roi: number; impact: 'high' | 'medium' | 'low' }[];
}

const ROIAnalyticsChart: React.FC<ROIAnalyticsChartProps> = ({
  stats,
  transactions,
  userRole
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  // Calculate ROI metrics based on user role
  const calculateROI = (): ROIMetrics => {
    const spentTransactions = transactions.filter(t => t.type === 'spent');
    const earnedTransactions = transactions.filter(t => t.type === 'earned' || t.type === 'purchased');

    const totalInvestment = spentTransactions.reduce((sum, t) => sum + t.points, 0);
    const totalReturns = earnedTransactions.reduce((sum, t) => sum + t.points, 0);

    // Calculate ROI as percentage
    const roi = totalInvestment > 0 ? ((totalReturns - totalInvestment) / totalInvestment) * 100 : 0;

    // Determine trend
    const currentMonthROI = stats.current_month.earned > 0
      ? ((stats.current_month.earned - stats.current_month.spent) / stats.current_month.spent) * 100
      : 0;
    const lastMonthROI = stats.last_month.earned > 0
      ? ((stats.last_month.earned - stats.last_month.spent) / stats.last_month.spent) * 100
      : 0;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (currentMonthROI > lastMonthROI * 1.1) trend = 'up';
    else if (currentMonthROI < lastMonthROI * 0.9) trend = 'down';

    // Calculate efficiency
    const efficiency = Math.min(Math.max((roi + 100) / 2, 0), 100);

    // Generate role-specific recommendations
    const recommendations = generateRecommendations(userRole, roi, efficiency, stats);

    // Calculate category-wise ROI
    const categoryROI = calculateCategoryROI(stats, userRole);

    return {
      totalInvestment,
      totalReturns,
      roi,
      trend,
      efficiency,
      recommendations,
      categoryROI
    };
  };

  const generateRecommendations = (role: string, roi: number, efficiency: number, stats: PointsStats): string[] => {
    const recommendations = [];

    if (role === 'candidate') {
      if (roi < 0) {
        recommendations.push('Focus on high-value job applications to improve ROI');
        recommendations.push('Consider profile optimization before applying');
      } else if (roi < 50) {
        recommendations.push('Target senior-level positions for better point returns');
        recommendations.push('Use profile boosts strategically during peak hours');
      } else {
        recommendations.push('Excellent ROI! Consider scaling your application strategy');
        recommendations.push('Share your successful approach with the community');
      }
    } else if (role === 'hr') {
      if (roi < 0) {
        recommendations.push('Refine candidate search criteria to reduce screening time');
        recommendations.push('Focus on premium candidates for better hiring success');
      } else if (roi < 30) {
        recommendations.push('Use bulk purchase packages for cost optimization');
        recommendations.push('Implement targeted recruitment campaigns');
      } else {
        recommendations.push('Great recruitment efficiency! Consider expanding team access');
        recommendations.push('Leverage analytics to identify top-performing strategies');
      }
    } else {
      if (roi < 0) {
        recommendations.push('Optimize enterprise recruitment strategy');
        recommendations.push('Consider long-term talent acquisition planning');
      } else if (roi < 25) {
        recommendations.push('Leverage enterprise features for better value');
        recommendations.push('Implement company-wide recruitment analytics');
      } else {
        recommendations.push('Excellent enterprise ROI! Scale successful strategies');
        recommendations.push('Consider strategic partnerships for talent acquisition');
      }
    }

    return recommendations.slice(0, 3);
  };

  const calculateCategoryROI = (stats: PointsStats, role: string) => {
    return stats.top_categories.map(category => {
      const baseROI = Math.random() * 80 + 20; // Mock ROI between 20-100%
      const impact = baseROI > 70 ? 'high' : baseROI > 40 ? 'medium' : 'low';

      return {
        category: category.category,
        roi: Math.round(baseROI),
        impact
      };
    }).slice(0, 4);
  };

  const roiMetrics = calculateROI();

  // Get ROI color based on value
  const getROIColor = (roi: number) => {
    if (roi >= 50) return 'text-green-600';
    if (roi >= 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getROIBgColor = (roi: number) => {
    if (roi >= 50) return 'bg-green-50';
    if (roi >= 0) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-4 sm:px-6 py-5 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <FaChartLine className="text-blue-500 h-5 w-5" />
            <h3 className="text-lg font-semibold text-gray-900">ROI Analytics</h3>
          </div>

          {/* Period Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['month', 'quarter', 'year'] as const).map((period) => (
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
        {/* Overall ROI Summary */}
        <div className={`rounded-lg p-4 mb-6 ${getROIBgColor(roiMetrics.roi)}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FaPercentage className={`h-5 w-5 ${getROIColor(roiMetrics.roi)}`} />
              <h4 className="font-medium text-gray-700">Overall ROI</h4>
            </div>
            <div className="flex items-center gap-1">              {roiMetrics.trend === 'up' && <FaArrowTrendUp className="text-green-500 h-4 w-4" />}
              {roiMetrics.trend === 'down' && <FaArrowTrendDown className="text-red-500 h-4 w-4" />}
              {roiMetrics.trend === 'stable' && <FaEquals className="text-gray-500 h-4 w-4" />}
              <span className="text-sm text-gray-600 capitalize">{roiMetrics.trend}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <p className={`text-2xl sm:text-3xl font-bold ${getROIColor(roiMetrics.roi)}`}>
                {roiMetrics.roi >= 0 ? '+' : ''}{roiMetrics.roi.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">Return on Investment</p>
            </div>

            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {roiMetrics.efficiency.toFixed(0)}%
              </p>
              <p className="text-sm text-gray-600">Efficiency Score</p>
            </div>

            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-blue-600">
                {roiMetrics.totalReturns - roiMetrics.totalInvestment >= 0 ? '+' : ''}
                {roiMetrics.totalReturns - roiMetrics.totalInvestment}
              </p>
              <p className="text-sm text-gray-600">Net Points</p>
            </div>
          </div>
        </div>

        {/* Investment Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
              <FaDollarSign className="text-red-500 h-4 w-4" />
              Investment Analysis
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Invested</span>
                <span className="font-semibold text-red-600">{roiMetrics.totalInvestment} pts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Returns</span>
                <span className="font-semibold text-green-600">{roiMetrics.totalReturns} pts</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Net Gain/Loss</span>
                  <span className={`font-bold ${roiMetrics.totalReturns - roiMetrics.totalInvestment >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                    }`}>
                    {roiMetrics.totalReturns - roiMetrics.totalInvestment >= 0 ? '+' : ''}
                    {roiMetrics.totalReturns - roiMetrics.totalInvestment} pts
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500 h-4 w-4" />
              Performance Timeline
            </h4>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Current {selectedPeriod}</span>
                  <span className="text-sm font-medium">{stats.current_month.net_change} pts</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className={`h-2 rounded-full ${stats.current_month.net_change >= 0 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    style={{
                      width: `${Math.abs(stats.current_month.net_change / Math.max(Math.abs(stats.current_month.net_change), Math.abs(stats.last_month.net_change), 1)) * 100}%`
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Previous {selectedPeriod}</span>
                  <span className="text-sm font-medium">{stats.last_month.net_change} pts</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className={`h-2 rounded-full ${stats.last_month.net_change >= 0 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    style={{
                      width: `${Math.abs(stats.last_month.net_change / Math.max(Math.abs(stats.current_month.net_change), Math.abs(stats.last_month.net_change), 1)) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category ROI Analysis */}
        {roiMetrics.categoryROI.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
              <FaBullseye className="text-purple-500 h-4 w-4" />
              Category Performance
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roiMetrics.categoryROI.map((category, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {category.category.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${category.impact === 'high' ? 'bg-green-100 text-green-800' :
                          category.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {category.impact} impact
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${category.impact === 'high' ? 'bg-green-500' :
                            category.impact === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                        style={{ width: `${Math.min(category.roi, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{category.roi}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Smart Recommendations */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
            <FaLightbulb className="text-yellow-500 h-4 w-4" />
            ROI Optimization Tips
          </h4>

          <div className="space-y-3">
            {roiMetrics.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <FaArrowRight className="h-3 w-3 text-blue-500" />
                </div>
                <p className="text-sm text-gray-700">{recommendation}</p>
              </div>
            ))}
          </div>

          {roiMetrics.roi > 50 && (
            <div className="mt-4 pt-3 border-t border-blue-200">
              <div className="flex items-center gap-2 text-blue-700">
                <FaAward className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Congratulations! You're achieving excellent ROI performance.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ROIAnalyticsChart;
