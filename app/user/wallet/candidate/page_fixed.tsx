'use client';

import React, { useState, useEffect } from 'react';
import {
  FaCoins,
  FaArrowUp,
  FaArrowDown,
  FaShoppingCart,
  FaChartLine,
  FaStar,
  FaUser,
  FaBuilding,
  FaFileAlt
} from 'react-icons/fa';
import { getMockWalletData } from '@/services/wallet/pointsMockData';
import { PointsWallet, PointsTransaction, PointsStats, PointsPackage } from '@/app/user/types/points';
import { useUser } from '../../contexts/UserContext';
import WalletNavigation from '../components/WalletNavigation';
import CandidateAnalyticsChart from '../components/CandidateAnalyticsChart';
import PointsUsageChart from '../components/PointsUsageChart';
import SpendingPatternChart from '../components/SpendingPatternChart';
import PeriodComparisonChart from '../components/PeriodComparisonChart';

// Simple UI components using Tailwind CSS
const Card = ({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`} onClick={onClick}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

const Button = ({
  children,
  variant = "default",
  className = "",
  onClick,
  disabled = false
}: {
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center";
  const variants = {
    default: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
    outline: "border border-gray-300 hover:bg-gray-50 text-gray-700",
    ghost: "hover:bg-gray-100 text-gray-600"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Badge = ({
  children,
  variant = "default",
  className = ""
}: {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "success" | "warning" | "destructive";
  className?: string;
}) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    destructive: "bg-red-100 text-red-800"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Tabs = ({ children, defaultValue, className = "", onValueChange }: { children: React.ReactNode; defaultValue?: string; className?: string; onValueChange?: (value: string) => void }) => {
  const [activeTab, setActiveTab] = useState(defaultValue || '');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onValueChange?.(value);
  };

  return (
    <div className={`w-full ${className}`}>
      {React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, { activeTab, onTabChange: handleTabChange })
          : child
      )}
    </div>
  );
};

const TabsList = ({ children, className = "", activeTab, onTabChange }: { children: React.ReactNode; className?: string; activeTab?: string; onTabChange?: (value: string) => void }) => (
  <div className={`flex space-x-1 bg-gray-100 p-1 rounded-lg mb-4 ${className}`}>
    {React.Children.map(children, child =>
      React.isValidElement(child)
        ? React.cloneElement(child as React.ReactElement<any>, { activeTab, onTabChange })
        : child
    )}
  </div>
);

const TabsTrigger = ({ children, value, activeTab, onTabChange }: { children: React.ReactNode; value: string; activeTab?: string; onTabChange?: (value: string) => void }) => (
  <button
    className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === value
        ? 'bg-white text-blue-600 shadow-sm'
        : 'text-gray-600 hover:text-gray-900'
      }`}
    onClick={() => onTabChange?.(value)}
  >
    {children}
  </button>
);

const TabsContent = ({ children, value, className = "", activeTab }: { children: React.ReactNode; value: string; className?: string; activeTab?: string }) => (
  activeTab === value ? <div className={className}>{children}</div> : null
);

const CandidateWalletPage = () => {
  const { userPoints, setUserPoints, userRole } = useUser();
  const [walletData, setWalletData] = useState<{
    wallet: PointsWallet;
    transactions: PointsTransaction[];
    stats: PointsStats;
    packages: PointsPackage[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const data = getMockWalletData('candidate');
      setWalletData(data);
      setLoading(false);

      // Update user points in context
      if (data.wallet && data.wallet.current_points) {
        setUserPoints(data.wallet.current_points);
      }
    }, 1000);
  }, [setUserPoints]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your wallet...</p>
        </div>
      </div>
    );
  }

  if (!walletData) return null;

  const { wallet, transactions, stats, packages } = walletData;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Candidate Wallet</h1>
          <p className="text-gray-600">Manage your points for resume access and job applications</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <WalletNavigation />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Points Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Current Points</p>
                      <p className="text-2xl sm:text-3xl font-bold">{wallet.current_points}</p>
                    </div>
                    <FaCoins className="h-6 w-6 sm:h-8 sm:w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Earned</p>
                      <p className="text-xl sm:text-2xl font-bold text-green-600">{wallet.total_earned}</p>
                    </div>
                    <FaArrowUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Spent</p>
                      <p className="text-xl sm:text-2xl font-bold text-red-600">{wallet.total_spent}</p>
                    </div>
                    <FaArrowDown className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">This Month</p>
                      <p className="text-xl sm:text-2xl font-bold text-blue-600">
                        {stats.current_month.net_change >= 0 ? '+' : ''}{stats.current_month.net_change}
                      </p>
                    </div>
                    <FaChartLine className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="packages" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 text-xs sm:text-sm">
                <TabsTrigger value="packages">Purchase</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="transactions">History</TabsTrigger>
                <TabsTrigger value="pricing">Guide</TabsTrigger>
              </TabsList>

              {/* Purchase Packages Tab */}
              <TabsContent value="packages" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <FaShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                      Points Packages for Candidates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                      {packages.map((pkg) => (
                        <Card key={pkg.id} className={`relative ${pkg.is_popular ? 'ring-2 ring-blue-500' : ''}`}>
                          {pkg.is_popular && (
                            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
                              Most Popular
                            </Badge>
                          )}
                          <CardContent className="p-4 sm:p-6">
                            <div className="text-center mb-4">
                              <h3 className="text-lg sm:text-xl font-bold mb-2">{pkg.name}</h3>
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <FaCoins className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                                <span className="text-xl sm:text-2xl font-bold">{pkg.points} Points</span>
                              </div>
                              <div className="flex items-center justify-center gap-2">
                                <span className="text-base sm:text-lg font-semibold text-green-600">${pkg.price_usd}</span>
                                <span className="text-xs sm:text-sm text-gray-500">₹{pkg.price_inr}</span>
                              </div>
                              {pkg.discount_percentage && (
                                <Badge variant="secondary" className="mt-2">
                                  {pkg.discount_percentage}% OFF
                                </Badge>
                              )}
                            </div>

                            <ul className="space-y-2 mb-6">
                              {pkg.features.map((feature: string, index: number) => (
                                <li key={index} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                  <FaStar className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>

                            <Button className="w-full text-sm" variant={pkg.is_popular ? "default" : "outline"}>
                              Purchase Now
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <CandidateAnalyticsChart stats={stats} transactions={transactions} />

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2">
                    <PeriodComparisonChart stats={stats} userRole="candidate" />
                  </div>
                  <div>
                    <PointsUsageChart stats={stats} userRole="candidate" />
                  </div>
                </div>

                <SpendingPatternChart transactions={transactions} period="month" />
              </TabsContent>

              {/* Transaction History Tab */}
              <TabsContent value="transactions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${transaction.type === 'earned' || transaction.type === 'purchased'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-red-100 text-red-600'
                              }`}>
                              {transaction.type === 'earned' || transaction.type === 'purchased' ? (
                                <FaArrowUp className="h-3 w-3 sm:h-4 sm:w-4" />
                              ) : (
                                <FaArrowDown className="h-3 w-3 sm:h-4 sm:w-4" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm sm:text-base truncate">{transaction.description}</p>
                              <p className="text-xs sm:text-sm text-gray-500">
                                {new Date(transaction.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className={`font-semibold text-sm sm:text-base ${transaction.type === 'earned' || transaction.type === 'purchased'
                                ? 'text-green-600'
                                : 'text-red-600'
                              }`}>
                              {transaction.type === 'earned' || transaction.type === 'purchased' ? '+' : '-'}
                              {transaction.points} pts
                            </p>
                            <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Points Guide Tab */}
              <TabsContent value="pricing" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <FaUser className="h-4 w-4 sm:h-5 sm:w-5" />
                        Resume Access Pricing
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm sm:text-base">Fresher (0-1 years)</span>
                          <Badge variant="secondary">FREE</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm sm:text-base">Junior (1-2 years)</span>
                          <Badge>4 points</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm sm:text-base">Mid-level (3-5 years)</span>
                          <Badge>10 points</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm sm:text-base">Senior (6-10 years)</span>
                          <Badge>18 points</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm sm:text-base">Expert (10+ years)</span>
                          <Badge>30 points</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <FaBuilding className="h-4 w-4 sm:h-5 sm:w-5" />
                        Job Application Pricing
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm sm:text-base">Startup Companies</span>
                          <Badge>2 points</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm sm:text-base">Mid-size Companies</span>
                          <Badge>6 points</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm sm:text-base">Enterprise Companies</span>
                          <Badge>12 points</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm sm:text-base">Premium Applications</span>
                          <Badge>+30% extra</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Skill Multipliers & Bonuses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-sm sm:text-base">High-Demand Skills</h4>
                        <ul className="space-y-2 text-xs sm:text-sm">
                          <li>AI/ML: +30% cost</li>
                          <li>Data Science: +20% cost</li>
                          <li>Cloud Computing: +20% cost</li>
                          <li>React/Angular: +10% cost</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3 text-sm sm:text-base">Quality Bonuses</h4>
                        <ul className="space-y-2 text-xs sm:text-sm">
                          <li>Portfolio: +10% cost</li>
                          <li>Certifications: +15% cost</li>
                          <li>AI-optimized: +20% cost</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3 text-sm sm:text-base">Premium Features</h4>
                        <ul className="space-y-2 text-xs sm:text-sm">
                          <li>Profile Boost: 20 points</li>
                          <li>Priority Application: 16 points</li>
                          <li>Direct Message: 12 points</li>
                          <li>Analytics Access: 8 points</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateWalletPage;
