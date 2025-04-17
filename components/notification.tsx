import React from 'react';
import { 
  AlertCircleIcon, 
  CheckCircleIcon, 
  InfoIcon, 
  XIcon 
} from 'lucide-react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationProps {
  notification: Notification;
  onClose?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationProps> = ({
  notification,
  onClose,
  onMarkAsRead
}) => {
  const { id, title, message, timestamp, isRead, type } = notification;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
          title: 'text-green-800'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: <AlertCircleIcon className="h-5 w-5 text-yellow-500" />,
          title: 'text-yellow-800'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: <AlertCircleIcon className="h-5 w-5 text-red-500" />,
          title: 'text-red-800'
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: <InfoIcon className="h-5 w-5 text-blue-500" />,
          title: 'text-blue-800'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div 
      className={`relative p-4 ${styles.bg} border ${styles.border} rounded-lg ${
        isRead ? 'opacity-80' : ''
      }`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {styles.icon}
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${styles.title}`}>{title}</h3>
          <div className="mt-1 text-sm text-gray-700">
            <p>{message}</p>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {timestamp}
          </div>
        </div>
        {onClose && (
          <div className="ml-4 flex-shrink-0 flex">
            <button
              type="button"
              className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={() => onClose(id)}
            >
              <span className="sr-only">Close</span>
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
      {!isRead && onMarkAsRead && (
        <button
          type="button"
          className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
          onClick={() => onMarkAsRead(id)}
        >
          Mark as read
        </button>
      )}
    </div>
  );
};

export const NotificationList: React.FC<{
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onClose?: (id: string) => void;
  onMarkAllAsRead?: () => void;
}> = ({ notifications, onMarkAsRead, onClose, onMarkAllAsRead }) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-4">
      {notifications.length > 0 ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-sm font-medium text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h2>
            {unreadCount > 0 && onMarkAllAsRead && (
              <button
                type="button"
                className="text-sm text-teal-600 hover:text-teal-800"
                onClick={onMarkAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>
          <div className="space-y-3">
            {notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onClose={onClose}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <p>No notifications</p>
        </div>
      )}
    </div>
  );
};
