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
import { getCurrentUserCandidateProfile } from "../app/services/candidate/candidateApi";
import { redirectToProfile } from "../app/utils/auth";

export const EmployeeHeader: React.FC = () => {
  const [userPoints, setUserPoints] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('User');
  const [candidateProfile, setCandidateProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  useEffect(() => {
    // Get user points and role from localStorage
    const savedPoints = localStorage.getItem('userPoints');
    const savedRole = localStorage.getItem('userRole');
    const savedName = localStorage.getItem('userName');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    console.log('EmployeeHeader loading user data from localStorage:', { savedRole, savedName, isAuthenticated });

    if (savedPoints) {
      setUserPoints(parseInt(savedPoints, 10));
    }

    if (savedRole) {
      setUserRole(savedRole);
    }
    
    if (savedName) {
      setUserName(savedName);
    }

    // Load candidate profile if user is a candidate
    if (savedRole === 'candidate') {
      setIsLoadingProfile(true);
      getCurrentUserCandidateProfile()
        .then((response: any) => {
          setCandidateProfile(response.candidate);
        })
        .catch((error: any) => {
          console.error('Error fetching candidate profile:', error);
          setCandidateProfile(null);
        })
        .finally(() => {
          setIsLoadingProfile(false);
        });
    }
    
    // Fetch current user data
    fetch('/api/auth/user', {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      }
    })      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Failed to fetch user data');
      })
      .then((data: any) => {
        if (data.user?.name) {
          setUserName(data.user.name);
          localStorage.setItem('userName', data.user.name);
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);
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
          <span className="font-bold text-xl">
            {userRole === 'candidate' ? 'Candidate Portal' : userRole === 'employer' ? 'Employer Portal' : 'HR Portal'}
          </span>
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
        </div>        <div className="flex items-center gap-4">          <Link
          href="/user/wallet"
          className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-teal-700 transition-colors"
          title="Wallet"
        >
          <WalletIcon className="h-5 w-5" />
          <span className="text-sm font-medium">{userPoints} pts</span>
        </Link>

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
                    </div>                  ) : (
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
          </div>          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-teal-700 transition-colors"
            >
              <span className="sr-only">Open user menu</span>
              <div className="flex items-center h-8 w-8 rounded-full bg-teal-600 text-white justify-center overflow-hidden">
                {candidateProfile?.profile_picture ? (
                  <Image
                    src={candidateProfile.profile_picture}
                    alt={userName}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="font-semibold text-sm">{userName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <span className="text-sm font-medium hidden md:block">{userName}</span>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="font-medium text-gray-800">{userName}</div>
                  <div className="text-sm text-gray-500">Role: {userRole === 'candidate' ? 'Job Seeker' : userRole === 'employer' ? 'Employer' : 'HR Manager'}</div>
                </div>

                {/* Profile options based on role */}
                {userRole === 'candidate' && (
                  <>
                    {isLoadingProfile ? (
                      <div className="flex items-center px-4 py-2 text-sm text-gray-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-3"></div>
                        Loading profile...
                      </div>
                    ) : candidateProfile ? (                      <Link
                        href={`/user/candidate/${candidateProfile.slug || candidateProfile.id}`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          redirectToProfile('candidate', candidateProfile.slug || candidateProfile.id);
                        }}
                      >
                        <UserIcon className="mr-3 h-5 w-5 text-green-500" />
                        <div className="flex flex-col">
                          <span>View Profile</span>
                          <span className="text-xs text-green-600 font-medium">
                            {candidateProfile.completion_percentage || 0}% Complete
                          </span>
                        </div>
                      </Link>
                    ) : (
                      <Link
                        href="/user/candidate/create"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <UserIcon className="mr-3 h-5 w-5 text-teal-500" />
                        <div className="flex flex-col">
                          <span>Create Profile</span>
                          <span className="text-xs text-teal-600">Get started!</span>
                        </div>
                      </Link>
                    )}
                    <hr className="my-1 border-gray-200" />
                  </>
                )}

                {/* Company options for employer/HR roles */}
                {(userRole === 'employer' || userRole === 'hr') && (
                  <>
                    <Link
                      href="/companies/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <UserIcon className="mr-3 h-5 w-5 text-blue-500" />
                      <div className="flex flex-col">
                        <span>Company Dashboard</span>
                        <span className="text-xs text-blue-600">Manage your listings</span>
                      </div>
                    </Link>
                    <hr className="my-1 border-gray-200" />
                  </>
                )}                {/* Common menu items */}
                
                {/* Only show Dashboard for non-candidates */}
                {userRole !== 'candidate' && (
                  <Link
                    href={userRole === 'candidate' ? '/user/dashboard' : 
                         userRole === 'employer' ? '/companies/dashboard' : '/user/dashboard'}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <UserIcon className="mr-3 h-5 w-5 text-gray-400" />
                    My Dashboard
                  </Link>
                )}                  {/* Profile links based on role - only for non-candidates */}
                {userRole === 'employer' ? (
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    onClick={async (e) => {
                      e.preventDefault();
                      setIsProfileMenuOpen(false);
                      await redirectToProfile('employer');
                    }}
                  >
                    <UserIcon className="mr-3 h-5 w-5 text-blue-400" />
                    Company Profile
                  </button>
                ) : null}
                <Link
                  href="/user/wallet"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <WalletIcon className="mr-3 h-5 w-5 text-gray-400" />
                  My Wallet
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
