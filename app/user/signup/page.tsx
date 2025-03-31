"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiEye, FiEyeOff, FiGithub, FiLinkedin } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push("/auth/verify-email");
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Left Side - Branding Section */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-teal-500 to-blue-500 text-white p-10">
          <h2 className="text-3xl font-bold">Join Our Professional Network</h2>
          <p className="mt-4 text-lg">
            Connect with professionals, find opportunities, and grow your
            career.
          </p>
        </div>

        {/* Right Side - Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-teal-600 mb-6">
            Create your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-medium">First Name</label>
                <input
                  type="text"
                  placeholder="John"
                  className="w-full mt-1 p-2 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block font-medium">Last Name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="w-full mt-1 p-2 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                placeholder="john.doe@example.com"
                className="w-full mt-1 p-2 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
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

            {/* Terms & Conditions */}
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" required />
              <span className="text-sm">
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-teal-500 text-white p-3 rounded-lg font-bold hover:bg-teal-600 transition"
              disabled={isLoading}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center my-4">
            <hr className="flex-1 border-gray-300" />
            <span className="mx-4 text-gray-500">or continue with</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* Social Login Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 flex items-center justify-center border p-3 rounded-lg hover:bg-gray-50 transition">
              <FcGoogle className="mr-2" />
              Google
            </button>
            <button className="flex-1 flex items-center justify-center border p-3 rounded-lg hover:bg-gray-50 transition">
              <FiLinkedin className="mr-2 text-blue-700" />
              LinkedIn
            </button>
          </div>

          {/* Login Link */}
          <p className="mt-4 text-center text-gray-700">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-teal-600 font-bold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
