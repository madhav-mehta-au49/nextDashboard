'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types/points';
import { getUserAuth } from '@/app/utils/auth';

interface UserContextType {
  userRole: UserRole | null;
  setUserRole: (role: UserRole | null) => void;
  isAuthenticated: boolean;
  userPoints: number;
  setUserPoints: (points: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userRole, setUserRoleState] = useState<UserRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  
  // Function to check and update authentication state
  const checkAuthState = () => {
    const auth = getUserAuth();
    const savedPoints = localStorage.getItem('userPoints');
    
    if (auth.isAuthenticated && auth.userRole) {
      if (['candidate', 'hr', 'company', 'employer'].includes(auth.userRole)) {
        setUserRoleState(auth.userRole as UserRole);
        setIsAuthenticated(true);

        // Set points based on stored value or defaults
        if (savedPoints) {
          setUserPoints(parseInt(savedPoints, 10));
        } else {
          // Set default points based on role
          const defaultPoints = {
            candidate: 42,
            hr: 85,
            company: 120,
            employer: 120
          };
          const points = defaultPoints[auth.userRole as keyof typeof defaultPoints] || 0;
          setUserPoints(points);
          localStorage.setItem('userPoints', points.toString());
        }
      } else {
        console.warn('Invalid user role:', auth.userRole);
        setIsAuthenticated(false);
        setUserRoleState(null);
      }
    } else {
      setIsAuthenticated(false);
      setUserRoleState(null);
      setUserPoints(0);
    }
  };

  useEffect(() => {
    // Initial check
    checkAuthState();

    // Listen for storage changes (when localStorage is updated in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userRole' || e.key === 'isAuthenticated' || e.key === 'userPoints') {
        checkAuthState();
      }
    };

    // Listen for custom storage events (for same-tab updates)
    const handleCustomStorageChange = (e: CustomEvent) => {
      console.log('Auth state updated:', e.detail);
      checkAuthState();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-updated', handleCustomStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-updated', handleCustomStorageChange as EventListener);
    };
  }, []);

  const setUserRole = (role: UserRole | null) => {
    if (role && ['candidate', 'hr', 'company', 'employer'].includes(role)) {
      setUserRoleState(role);
      setIsAuthenticated(true);

      // Set default points for new role
      const defaultPoints = {
        candidate: 42,
        hr: 85,
        company: 120,
        employer: 120
      };
      const points = defaultPoints[role as keyof typeof defaultPoints];
      setUserPoints(points);
      localStorage.setItem('userPoints', points.toString());
    } else {
      setUserRoleState(null);
      setIsAuthenticated(false);
      setUserPoints(0);
      localStorage.removeItem('userPoints');
    }
  };

  const contextValue: UserContextType = {
    userRole,
    setUserRole,
    isAuthenticated,
    userPoints,
    setUserPoints: (points: number) => {
      setUserPoints(points);
      localStorage.setItem('userPoints', points.toString());
    }
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
