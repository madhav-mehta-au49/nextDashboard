'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaUser,
  FaUsers,
  FaBuilding,
  FaCoins,
  FaArrowRight,
  FaSpinner,
  FaCheckCircle
} from 'react-icons/fa';
import { UserRole } from '../types/points';

interface RoleSelectorProps {
  onRoleSelect?: (role: UserRole) => void;
  autoRedirect?: boolean;
  className?: string;
}

interface UserTypeOption {
  id: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  pointsExample: string;
  color: string;
  bgGradient: string;
}

const userTypes: UserTypeOption[] = [
  {
    id: 'candidate',
    title: 'Job Seeker',
    description: 'Looking for your next opportunity',
    icon: <FaUser className="h-8 w-8 text-blue-600" />,
    features: [
      'Access resume database',
      'Apply to premium jobs',
      'Profile visibility boost',
      'Company insights'
    ],
    pointsExample: '42 points',
    color: 'blue',
    bgGradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'hr',
    title: 'HR Professional',
    description: 'Recruiting top talent',
    icon: <FaUsers className="h-8 w-8 text-green-600" />,
    features: [
      'Candidate search & access',
      'Advanced filtering',
      'Priority messaging',
      'Hiring analytics'
    ],
    pointsExample: '85 points',
    color: 'green',
    bgGradient: 'from-green-500 to-green-600'
  },
  {
    id: 'company',
    title: 'Enterprise',
    description: 'Comprehensive hiring solutions',
    icon: <FaBuilding className="h-8 w-8 text-purple-600" />,
    features: [
      'Bulk candidate access',
      'Market intelligence',
      'Custom analytics',
      'Dedicated support'
    ],
    pointsExample: '120 points',
    color: 'purple',
    bgGradient: 'from-purple-500 to-purple-600'
  }
];

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  onRoleSelect,
  autoRedirect = true,
  className = ""
}) => {
  const router = useRouter();
  const [selectedUserType, setSelectedUserType] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUserTypeSelect = async (userType: UserRole) => {
    setSelectedUserType(userType);
    setLoading(true);

    // Simulate API call or processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Save user role to localStorage
    localStorage.setItem('userRole', userType);

    // Set default points based on role
    const defaultPoints = {
      candidate: 42,
      hr: 85,
      company: 120
    };
    localStorage.setItem('userPoints', defaultPoints[userType].toString());

    if (onRoleSelect) {
      onRoleSelect(userType);
    }

    if (autoRedirect) {
      router.push(`/user/wallet/${userType}`);
    }

    setLoading(false);
  };

  return (
    <div className={`max-w-6xl mx-auto ${className}`}>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
            <FaCoins className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Your Role</h1>
        <p className="text-gray-600">Choose your role to access your personalized wallet</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {userTypes.map((type) => (
          <div
            key={type.id}
            className={`relative bg-white rounded-xl shadow-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-xl transform hover:-translate-y-1 ${selectedUserType === type.id
                ? `border-${type.color}-500 ring-4 ring-${type.color}-200`
                : 'border-gray-200 hover:border-gray-300'
              }`}
            onClick={() => !loading && handleUserTypeSelect(type.id)}
          >
            {/* Loading overlay */}
            {loading && selectedUserType === type.id && (
              <div className="absolute inset-0 bg-white bg-opacity-90 rounded-xl flex items-center justify-center z-10">
                <div className="text-center">
                  <FaSpinner className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Setting up your wallet...</p>
                </div>
              </div>
            )}

            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {type.icon}
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{type.title}</h3>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                </div>
                {selectedUserType === type.id && (
                  <FaCheckCircle className={`h-6 w-6 text-${type.color}-600`} />
                )}
              </div>

              {/* Features */}
              <div className="mb-4">
                <ul className="space-y-2">
                  {type.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <FaCheckCircle className={`h-4 w-4 text-${type.color}-500 mr-2 flex-shrink-0`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Points example */}
              <div className={`bg-gradient-to-r ${type.bgGradient} rounded-lg p-3 text-center`}>
                <p className="text-white text-sm font-medium">Starting Balance</p>
                <p className="text-white text-lg font-bold">{type.pointsExample}</p>
              </div>

              {/* CTA */}
              <div className="mt-4">
                <button
                  className={`w-full bg-gradient-to-r ${type.bgGradient} text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  disabled={loading}
                >
                  {loading && selectedUserType === type.id ? (
                    <>
                      <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      Access Wallet
                      <FaArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Don't see your role? <a href="#" className="text-blue-600 hover:text-blue-800">Contact Support</a>
        </p>
      </div>
    </div>
  );
};
