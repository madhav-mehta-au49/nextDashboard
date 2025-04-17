import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    role: string;
  } | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });
  
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setAuthState({
          isAuthenticated: true,
          user: data.user,
          loading: false,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json() as { user: { id: string; email: string; role: string } };
        setAuthState({
          isAuthenticated: true,
          user: data.user,
          loading: false,
        });
        router.push('/dashboard');
        toaster.create({
          title: 'Login successful',
          type: 'success',
          duration: 3000,
          meta: { closable: true }
        });
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      toaster.create({
        title: 'Login failed',
        description: 'Invalid credentials',
        type: 'error',
        duration: 3000,
        meta: { closable: true }
      });
    }
  };
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
      
      router.push('/login');
      toaster.create({
        title: 'Logged out successfully',
        type: 'success',
        duration: 3000,
        meta: { closable: true }
      });
    } catch (error) {
      toaster.create({
        title: 'Logout failed',
        type: 'error',
        duration: 3000,
        meta: { closable: true }
      });
    }
  };

  const checkRole = (requiredRole: string): boolean => {
    return authState.user?.role === requiredRole;
  };

  const isAdmin = (): boolean => {
    return checkRole('admin');
  };

  return {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    loading: authState.loading,
    login,
    logout,
    checkRole,
    isAdmin,
  };
};