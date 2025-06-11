'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Link from 'next/link';
import { storeUserAuth } from '@/app/utils/auth';
import OAuthButtons from '@/app/components/OAuthButtons';

// Declare redirectTimeout on window
declare global {
  interface Window {
    redirectTimeout?: NodeJS.Timeout;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          remember: formData.rememberMe,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Login success:', data);
        
        if (data.data) {
          // Store user data in auth state
          storeUserAuth({
            id: data.data.id,
            name: data.data.name,
            role: data.data.role
          });

          // Clear any previous redirect attempts
          if (window.redirectTimeout) {
            clearTimeout(window.redirectTimeout);
          }          // Use a short timeout to ensure state is updated
          window.redirectTimeout = setTimeout(() => {
            try {
              // Redirect to home page after successful login
              console.log('Redirecting to home page after login');
              window.location.href = '/';
            } catch (error) {
              console.error('Redirect failed:', error);
              window.location.href = '/';
            }
          }, 500);
        } else {
          setErrors({ email: 'Unexpected response format from server' });
        }
      } else {
        const errorData = await response.json();
        setErrors({ email: errorData.message || 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ email: 'Login failed. Please check your network connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Left Side - Branding Section */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-teal-500 to-blue-500 text-white p-10">
          <h2 className="text-3xl font-bold">Welcome Back!</h2>
          <p className="mt-4 text-lg">Log in to continue your journey.</p>
        </div>

        {/* Right Side - Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-teal-600 mb-6">Log In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full mt-1 p-2 border rounded-lg focus:ring-teal-500 focus:border-teal-500 ${
                  errors.email ? 'border-red-500' : ''
                }`}
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full mt-1 p-2 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 flex items-center text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                />
                <span>Remember me (24 hours)</span>
              </div>
              <Link href="/auth/forgot-password" className="text-teal-600 underline">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-teal-500 text-white p-3 rounded-lg font-bold hover:bg-teal-600 transition"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center my-4">
            <hr className="flex-1 border-gray-300" />
            <span className="mx-4 text-gray-500">or log in with</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* OAuth Buttons */}
          <OAuthButtons onBeforeRedirect={() => setIsLoading(true)} />

          {/* Sign Up Link */}
          <p className="mt-4 text-center text-gray-700">
            Don't have an account?{" "}
            <Link href="/signup" className="text-teal-600 font-bold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
