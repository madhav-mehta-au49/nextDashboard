// Authentication helpers
import Cookies from 'js-cookie';

// Cookie names
export const AUTH_COOKIE_NAMES = {
  USER_ROLE: 'userRole',
  USER_NAME: 'userName',
  USER_ID: 'userId',
  IS_AUTHENTICATED: 'isAuthenticated',
};

// Cookie options
const COOKIE_OPTIONS = {
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  expires: 1, // 1 day
};

/**
 * Stores user authentication data in both localStorage and cookies
 * @param userData User authentication data
 */
export const storeUserAuth = (userData: { 
  id?: number | string,
  name?: string, 
  role?: string,
}) => {  // Store in localStorage and cookies
  const updates: Record<string, string> = {
    [AUTH_COOKIE_NAMES.IS_AUTHENTICATED]: 'true'
  };

  if (userData.role) {
    updates[AUTH_COOKIE_NAMES.USER_ROLE] = userData.role;
  }
  if (userData.name) {
    updates[AUTH_COOKIE_NAMES.USER_NAME] = userData.name;
  }
  if (userData.id) {
    updates[AUTH_COOKIE_NAMES.USER_ID] = String(userData.id);
  }

  // Apply all updates atomically to prevent race conditions
  Object.entries(updates).forEach(([key, value]) => {
    localStorage.setItem(key, value);
    Cookies.set(key, value, COOKIE_OPTIONS);
  });

  // Dispatch custom event with the full auth state
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth-updated', { 
      detail: {
        isAuthenticated: true,
        role: userData.role,
        name: userData.name,
        id: userData.id 
      }
    }));
  }
};

/**
 * Gets user authentication data from localStorage or cookies
 */
export const getUserAuth = () => {
  // Try localStorage first, then cookies as fallback
  const isAuthenticated = localStorage.getItem(AUTH_COOKIE_NAMES.IS_AUTHENTICATED) === 'true' || 
                          Cookies.get(AUTH_COOKIE_NAMES.IS_AUTHENTICATED) === 'true';
                          
  const userRole = localStorage.getItem(AUTH_COOKIE_NAMES.USER_ROLE) || 
                   Cookies.get(AUTH_COOKIE_NAMES.USER_ROLE) || null;
                   
  const userName = localStorage.getItem(AUTH_COOKIE_NAMES.USER_NAME) || 
                   Cookies.get(AUTH_COOKIE_NAMES.USER_NAME) || 'User';
                   
  const userId = localStorage.getItem(AUTH_COOKIE_NAMES.USER_ID) || 
                 Cookies.get(AUTH_COOKIE_NAMES.USER_ID) || null;
  
  return {
    isAuthenticated,
    userRole,
    userName,
    userId,
  };
};

/**
 * Clears user authentication data from both localStorage and cookies
 */
export const clearUserAuth = () => {
  // Clear localStorage
  localStorage.removeItem(AUTH_COOKIE_NAMES.USER_ROLE);
  localStorage.removeItem(AUTH_COOKIE_NAMES.USER_NAME);
  localStorage.removeItem(AUTH_COOKIE_NAMES.USER_ID);
  localStorage.removeItem(AUTH_COOKIE_NAMES.IS_AUTHENTICATED);
  
  // Clear cookies
  Object.values(AUTH_COOKIE_NAMES).forEach(cookieName => {
    Cookies.remove(cookieName, { path: '/' });
  });

  // Dispatch custom event to notify components of auth state change
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth-updated'));
  }
};

/**
 * Redirects user to home page after authentication
 */
export const redirectBasedOnRole = async (role: string | null) => {
  if (!role) {
    console.warn('No role provided for redirect');
    window.location.href = '/login';
    return;
  }

  try {
    // Store user authentication but redirect to home page for all roles
    console.log(`User authenticated with role: ${role}, redirecting to home page`);
    window.location.href = '/';
  } catch (error) {
    console.error('Error during redirect:', error);
    window.location.href = '/';
  }
};

/**
 * Fetches the employer's company information to get the slug for redirection
 * @returns Promise<string|null> The company slug or null if not found
 */
const getEmployerCompanySlug = async (): Promise<string | null> => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('No authentication token found');
      return null;
    }

    const response = await fetch(`${API_URL}/company/dashboard`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch company data:', response.status);
      return null;
    }

    const data: any = await response.json();
    
    if (data.status === 'success' && data.data?.companies && data.data.companies.length > 0) {
      // Return the slug of the first company (for employers who manage multiple companies)
      const company = data.data.companies[0];
      return company.slug || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching employer company data:', error);
    return null;
  }
};

/**
 * Redirects user to their profile page based on role
 * @param role The user role (candidate, employer, etc.)
 * @param id The candidate slug or company ID
 */
export const redirectToProfile = async (role: string | null, id?: string | number) => {
  if (!role) {
    window.location.href = '/login';
    return;
  }
  
  // Get user ID from auth data if not provided
  let userId: string | number | undefined = id;
  if (!userId) {
    const authData = getUserAuth();
    if (authData.userId) {
      userId = authData.userId;
    }
  }
  
  if (role === 'candidate' && userId) {
    // Redirect candidate to their profile page
    window.location.href = `/user/candidate/${userId}`;
  } else if (role === 'employer' || role === 'company') {
    // For employers, fetch company slug and redirect to company profile
    try {
      const companySlug = await getEmployerCompanySlug();
      if (companySlug) {
        window.location.href = `/companies/${companySlug}`;
      } else {
        // Fallback to company creation if no company found
        window.location.href = '/companies/create';
      }
    } catch (error) {
      console.error('Error redirecting employer to company profile:', error);
      // Fallback to company creation page
      window.location.href = '/companies/create';
    }
  } else if (role === 'candidate') {
    // If candidate but no ID, redirect to candidate creation
    window.location.href = '/user/candidate/create';
  } else {
    // Fallback to home page if no role matches
    window.location.href = '/';
  }
};