import React, { useState, useEffect } from 'react';
import { FiCheck, FiClock, FiEye, FiMessageSquare, FiUserCheck, FiX } from 'react-icons/fi';

interface StatusHistoryItem {
  id: number;
  old_status: string;
  new_status: string;
  notes: string | null;
  changed_by: number;
  created_at: string;
  changed_by_user?: {
    id: number;
    name: string;
    role: string;
  };
}

interface ApplicationStatusTimelineProps {
  applicationId: number;
  currentStatus: string;
  appliedDate: string;
  className?: string;
}

const statusConfig = {
  pending: {
    label: 'Application Submitted',
    icon: FiCheck,
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Your application has been successfully submitted'
  },
  reviewing: {
    label: 'Under Review',
    icon: FiEye,
    color: 'bg-yellow-500',
    textColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    description: 'Your application is being reviewed by the hiring team'
  },
  interviewed: {
    label: 'Interview Scheduled',
    icon: FiMessageSquare,
    color: 'bg-purple-500',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'You have been selected for an interview'
  },
  offered: {
    label: 'Offer Extended',
    icon: FiUserCheck,
    color: 'bg-green-500',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
    description: 'Congratulations! You have received a job offer'
  },
  hired: {
    label: 'Hired',
    icon: FiCheck,
    color: 'bg-emerald-500',
    textColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    description: 'Welcome to the team! You have been successfully hired'
  },
  rejected: {
    label: 'Not Selected',
    icon: FiX,
    color: 'bg-red-500',
    textColor: 'text-red-600',
    bgColor: 'bg-red-50',
    description: 'Thank you for your interest. We have decided to move forward with other candidates'
  }
};

const statusOrder = ['pending', 'reviewing', 'interviewed', 'offered', 'hired'];

const ApplicationStatusTimeline: React.FC<ApplicationStatusTimelineProps> = ({
  applicationId,
  currentStatus,
  appliedDate,
  className = ''
}) => {
  const [statusHistory, setStatusHistory] = useState<StatusHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatusHistory();
  }, [applicationId]);
  const fetchStatusHistory = async () => {
    try {
      setLoading(true);
      const { JobApplicationService } = await import('../../../services/jobs/jobApplicationService');
      const data = await JobApplicationService.getApplicationStatusHistory(applicationId);
      setStatusHistory(data || []);
    } catch (err) {
      console.error('Error fetching status history:', err);
      setError('Failed to load status history');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStatusIndex = () => {
    return statusOrder.indexOf(currentStatus);
  };

  const getStatusDate = (status: string) => {
    if (status === 'pending') {
      return appliedDate;
    }
    
    const historyItem = statusHistory.find(item => item.new_status === status);
    if (historyItem) {
      return new Date(historyItem.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    
    return null;
  };

  const getStatusNotes = (status: string) => {
    const historyItem = statusHistory.find(item => item.new_status === status);
    return historyItem?.notes || null;
  };

  const getStatusUpdater = (status: string) => {
    const historyItem = statusHistory.find(item => item.new_status === status);
    return historyItem?.changed_by_user?.name || 'System';
  };

  const currentStatusIndex = getCurrentStatusIndex();

  if (loading) {
    return (
      <div className={`bg-gray-50 p-6 rounded-lg border border-gray-200 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 p-6 rounded-lg border border-red-200 ${className}`}>
        <p className="text-red-600">Error loading status timeline: {error}</p>
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 p-6 rounded-lg border border-gray-200 ${className}`}>
      <h3 className="font-semibold text-gray-800 mb-6">Application Status Timeline</h3>
      
      {/* Timeline Visual */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-3 left-3 w-full h-0.5 bg-gray-300"></div>
        <div 
          className="absolute top-3 left-3 h-0.5 bg-teal-500 transition-all duration-500"
          style={{ 
            width: currentStatusIndex >= 0 ? `${(currentStatusIndex / (statusOrder.length - 1)) * 100}%` : '0%'
          }}
        ></div>

        {/* Status Points */}
        <div className="flex justify-between relative">
          {statusOrder.map((status, index) => {
            const config = statusConfig[status as keyof typeof statusConfig];
            const isActive = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            const Icon = config.icon;
            const statusDate = getStatusDate(status);
            const statusNotes = getStatusNotes(status);
            const updater = getStatusUpdater(status);

            return (
              <div key={status} className="flex flex-col items-center relative">
                {/* Status Circle */}
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive ? config.color : 'bg-gray-300'
                  } ${isCurrent ? 'ring-4 ring-opacity-30 ' + config.color.replace('bg-', 'ring-') : ''}`}
                >
                  <Icon 
                    size={14} 
                    className={isActive ? 'text-white' : 'text-gray-500'} 
                  />
                </div>

                {/* Status Label and Date */}
                <div className="mt-3 text-center min-w-0 max-w-32">
                  <p className={`text-sm font-medium ${
                    isActive ? config.textColor : 'text-gray-500'
                  }`}>
                    {config.label}
                  </p>
                  {statusDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      {statusDate}
                    </p>
                  )}
                  {statusNotes && (
                    <div className="mt-2 p-2 bg-white rounded shadow-sm border text-xs text-gray-700 max-w-48">
                      <p className="font-medium text-gray-800 mb-1">Update Notes:</p>
                      <p>{statusNotes}</p>
                      <p className="text-gray-500 mt-1">Updated by: {updater}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Status Description */}
      <div className={`mt-6 p-4 rounded-lg ${statusConfig[currentStatus as keyof typeof statusConfig]?.bgColor || 'bg-gray-50'}`}>
        <div className="flex items-start">
          <div className={`p-2 rounded-full mr-3 ${statusConfig[currentStatus as keyof typeof statusConfig]?.color || 'bg-gray-500'}`}>
            {React.createElement(statusConfig[currentStatus as keyof typeof statusConfig]?.icon || FiClock, {
              size: 16,
              className: 'text-white'
            })}
          </div>
          <div>
            <h4 className={`font-medium ${statusConfig[currentStatus as keyof typeof statusConfig]?.textColor || 'text-gray-600'}`}>
              {statusConfig[currentStatus as keyof typeof statusConfig]?.label || 'Unknown Status'}
            </h4>
            <p className="text-gray-600 text-sm mt-1">
              {statusConfig[currentStatus as keyof typeof statusConfig]?.description || 'Status information not available'}
            </p>
            {getStatusNotes(currentStatus) && (
              <div className="mt-3 p-3 bg-white rounded border text-sm">
                <p className="font-medium text-gray-800 mb-1">Latest Update:</p>
                <p className="text-gray-700">{getStatusNotes(currentStatus)}</p>
                <p className="text-gray-500 text-xs mt-1">
                  Updated by {getStatusUpdater(currentStatus)} on {getStatusDate(currentStatus)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status History Details */}
      {statusHistory.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-800 mb-3">Status History</h4>
          <div className="space-y-3">
            {statusHistory.slice().reverse().map((item, index) => (
              <div key={item.id} className="flex items-start p-3 bg-white rounded border">
                <div className={`p-1.5 rounded-full mr-3 ${statusConfig[item.new_status as keyof typeof statusConfig]?.color || 'bg-gray-500'}`}>
                  {React.createElement(statusConfig[item.new_status as keyof typeof statusConfig]?.icon || FiClock, {
                    size: 12,
                    className: 'text-white'
                  })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-800">
                      Status changed to {statusConfig[item.new_status as keyof typeof statusConfig]?.label || item.new_status}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                  {item.notes && (
                    <p className="text-sm text-gray-600 mt-1">{item.notes}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Updated by {item.changed_by_user?.name || 'System'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationStatusTimeline;
