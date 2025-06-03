'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '../../contexts/UserContext';
import {
  FaWallet,
  FaShoppingCart,
  FaHistory,
  FaChartLine,
  FaExchangeAlt,
  FaUser,
  FaUsers,
  FaBuilding
} from 'react-icons/fa';

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, icon, children, active }) => (
  <Link
    href={href}
    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${active
        ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600 pl-3'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      }`}
  >
    <span className="mr-3">{icon}</span>
    {children}
  </Link>
);

const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const roleColors = {
    candidate: 'bg-blue-100 text-blue-800',
    hr: 'bg-green-100 text-green-800',
    company: 'bg-purple-100 text-purple-800'
  };

  const roleLabel = {
    candidate: 'Candidate',
    hr: 'HR Professional',
    company: 'Enterprise'
  };

  const roleIcons = {
    candidate: <FaUser className="h-4 w-4 mr-1" />,
    hr: <FaUsers className="h-4 w-4 mr-1" />,
    company: <FaBuilding className="h-4 w-4 mr-1" />
  };

  return (
    <div className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${roleColors[role as keyof typeof roleColors] || 'bg-gray-100 text-gray-800'}`}>
      {roleIcons[role as keyof typeof roleIcons]}
      {roleLabel[role as keyof typeof roleLabel] || role}
    </div>
  );
};

interface WalletNavigationProps {
  className?: string;
}

const WalletNavigation: React.FC<WalletNavigationProps> = ({ className = "" }) => {
  const { userRole, userPoints } = useUser();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/user/wallet' && pathname === '/user/wallet') return true;
    if (path !== '/user/wallet' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm ${className}`}>
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center">
            <FaWallet className="mr-2 h-5 w-5" />
            Points Wallet
          </h3>
          {userRole && <RoleBadge role={userRole} />}
        </div>
        {userPoints > 0 && (
          <div className="mt-3 text-center">
            <p className="text-sm text-blue-100">Current Balance</p>
            <p className="text-2xl font-bold">{userPoints} points</p>
          </div>
        )}
      </div>

      <div className="p-2">
        <nav className="space-y-1">
          <NavLink
            href={userRole ? `/user/wallet/${userRole}` : "/user/wallet"}
            icon={<FaChartLine className="h-5 w-5" />}
            active={isActive(userRole ? `/user/wallet/${userRole}` : "/user/wallet")}
          >
            Dashboard
          </NavLink>

          <NavLink
            href="/user/wallet/purchase"
            icon={<FaShoppingCart className="h-5 w-5" />}
            active={isActive("/user/wallet/purchase")}
          >
            Purchase Points
          </NavLink>

          <NavLink
            href="/user/wallet/history"
            icon={<FaHistory className="h-5 w-5" />}
            active={isActive("/user/wallet/history")}
          >
            Transaction History
          </NavLink>

          {userRole && (
            <div className="pt-4 mt-4 border-t border-gray-200">
              <div className="px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Switch Role
              </div>

              <NavLink
                href="/user/wallet/candidate"
                icon={<FaUser className="h-5 w-5" />}
                active={userRole === 'candidate'}
              >
                Candidate Wallet
              </NavLink>

              <NavLink
                href="/user/wallet/hr"
                icon={<FaUsers className="h-5 w-5" />}
                active={userRole === 'hr'}
              >
                HR Wallet
              </NavLink>

              <NavLink
                href="/user/wallet/company"
                icon={<FaBuilding className="h-5 w-5" />}
                active={userRole === 'company'}
              >
                Enterprise Wallet
              </NavLink>

              <div className="px-4 pt-4 pb-2">
                <Link
                  href="/user/wallet"
                  className="flex items-center text-xs text-gray-600 hover:text-blue-600 font-medium"
                >
                  <FaExchangeAlt className="h-3 w-3 mr-1" />
                  Reset Role Selection
                </Link>
              </div>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default WalletNavigation;
