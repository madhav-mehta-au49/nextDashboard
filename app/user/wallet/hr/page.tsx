'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaCoins, 
  FaArrowUp, 
  FaArrowDown, 
  FaShoppingCart, 
  FaChartLine,
  FaStar,
  FaUsers,
  FaBuilding,
  FaSearch,
  FaChartBar,
  FaRegChartBar,
  FaExchangeAlt
} from 'react-icons/fa';
import { getMockWalletData } from '@/services/wallet/pointsMockData';
import { PointsWallet, PointsTransaction, PointsStats, PointsPackage } from '@/app/user/types/points';
import { useUser } from '../../contexts/UserContext';
import WalletNavigation from '../components/WalletNavigation';
import PointsUsageChart from '../components/PointsUsageChart';
import SpendingPatternChart from '../components/SpendingPatternChart';

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
    className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
      activeTab === value 
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

const HRWalletPage = () => {
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
      const data = getMockWalletData('hr');
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading HR wallet...</p>
        </div>
      </div>
    );
  }

  if (!walletData) return null;

  const { wallet, transactions, stats, packages } = walletData;
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">HR Wallet</h1>
          <p className="text-gray-600">Manage your points for candidate screening and hiring insights</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <WalletNavigation />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Points Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Current Points</p>
                      <p className="text-3xl font-bold">{wallet.current_points}</p>
                    </div>
                    <FaCoins className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Earned</p>
                      <p className="text-2xl font-bold text-green-600">{wallet.total_earned}</p>
                    </div>
                    <FaArrowUp className="h-6 w-6 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Spent</p>
                      <p className="text-2xl font-bold text-red-600">{wallet.total_spent}</p>
                    </div>
                    <FaArrowDown className="h-6 w-6 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">This Month</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {stats.current_month.net_change >= 0 ? '+' : ''}{stats.current_month.net_change}
                      </p>
                    </div>
                    <FaChartLine className="h-6 w-6 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="packages" className="space-y-6">              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="packages">HR Packages</TabsTrigger>
                <TabsTrigger value="transactions">Transaction History</TabsTrigger>
                <TabsTrigger value="guide">HR Points Guide</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              {/* HR Packages Tab */}
              <TabsContent value="packages" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FaShoppingCart className="h-5 w-5" />
                      HR Points Packages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {packages.map((pkg) => (
                        <Card key={pkg.id} className={`relative ${pkg.is_popular ? 'ring-2 ring-purple-500' : ''}`}>
                          {pkg.is_popular && (
                            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-500">
                              Recommended
                            </Badge>
                          )}
                          <CardContent className="p-6">
                            <div className="text-center mb-4">
                              <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <FaCoins className="h-5 w-5 text-purple-500" />
                                <span className="text-2xl font-bold">{pkg.points} Points</span>
                              </div>
                              <div className="flex items-center justify-center gap-2">
                                <span className="text-lg font-semibold text-green-600">${pkg.price_usd}</span>
                                <span className="text-sm text-gray-500">₹{pkg.price_inr}</span>
                              </div>
                              {pkg.discount_percentage && (
                                <Badge variant="secondary" className="mt-2">
                                  {pkg.discount_percentage}% OFF
                                </Badge>
                              )}
                            </div>
                            
                            <ul className="space-y-2 mb-6">
                              {pkg.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                  <FaStar className="h-3 w-3 text-yellow-500" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                            
                            <Button className="w-full" variant={pkg.is_popular ? "default" : "outline"}>
                              Purchase Package
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Transaction History Tab */}
              <TabsContent value="transactions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent HR Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              transaction.type === 'earned' || transaction.type === 'purchased' 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-red-100 text-red-600'
                            }`}>
                              {transaction.category === 'resume_access' && <FaUsers className="h-4 w-4" />}
                              {transaction.category === 'purchase' && <FaShoppingCart className="h-4 w-4" />}
                              {transaction.category === 'company_access' && <FaChartBar className="h-4 w-4" />}
                              {!['resume_access', 'purchase', 'company_access'].includes(transaction.category) && (
                                transaction.type === 'earned' || transaction.type === 'purchased' ? (
                                  <FaArrowUp className="h-4 w-4" />
                                ) : (
                                  <FaArrowDown className="h-4 w-4" />
                                )
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(transaction.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${
                              transaction.type === 'earned' || transaction.type === 'purchased'
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {transaction.type === 'earned' || transaction.type === 'purchased' ? '+' : '-'}
                              {transaction.points} points
                            </p>
                            <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* HR Points Guide Tab */}
              <TabsContent value="guide" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FaUsers className="h-5 w-5" />
                        Candidate Resume Access
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Fresher Resumes</span>
                          <Badge variant="secondary">FREE</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Junior Level (1-2 years)</span>
                          <Badge>4 points each</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Mid-level (3-5 years)</span>
                          <Badge>10 points each</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Senior Level (6-10 years)</span>
                          <Badge>18 points each</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Expert Level (10+ years)</span>
                          <Badge>30 points each</Badge>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                          💡 Bulk access discounts: 10% off for 5+ resumes, 20% off for 10+ resumes
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FaChartBar className="h-5 w-5" />
                        Company & Market Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Basic Company Info</span>
                          <Badge variant="secondary">FREE</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Detailed Company Profile</span>
                          <Badge>4 points</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Employee Reviews & Culture</span>
                          <Badge>9 points</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Salary Insights & Benchmarks</span>
                          <Badge>15 points</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>HR Premium Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Hiring Tools</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span>Priority Candidate Matching</span>
                            <Badge>16 points</Badge>
                          </li>
                          <li className="flex justify-between">
                            <span>Advanced Search Filters</span>
                            <Badge>8 points</Badge>
                          </li>
                          <li className="flex justify-between">
                            <span>Candidate Analytics Dashboard</span>
                            <Badge>12 points</Badge>
                          </li>
                          <li className="flex justify-between">
                            <span>Direct Messaging</span>
                            <Badge>12 points</Badge>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Value Multipliers</h4>
                        <ul className="space-y-2 text-sm">
                          <li>High-demand skills: +30% cost</li>
                          <li>Portfolio holders: +10% cost</li>
                          <li>Certified professionals: +15% cost</li>
                          <li>AI-optimized profiles: +20% cost</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Getting Started Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <FaSearch className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                        <h4 className="font-semibold mb-1">Start Free</h4>
                        <p className="text-sm text-gray-600">Browse fresher profiles and basic company info for free</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <FaUsers className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <h4 className="font-semibold mb-1">Target Smart</h4>
                        <p className="text-sm text-gray-600">Focus on candidates matching your exact requirements</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <FaChartBar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <h4 className="font-semibold mb-1">Use Analytics</h4>
                        <p className="text-sm text-gray-600">Leverage insights to make better hiring decisions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Points Usage Chart */}
                  <PointsUsageChart stats={stats} userRole="hr" />
                  
                  {/* Spending Patterns Chart */}
                  <SpendingPatternChart transactions={transactions} />
                </div>
                
                {/* More detailed analytics */}
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FaRegChartBar className="h-5 w-5" />
                      HR Wallet Activity Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Most viewed candidate levels */}
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-700 mb-3">Candidate Access</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Junior Level</span>
                            <span className="text-sm font-medium">{Math.round(stats.spending_breakdown.resume_access * 0.3)}</span>
                          </div>
                          <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '30%' }}></div>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm">Mid Level</span>
                            <span className="text-sm font-medium">{Math.round(stats.spending_breakdown.resume_access * 0.45)}</span>
                          </div>
                          <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }}></div>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm">Senior Level</span>
                            <span className="text-sm font-medium">{Math.round(stats.spending_breakdown.resume_access * 0.25)}</span>
                          </div>
                          <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '25%' }}></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* ROI indicators */}
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-700 mb-3">ROI Metrics</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Avg. Points per Hire</span>
                              <span className="text-sm font-medium">42</span>
                            </div>
                            <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Points Efficiency</span>
                              <span className="text-sm font-medium">82%</span>
                            </div>
                            <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 rounded-full" style={{ width: '82%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Activity by time */}
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-purple-700 mb-3">Activity Times</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Morning</span>
                            <span className="text-sm font-medium">35%</span>
                          </div>
                          <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: '35%' }}></div>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm">Afternoon</span>
                            <span className="text-sm font-medium">45%</span>
                          </div>
                          <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: '45%' }}></div>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm">Evening</span>
                            <span className="text-sm font-medium">20%</span>
                          </div>
                          <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: '20%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-start">
                        <FaExchangeAlt className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-700">Points Efficiency Tips</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Looking at your usage patterns, consider purchasing the <strong>HR Professional</strong> package for better value, 
                            and focus spending on mid-level candidates which have shown the best hiring conversion rate for your company.
                          </p>
                        </div>
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

export default HRWalletPage;
