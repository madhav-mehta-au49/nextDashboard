'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types/points';

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
    const savedRole = localStorage.getItem('userRole') as UserRole;
    const savedPoints = localStorage.getItem('userPoints');
    const isAuthenticatedFlag = localStorage.getItem('isAuthenticated') === 'true';

    console.log('UserContext checking auth state:', { savedRole, isAuthenticatedFlag });

    if (savedRole && ['candidate', 'hr', 'company', 'employer'].includes(savedRole)) {
      setUserRoleState(savedRole);
      setIsAuthenticated(true);
    } else if (isAuthenticatedFlag) {
      // If we have authentication flag but no role, still consider authenticated
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setUserRoleState(null);
    }

    if (savedPoints) {
      setUserPoints(parseInt(savedPoints, 10));
    } else {
      // Set default points based on role
      const defaultPoints = {
        candidate: 42,
        hr: 85,
        company: 120
      };
      setUserPoints(defaultPoints[savedRole] || 0);
    }
  };

  useEffect(() => {
    // Initial check
    checkAuthState();

    // Listen for storage changes (when localStorage is updated in the same tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userRole' || e.key === 'isAuthenticated' || e.key === 'userPoints') {
        checkAuthState();
      }
    };

    // Listen for custom storage events (for same-tab updates)
    const handleCustomStorageChange = () => {
      checkAuthState();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-updated', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-updated', handleCustomStorageChange);
    };
  }, []);

  const setUserRole = (role: UserRole | null) => {
    setUserRoleState(role);
    if (role) {
      localStorage.setItem('userRole', role);
      setIsAuthenticated(true);

      // Set default points for new role
      const defaultPoints = {
        candidate: 42,
        hr: 85,
        company: 120
      };
      setUserPoints(defaultPoints[role]);
      localStorage.setItem('userPoints', defaultPoints[role].toString());
    } else {
      localStorage.removeItem('userRole');
      localStorage.removeItem('userPoints');
      setIsAuthenticated(false);
      setUserPoints(0);
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
