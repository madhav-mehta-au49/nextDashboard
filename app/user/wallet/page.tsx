'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../contexts/UserContext';
import { RoleSelector } from '../components/RoleSelector';
import { UserRole } from '../types/points';
import { 
  FaWallet, 
  FaUser, 
  FaUsers, 
  FaBuilding,
  FaSpinner,
  FaCheckCircle,
  FaCoins,
  FaStar,
  FaShieldAlt,
  FaArrowRight
} from 'react-icons/fa';

const WalletPage = () => {
  const router = useRouter();
  const { userRole, setUserRole, isAuthenticated } = useUser();
  const [loading, setLoading] = useState(false);
  const [autoRedirecting, setAutoRedirecting] = useState(false);

  useEffect(() => {
    // If user already has a role, auto-redirect to their wallet
    if (userRole && isAuthenticated) {
      setAutoRedirecting(true);
      const timer = setTimeout(() => {
        router.push(`/user/wallet/${userRole}`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [userRole, isAuthenticated, router]);

  const handleRoleSelect = (role: string) => {
    setLoading(true);
    setUserRole(role as any);
    
    // Navigate to the specific wallet after a short delay
    setTimeout(() => {
      router.push(`/user/wallet/${role}`);
    }, 500);
  };

  // Show auto-redirect screen if user already has a role
  if (autoRedirecting && userRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-gray-600">Redirecting to your {userRole} wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FaWallet className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Points Wallet System</h1>
          </div>
          <p className="text-xl text-gray-600 mb-2">Choose your wallet type to get started</p>
          <p className="text-gray-500">Experience-based points system for the modern job portal</p>
        </div>

        {/* Role Selector Component */}
        <RoleSelector 
          onRoleSelect={handleRoleSelect}
          autoRedirect={false}
          className="mb-12"
        />

        {/* Loading State */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 text-center">
              <FaSpinner className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Setting up your wallet...</h3>
              <p className="text-gray-600">Please wait while we prepare your dashboard</p>
            </div>
          </div>
        )}

        {/* Features Overview */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Points System Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <FaCoins className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-bold mb-2 text-gray-900">Experience-Based Pricing</h4>
              <p className="text-sm text-gray-600 leading-relaxed">Points cost varies by candidate experience level and expertise</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-100 to-green-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <FaStar className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-bold mb-2 text-gray-900">Skill Multipliers</h4>
              <p className="text-sm text-gray-600 leading-relaxed">High-demand skills like AI/ML command premium pricing</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <FaUsers className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-bold mb-2 text-gray-900">Role-Specific Packages</h4>
              <p className="text-sm text-gray-600 leading-relaxed">Tailored point packages for each user type and need</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <FaShieldAlt className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="font-bold mb-2 text-gray-900">Value-Based Economy</h4>
              <p className="text-sm text-gray-600 leading-relaxed">Points reflect real market value and talent demand</p>
            </div>
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4">
              <FaUser className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Points System</h3>
            <p className="text-gray-600 text-sm">
              Experience-based pricing ensures fair value for all user types with points ranging from 20-300.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-full mb-4">
              <FaUsers className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Role-Based Access</h3>
            <p className="text-gray-600 text-sm">
              Each user type gets specialized features and pricing tailored to their specific needs.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mb-4">
              <FaBuilding className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexible Packages</h3>
            <p className="text-gray-600 text-sm">
              Purchase points in packages that suit your usage patterns and budget requirements.
            </p>
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="bg-white rounded-lg shadow-md p-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full mb-3 text-lg font-bold">
                1
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Choose Your Role</h4>
              <p className="text-gray-600 text-sm">Select candidate, HR, or company based on your needs</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full mb-3 text-lg font-bold">
                2
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Get Starting Points</h4>
              <p className="text-gray-600 text-sm">Receive initial points to explore platform features</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full mb-3 text-lg font-bold">
                3
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Use Features</h4>
              <p className="text-gray-600 text-sm">Spend points on premium features and services</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full mb-3 text-lg font-bold">
                4
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Purchase More</h4>
              <p className="text-gray-600 text-sm">Buy additional points when needed through packages</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h4 className="text-lg font-semibold mb-2">Point Range</h4>
            <p className="text-3xl font-bold text-blue-600 mb-1">50-100</p>
            <p className="text-sm text-gray-600">Maximum points for any action</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h4 className="text-lg font-semibold mb-2">Starting Points</h4>
            <p className="text-3xl font-bold text-green-600 mb-1">20-100</p>
            <p className="text-sm text-gray-600">Based on user type & experience</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h4 className="text-lg font-semibold mb-2">Package Range</h4>
            <p className="text-3xl font-bold text-purple-600 mb-1">$2.99-$49.99</p>
            <p className="text-sm text-gray-600">Affordable point packages</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
