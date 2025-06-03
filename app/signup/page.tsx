"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiEye, FiEyeOff, FiUser, FiUsers, FiArrowLeft, FiCheck } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaBriefcase, FaLinkedin } from "react-icons/fa";

type UserRole = 'candidate' | 'employer';

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  acceptTerms: boolean;
}

interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

const roleOptions: RoleOption[] = [
  {
    id: 'candidate',
    title: 'Job Seeker',
    description: 'Looking for your next career opportunity',
    icon: <FiUser className="w-8 h-8" />,
    features: [
      'Create professional profile',
      'Apply to job openings',
      'Track application status',
      'Connect with employers'
    ]
  },
  {
    id: 'employer',
    title: 'Employer / Company',
    description: 'Hiring top talent for your organization',
    icon: <FaBriefcase className="w-8 h-8" />,
    features: [
      'Post job openings',
      'Manage applications',
      'Company dashboard',
      'Access talent pool'
    ]
  }
];

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Role Selection, 2: Form Fill
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate',
    acceptTerms: false
  });
  const [errors, setErrors] = useState<Partial<SignupFormData>>({});
  const router = useRouter();
  const validateForm = (): boolean => {
    const newErrors: Partial<SignupFormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {      // Call the API to register user with role
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include', // Important for CORS and sessions
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
          role: formData.role,
        }),
      });

      if (response.ok) {
        // Redirect based on role
        if (formData.role === 'employer') {
          router.push('/companies/create');
        } else {
          router.push('/user/candidate/create');
        }      } else {
        const errorData = await response.json() as { message?: string };
        setErrors({ email: errorData.message || 'Registration failed' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ email: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };  const handleSocialAuth = (provider: 'google' | 'linkedin') => {
    // Redirect to backend OAuth route with role parameter
    window.location.href = `http://localhost:8000/auth/${provider}?role=${formData.role}`;
  };

  // Role Selection Step
  if (step === 1) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Platform</h2>
            <p className="text-lg text-gray-600">Choose your account type to get started</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Candidate Option */}
            <div 
              className={`p-8 rounded-xl border-2 cursor-pointer transition-all ${
                formData.role === 'candidate' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setFormData({ ...formData, role: 'candidate' })}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUser className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Job Seeker</h3>
                <p className="text-gray-600 mb-4">Find your dream job and build your career</p>
                <ul className="text-sm text-gray-500 text-left space-y-1">
                  <li>• Apply to thousands of jobs</li>
                  <li>• Build professional profile</li>
                  <li>• Get discovered by employers</li>
                  <li>• Access career resources</li>
                </ul>
              </div>
            </div>

            {/* Employer Option */}
            <div 
              className={`p-8 rounded-xl border-2 cursor-pointer transition-all ${
                formData.role === 'employer' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-green-300'
              }`}
              onClick={() => setFormData({ ...formData, role: 'employer' })}
            >              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBriefcase className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Employer</h3>
                <p className="text-gray-600 mb-4">Find and hire the best talent for your company</p>
                <ul className="text-sm text-gray-500 text-left space-y-1">
                  <li>• Post unlimited jobs</li>
                  <li>• Access candidate database</li>
                  <li>• Company dashboard & analytics</li>
                  <li>• Applicant tracking system</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => setStep(2)}
              className="bg-teal-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-600 transition"
            >
              Continue as {formData.role === 'candidate' ? 'Job Seeker' : 'Employer'}
            </button>
          </div>

          <p className="mt-6 text-center text-gray-700">
            Already have an account?{" "}
            <Link href="/login" className="text-teal-600 font-bold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Left Side - Branding Section */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-teal-500 to-blue-500 text-white p-10">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">            {formData.role === 'candidate' ? (
              <FiUser className="w-8 h-8" />
            ) : (
              <FaBriefcase className="w-8 h-8" />
            )}
          </div>
          <h2 className="text-3xl font-bold">
            {formData.role === 'candidate' ? 'Start Your Career Journey' : 'Build Your Team'}
          </h2>
          <p className="mt-4 text-lg text-center">
            {formData.role === 'candidate' 
              ? 'Connect with opportunities that match your skills and aspirations'
              : 'Find and hire the best talent to grow your business'
            }
          </p>
          <button
            onClick={() => setStep(1)}
            className="mt-6 px-4 py-2 border border-white/30 text-white rounded-lg hover:bg-white/10 transition"
          >
            ← Change Account Type
          </button>
        </div>

        {/* Right Side - Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-teal-600 mb-2">
            Create your {formData.role === 'candidate' ? 'job seeker' : 'employer'} account
          </h2>
          <p className="text-gray-600 mb-6">
            Join thousands of {formData.role === 'candidate' ? 'professionals finding their dream jobs' : 'companies building great teams'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={`w-full mt-1 p-3 border rounded-lg focus:ring-teal-500 focus:border-teal-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>
              <div className="flex-1">
                <label className="block font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className={`w-full mt-1 p-3 border rounded-lg focus:ring-teal-500 focus:border-teal-500 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full mt-1 p-3 border rounded-lg focus:ring-teal-500 focus:border-teal-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full mt-1 p-3 border rounded-lg focus:ring-teal-500 focus:border-teal-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`w-full mt-1 p-3 border rounded-lg focus:ring-teal-500 focus:border-teal-500 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <input 
                type="checkbox" 
                className="mr-3 mt-1" 
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                required 
              />
              <span className="text-sm text-gray-700">
                I agree to the{" "}
                <Link href="/terms" className="text-teal-600 underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-teal-600 underline">
                  Privacy Policy
                </Link>
              </span>
            </div>
            {errors.acceptTerms && <p className="text-red-500 text-sm">{errors.acceptTerms}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-teal-500 text-white p-3 rounded-lg font-bold hover:bg-teal-600 transition disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : `Create ${formData.role === 'candidate' ? 'Job Seeker' : 'Employer'} Account`}
            </button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-1 border-gray-300" />
            <span className="mx-4 text-gray-500">or continue with</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* Social Login Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={() => handleSocialAuth('google')}
              className="flex-1 flex items-center justify-center border p-3 rounded-lg hover:bg-gray-50 transition"
            >
              <FcGoogle className="mr-2" />
              Google
            </button>            <button 
              onClick={() => handleSocialAuth('linkedin')}
              className="flex-1 flex items-center justify-center border p-3 rounded-lg hover:bg-gray-50 transition"
            >
              <FaLinkedin className="mr-2 text-blue-700" />
              LinkedIn
            </button>
          </div>

          {/* Login Link */}
          <p className="mt-6 text-center text-gray-700">
            Already have an account?{" "}
            <Link href="/login" className="text-teal-600 font-bold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
