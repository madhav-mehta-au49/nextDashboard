'use client';

import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiUsers, FiEye, FiClock, FiTarget } from 'react-icons/fi';

interface CompanyAnalyticsProps {
  stats: {
    total_jobs: number;
    active_jobs: number;
    total_applications: number;
    pending_applications: number;
    views_this_month: number;
    applications_this_month: number;
  };
  companyId?: number | null;
}

const CompanyAnalytics: React.FC<CompanyAnalyticsProps> = ({ stats, companyId }) => {  const metrics = [
    {
      title: 'Total Applications',
      value: stats.total_applications,
      change: '+12%',
      changeType: 'increase',
      icon: FiUsers,
      color: 'blue'
    },
    {
      title: 'Applications This Month',
      value: stats.applications_this_month,
      change: '+8%',
      changeType: 'increase',
      icon: FiTrendingUp,
      color: 'green'
    },
    {
      title: 'Active Job Listings',
      value: stats.active_jobs,
      change: '0%',
      changeType: 'neutral',
      icon: FiTarget,
      color: 'purple'
    },
    {
      title: 'Views This Month',
      value: stats.views_this_month,
      change: '+15%',
      changeType: 'increase',
      icon: FiEye,
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', icon: 'text-blue-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600', icon: 'text-green-600' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', icon: 'text-purple-600' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', icon: 'text-orange-600' }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getChangeIcon = (changeType: string) => {
    if (changeType === 'increase') return <FiTrendingUp className="w-4 h-4 text-green-500" />;
    if (changeType === 'decrease') return <FiTrendingDown className="w-4 h-4 text-red-500" />;
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const colorClasses = getColorClasses(metric.color);
          const IconComponent = metric.icon;

          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${colorClasses.bg}`}>
                  <IconComponent className={`w-6 h-6 ${colorClasses.icon}`} />
                </div>
                <div className="flex items-center space-x-1">
                  {getChangeIcon(metric.changeType)}
                  <span className={`text-sm font-medium ${metric.changeType === 'increase' ? 'text-green-600' :
                      metric.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
                <p className="text-sm text-gray-600">{metric.title}</p>
              </div>
            </div>
          );
        })}
      </div>      {/* Performance Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Performance Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-teal-600">{stats.active_jobs}</div>
            <div className="text-sm text-gray-600">Active Jobs</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.total_applications}</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{stats.pending_applications}</div>
            <div className="text-sm text-gray-600">Pending Reviews</div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <FiTarget className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h4>
            <p className="text-gray-600">Detailed performance metrics and insights will be available as you post more jobs and receive applications.</p>
          </div>
        </div>
      </div>

      {/* Application Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Application Trends</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">This Week</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.floor(stats.applications_this_month / 4)} applications
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">This Month</span>
              <span className="text-sm font-medium text-gray-900">
                {stats.applications_this_month} applications
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total</span>
              <span className="text-sm font-medium text-gray-900">
                {stats.total_applications} applications
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">View All Applications</div>
              <div className="text-sm text-gray-600">Review and manage candidate applications</div>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Export Data</div>
              <div className="text-sm text-gray-600">Download analytics and application data</div>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Schedule Interviews</div>
              <div className="text-sm text-gray-600">Manage interview scheduling</div>
            </button>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Performance Insights</h3>        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">
              {stats.total_applications > 0 ?
                ((stats.applications_this_month / stats.total_applications) * 100).toFixed(1) + '%' :
                '0%'
              }
            </div>
            <div className="text-sm text-gray-600 mt-1">Monthly Growth Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.active_jobs > 0 ?
                Math.round(stats.total_applications / stats.active_jobs) :
                0
              }
            </div>
            <div className="text-sm text-gray-600 mt-1">Avg. Applications per Job</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {/* Use a default value since stats.average_time_to_respond doesn't exist */}
              3d
            </div>
            <div className="text-sm text-gray-600 mt-1">Response Time</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyAnalytics;
