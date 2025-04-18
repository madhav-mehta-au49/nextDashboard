"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  CogIcon, 
  HelpCircleIcon, 
  LogOutIcon, 
  UserIcon, 
  WalletIcon,
  BellIcon
} from "lucide-react";
import { Notification } from "./notification";

export const EmployeeHeader: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Job Match",
      message: "A new job matching your skills has been posted",
      timestamp: "2 hours ago",
      isRead: false,
      type: "info"
    },
    {
      id: "2",
      title: "Payment Received",
      message: "Your latest payment of $1,450 has been processed",
      timestamp: "1 day ago",
      isRead: false,
      type: "success"
    },
    {
      id: "3",
      title: "Timesheet Due",
      message: "Remember to submit your timesheet for this week",
      timestamp: "2 days ago",
      isRead: true,
      type: "warning"
    }
  ]);

  useEffect(() => {
    const safeNotifications = notifications.map(({ id, title, message, timestamp, isRead, type }) => ({
      id,
      title,
      message,
      timestamp,
      isRead,
      type
    }));
    console.log('Notifications:', safeNotifications);
  }, [notifications]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({
        ...notification,
        isRead: true
      }))
    );
  };

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="flex items-center justify-between gap-4">
        <Link href="/employee/dashboard" className="hover:text-gray-200 transition-colors">
          <span className="font-bold text-xl">Employee Portal</span>
        </Link>

        <div className="max-w-2xl w-full">
          <div className="relative">
            <input
              placeholder="Search Jobs..."
              className="w-full bg-white text-gray-800 px-4 py-2 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-teal-700 transition-colors"
            title="Wallet"
          >
            <WalletIcon className="h-5 w-5" />
            <span className="text-sm font-medium">$1,234.56</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-full hover:bg-teal-700 transition-colors relative"
              title="Notifications"
            >
              <BellIcon className="h-5 w-5" />
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {notifications.filter(n => !n.isRead).length}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-medium text-gray-900">Notifications</h3>
                  {notifications.filter(n => !n.isRead).length > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-sm text-teal-600 hover:text-teal-800"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 ${notification.isRead ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 cursor-pointer`}
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <div className="font-medium text-sm text-gray-900">
                          {notification.title}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          {notification.timestamp}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-900 hover:bg-teal-800 transition-colors"
            >
              <span className="sr-only">Open user menu</span>
              <Image
                src=""
                alt="User avatar"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E";
                }}
              />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link 
                  href="/profile" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <UserIcon className="mr-3 h-5 w-5 text-gray-400" />
                  My Profile
                </Link>
                <Link 
                  href="/settings" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <CogIcon className="mr-3 h-5 w-5 text-gray-400" />
                  Settings
                </Link>
                <Link 
                  href="/help" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <HelpCircleIcon className="mr-3 h-5 w-5 text-gray-400" />
                  Help Center
                </Link>
                <Link 
                  href="/signout" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <LogOutIcon className="mr-3 h-5 w-5 text-gray-400" />
                  Sign Out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default EmployeeHeader;
