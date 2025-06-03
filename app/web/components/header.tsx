"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu, FiX, FiSearch, FiUser, FiLogIn,
  FiHome, FiBriefcase, FiUsers, FiInfo, FiBookOpen, FiUserPlus, FiEye
} from "react-icons/fi";
import { useUser } from "@/app/user/contexts/UserContext";
import { getCurrentUserCandidateProfile } from "@/app/services/candidate/candidateApi";
import { redirectToProfile } from "@/app/utils/auth";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); const [candidateProfile, setCandidateProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const { userRole, isAuthenticated } = useUser();
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Load candidate profile if user is logged in and is a candidate
  useEffect(() => {
    if (isAuthenticated && userRole === 'candidate') {
      setIsLoadingProfile(true); getCurrentUserCandidateProfile()
        .then((response: any) => {
          setCandidateProfile(response.candidate);
        })
        .catch((error: any) => {
          console.error('Error fetching candidate profile:', error);
          setCandidateProfile(null);
        })
        .finally(() => {
          setIsLoadingProfile(false);
        });
    }
  }, [isAuthenticated, userRole]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isSearchOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);  // Don't show profile buttons in main header for candidates
  const renderProfileButton = () => {
    return null; // Profile actions are handled in EmployeeHeader for authenticated users
  };  // Don't show mobile profile buttons in main header for candidates
  const renderMobileProfileButton = () => {
    return null; // Profile actions are handled in EmployeeHeader for authenticated users
  };

  return (
    <header className="relative z-50">
      {/* Gradient background with glass effect */}
      <div className="bg-gradient-to-r from-teal-500 via-teal-400 to-teal-500 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md transform group-hover:rotate-6 transition-transform duration-300">
                  <span className="text-teal-500 font-bold text-xl">JS</span>
                </div>
                <span className="text-white font-bold text-xl tracking-tight">JobSite</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {[
                { name: 'Home', href: '/', icon: FiHome },
                { name: 'Jobs', href: '/user/jobs', icon: FiBriefcase },
                { name: 'Companies', href: '/companies', icon: FiUsers },
                { name: 'About', href: '/about', icon: FiInfo },
                { name: 'Blog', href: '/blog', icon: FiBookOpen },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative px-4 py-2 text-white group"
                >
                  <span className="flex items-center space-x-1">
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              ))}
            </nav>

            {/* Right Section: Search & Auth */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <div
                className="p-2 rounded-full hover:bg-white/20 cursor-pointer transition-colors"
                onClick={toggleSearch}
              >
                <FiSearch className="h-5 w-5 text-white" />
              </div>              {/* Profile Button (conditional) */}
              {renderProfileButton()}              {/* Auth Buttons */}
              <div className="hidden md:flex items-center space-x-3">
                {!isAuthenticated ? (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center space-x-1 text-white hover:text-teal-100 transition-colors"
                    >
                      <FiLogIn className="h-4 w-4" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-white text-teal-600 hover:bg-teal-50 px-4 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <span>Sign Up</span>
                    </Link>
                  </>                ) : (
                  <>                    {/* Only show Dashboard for non-candidates */}
                    {userRole !== 'candidate' && (
                      <Link
                        href="/companies/dashboard"
                        className="flex items-center space-x-1 text-white hover:text-teal-100 transition-colors"
                      >
                        <FiUser className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    )}
                    <Link
                      href="/signout"
                      className="bg-white text-teal-600 hover:bg-teal-50 px-4 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <span>Sign Out</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden" ref={menuRef}>
                <div
                  className="p-2 rounded-full hover:bg-white/20 cursor-pointer transition-colors"
                  onClick={toggleMenu}
                >
                  {isMenuOpen ? (
                    <FiX className="h-6 w-6 text-white" />
                  ) : (
                    <FiMenu className="h-6 w-6 text-white" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Search Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-full bg-white shadow-lg z-20"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search for jobs, companies, or keywords..."
                  className="block w-full pl-10 pr-10 py-3 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-teal-500 rounded-lg text-gray-900"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <div
                    className="p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                    onClick={toggleSearch}
                  >
                    <FiX className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs text-gray-500">Popular:</span>
                {['Remote', 'Software Engineer', 'Marketing', 'Part-time', 'Design'].map(term => (
                  <span
                    key={term}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs cursor-pointer hover:bg-teal-100 hover:text-teal-700 transition-colors"
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg overflow-hidden z-20"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {[
                { name: 'Home', href: '/', icon: FiHome },
                { name: 'Jobs', href: '/jobs', icon: FiBriefcase },
                { name: 'Companies', href: '/companies', icon: FiUsers },
                { name: 'About', href: '/about', icon: FiInfo },
                { name: 'Blog', href: '/blog', icon: FiBookOpen },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-3 rounded-md text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
              {/* Profile Button for Mobile (conditional) */}
              {renderMobileProfileButton()}
            </div>            <div className="px-5 py-4 border-t border-gray-200 space-y-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/login"
                    className="flex items-center justify-center space-x-2 w-full bg-gray-100 text-gray-800 hover:bg-gray-200 px-4 py-3 rounded-lg font-medium transition-colors"
                  >
                    <FiLogIn className="h-5 w-5" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center justify-center w-full bg-teal-500 text-white hover:bg-teal-600 px-4 py-3 rounded-lg font-medium shadow-md transition-colors"
                  >
                    <FiUser className="h-5 w-5 mr-2" />
                    <span>Create Account</span>
                  </Link>
                </>              ) : (
                <>                  {/* Only show Dashboard for non-candidates */}
                  {userRole !== 'candidate' && (
                    <Link
                      href="/companies/dashboard"
                      className="flex items-center justify-center space-x-2 w-full bg-gray-100 text-gray-800 hover:bg-gray-200 px-4 py-3 rounded-lg font-medium transition-colors"
                    >
                      <FiUser className="h-5 w-5" />
                      <span>My Dashboard</span>
                    </Link>
                  )}
                  <Link
                    href="/signout"
                    className="flex items-center justify-center w-full bg-teal-500 text-white hover:bg-teal-600 px-4 py-3 rounded-lg font-medium shadow-md transition-colors"
                  >
                    <FiLogIn className="h-5 w-5 mr-2" />
                    <span>Sign Out</span>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
