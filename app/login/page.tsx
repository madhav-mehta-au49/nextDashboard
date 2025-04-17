"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiEye, FiEyeOff, FiGithub, FiLinkedin } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
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

            {/* Remember Me + Forgot Password */}
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>Remember me</span>
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

          {/* Sign Up Link */}
          <p className="mt-4 text-center text-gray-700">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-teal-600 font-bold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
