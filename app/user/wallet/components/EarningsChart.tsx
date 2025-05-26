'use client';

import React, { useState, useEffect } from 'react';
import { WalletStats } from '@/app/user/types/wallet';
import { getEarningsSummary, getReferralEarnings } from '@/services/wallet/walletApi';
import { FaArrowUp, FaUsers, FaGift, FaShare } from 'react-icons/fa';

interface EarningsChartProps {
  userId: string;
  stats: WalletStats | null;
}

interface EarningsSummary {
  total_earnings: number;
  earnings_by_source: { [key: string]: number };
  earnings_timeline: { date: string; amount: number }[];
}

interface ReferralEarnings {
  total_referrals: number;
  total_earnings: number;
  recent_referrals: any[];
}

const EarningsChart: React.FC<EarningsChartProps> = ({ userId, stats }) => {
  const [earningsSummary, setEarningsSummary] = useState<EarningsSummary | null>(null);
  const [referralEarnings, setReferralEarnings] = useState<ReferralEarnings | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEarningsData();
  }, [userId, selectedPeriod]);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [summaryData, referralData] = await Promise.all([
        getEarningsSummary(userId, selectedPeriod),
        getReferralEarnings(userId)
      ]);

      setEarningsSummary(summaryData);
      setReferralEarnings(referralData);
    } catch (err) {
      setError('Failed to load earnings data');
      console.error('Earnings data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'job_completion': return '💼';
      case 'referral_bonus': return '🎁';
      case 'profile_views': return '👁️';
      case 'skill_endorsement': return '⭐';
      default: return '💰';
    }
  };

  const getSourceColor = (source: string) => {
    const colors = {
      job_completion: 'bg-blue-100 text-blue-800',
      referral_bonus: 'bg-green-100 text-green-800',
      profile_views: 'bg-purple-100 text-purple-800',
      skill_endorsement: 'bg-yellow-100 text-yellow-800'
    };
    return colors[source as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const calculatePercentage = (amount: number, total: number) => {
    return total > 0 ? ((amount / total) * 100).toFixed(1) : '0';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 text-xl mb-4">{error}</div>
        <button 
          onClick={fetchEarningsData}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Earnings Analytics</h2>
        <div className="flex space-x-2">
          {(['week', 'month', 'year'] as const).map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Earnings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(earningsSummary?.total_earnings || 0)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaArrowUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              This {selectedPeriod}
            </p>
          </div>
        </div>

        {/* This Month vs Last Month */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(stats?.this_month_earnings || 0)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaArrowUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Last month: {formatCurrency(stats?.last_month_earnings || 0)}
            </p>
          </div>
        </div>

        {/* Referral Earnings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Referral Earnings</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(referralEarnings?.total_earnings || 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FaGift className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              {referralEarnings?.total_referrals || 0} referrals
            </p>
          </div>
        </div>

        {/* Active Referrals */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Referrals</p>
              <p className="text-2xl font-bold text-orange-600">
                {referralEarnings?.total_referrals || 0}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FaUsers className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Active users referred
            </p>
          </div>
        </div>
      </div>

      {/* Earnings by Source */}
      {earningsSummary?.earnings_by_source && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Earnings by Source</h3>
          
          <div className="space-y-4">
            {Object.entries(earningsSummary.earnings_by_source).map(([source, amount]) => {
              const percentage = calculatePercentage(amount, earningsSummary.total_earnings);
              
              return (
                <div key={source} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getSourceIcon(source)}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {source.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getSourceColor(source)}`}>
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(amount)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress Bars */}
          <div className="mt-6 space-y-3">
            {Object.entries(earningsSummary.earnings_by_source).map(([source, amount]) => {
              const percentage = parseFloat(calculatePercentage(amount, earningsSummary.total_earnings));
              
              return (
                <div key={source}>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {source.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className="text-gray-900">{percentage}%</span>
                  </div>
                  <div className="mt-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Earnings Timeline */}
      {earningsSummary?.earnings_timeline && earningsSummary.earnings_timeline.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Earnings Timeline</h3>
          
          <div className="space-y-3">
            {earningsSummary.earnings_timeline.slice(0, 10).map((entry, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">
                    +{formatCurrency(entry.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Referrals */}
      {referralEarnings?.recent_referrals && referralEarnings.recent_referrals.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Referrals</h3>
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              <FaShare className="w-4 h-4" />
              <span>Share Referral Code</span>
            </button>
          </div>
          
          <div className="space-y-3">
            {referralEarnings.recent_referrals.slice(0, 5).map((referral, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">
                    {referral.name || 'Anonymous User'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(referral.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">
                    +{formatCurrency(referral.bonus_amount || 0)}
                  </p>
                  <p className="text-xs text-gray-500">Bonus earned</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Data State */}
      {(!earningsSummary || earningsSummary.total_earnings === 0) && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Earnings Data</h3>
          <p className="text-gray-600 mb-4">
            Start completing jobs and referring friends to see your earnings analytics here.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Browse Jobs
          </button>
        </div>
      )}
    </div>
  );
};

export default EarningsChart;
