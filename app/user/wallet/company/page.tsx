'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaArrowLeft, 
  FaCoins, 
  FaChartLine, 
  FaUsers, 
  FaBuilding,
  FaCrown,
  FaShoppingCart,
  FaHistory,
  FaDownload,
  FaSearch,
  FaGlobe,
  FaUserTie,
  FaChartBar,
  FaRegChartBar,
  FaExchangeAlt
} from 'react-icons/fa';
import { PointsCalculator } from '@/services/wallet/pointsCalculator';
import { 
  mockCompanyWallet, 
  mockCompanyTransactions, 
  mockCompanyStats, 
  mockPointsPackages,
  getMockWalletData
} from '@/services/wallet/pointsMockData';
import { useUser } from '../../contexts/UserContext';
import WalletNavigation from '../components/WalletNavigation';
import PointsUsageChart from '../components/PointsUsageChart';
import SpendingPatternChart from '../components/SpendingPatternChart';

// Simple Card components using Tailwind CSS
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

const Button = ({ children, className = "", variant = "default", onClick, disabled }: { 
  children: React.ReactNode; 
  className?: string; 
  variant?: string;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center";
  const variantClasses = variant === "outline" 
    ? "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50" 
    : variant === "secondary"
    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
    : "text-white bg-blue-600 hover:bg-blue-700";
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`} 
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, variant = "default", className = "" }: { 
  children: React.ReactNode; 
  variant?: string;
  className?: string;
}) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const variantClasses = variant === "secondary" 
    ? "bg-gray-100 text-gray-800" 
    : variant === "success"
    ? "bg-green-100 text-green-800"
    : variant === "warning"
    ? "bg-yellow-100 text-yellow-800"
    : "bg-blue-100 text-blue-800";
  
  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </span>
  );
};

const CompanyWalletPage = () => {
  const router = useRouter();
  const { userPoints, setUserPoints, userRole } = useUser();
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [walletData, setWalletData] = useState<{
    wallet: any;
    transactions: any[];
    stats: any;
    packages: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const data = getMockWalletData('company');
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading enterprise wallet...</p>
        </div>
      </div>
    );
  }

  if (!walletData) return null;

  const { wallet: companyWallet, transactions, stats, packages } = walletData;

  const enterpriseActions = [
    {
      id: 'bulk_resume_access',
      title: 'Bulk Resume Access',
      description: 'Access 50+ candidate resumes with AI matching',
      basePoints: 50,
      icon: FaUsers,
      color: 'blue',
      features: ['AI-powered matching', 'Download in batches', 'Priority support']
    },
    {
      id: 'market_intelligence',
      title: 'Market Intelligence',
      description: 'Comprehensive talent market insights and trends',
      basePoints: 40,
      icon: FaChartLine,
      color: 'purple',
      features: ['Salary benchmarking', 'Skill demand trends', 'Competitor analysis']
    },
    {
      id: 'custom_analytics',
      title: 'Custom Analytics Dashboard',
      description: 'Advanced hiring analytics and ROI tracking',
      basePoints: 35,
      icon: FaChartBar,
      color: 'green',
      features: ['Custom reports', 'ROI tracking', 'Performance metrics']
    },
    {
      id: 'global_talent_search',
      title: 'Global Talent Search',
      description: 'Search candidates across multiple regions',
      basePoints: 30,
      icon: FaGlobe,
      color: 'orange',
      features: ['Multi-region search', 'Visa status filtering', 'Remote talent pool']
    }
  ];

  const handleAction = (action: any) => {
    if (companyWallet.current_points < action.basePoints) {
      alert('Insufficient points! Please purchase more points.');
      return;
    }
    
    alert(`${action.title} activated! ${action.basePoints} points deducted.`);
  };

  const handlePurchasePackage = (pkg: any) => {
    setSelectedPackage(pkg);
    setShowPurchaseModal(true);
  };

  const completePurchase = () => {
    if (selectedPackage) {
      alert(`Successfully purchased ${selectedPackage.name}! Points added to your wallet.`);
      setShowPurchaseModal(false);
      setSelectedPackage(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Enterprise Wallet</h1>
          <p className="text-gray-600">Comprehensive talent acquisition & workforce analytics</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <WalletNavigation />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="mb-8">
              <Button 
                variant="outline" 
                onClick={() => router.back()}
                className="mb-4"
              >
                <FaArrowLeft className="mr-2 h-4 w-4" />
                Back to Wallet Selection
              </Button>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-lg mr-4">
                    <FaBuilding className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Enterprise Wallet</h1>
                    <p className="text-gray-600">Comprehensive talent acquisition & workforce analytics</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Current Balance</p>
                  <p className="text-3xl font-bold text-green-600 flex items-center">
                    <FaCoins className="mr-2 h-6 w-6" />
                    {companyWallet.current_points}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6 text-center">
                  <FaUsers className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{stats.all_time.transactions_count}</p>
                  <p className="text-sm text-gray-600">Candidates Accessed</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6 text-center">
                  <FaDownload className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{stats.spending_breakdown.resume_access}</p>
                  <p className="text-sm text-gray-600">Resumes Downloaded</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6 text-center">
                  <FaChartLine className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">{stats.current_month.spent}</p>
                  <p className="text-sm text-gray-600">Points This Month</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-6 text-center">
                  <FaCrown className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-600">Premium</p>
                  <p className="text-sm text-gray-600">Enterprise Plan</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Enterprise Actions */}
              <div className="lg:col-span-2">
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FaUserTie className="mr-2 h-5 w-5 text-green-600" />
                      Enterprise Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {enterpriseActions.map((action) => {
                        const IconComponent = action.icon;
                        const canAfford = companyWallet.current_points >= action.basePoints;
                        
                        return (
                          <Card 
                            key={action.id}
                            className={`border-2 transition-all duration-200 hover:shadow-lg ${
                              canAfford ? 'hover:border-green-300 cursor-pointer' : 'opacity-50'
                            } ${
                              action.color === 'blue' ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-white' :
                              action.color === 'purple' ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-white' :
                              action.color === 'green' ? 'border-green-200 bg-gradient-to-br from-green-50 to-white' :
                              'border-orange-200 bg-gradient-to-br from-orange-50 to-white'
                            }`}
                            onClick={() => canAfford && handleAction(action)}
                          >
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-lg ${
                                  action.color === 'blue' ? 'bg-blue-500' :
                                  action.color === 'purple' ? 'bg-purple-500' :
                                  action.color === 'green' ? 'bg-green-500' : 'bg-orange-500'
                                }`}>
                                  <IconComponent className="h-6 w-6 text-white" />
                                </div>
                                <Badge className={`${
                                  action.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                                  action.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                                  action.color === 'green' ? 'bg-green-100 text-green-800' :
                                  'bg-orange-100 text-orange-800'
                                }`}>
                                  {action.basePoints} points
                                </Badge>
                              </div>
                              
                              <h4 className="font-bold text-gray-900 mb-2">{action.title}</h4>
                              <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                              
                              <div className="space-y-2">
                                {action.features.map((feature, index) => (
                                  <div key={index} className="flex items-center text-xs text-gray-600">
                                    <FaCoins className={`h-3 w-3 mr-2 ${
                                      action.color === 'blue' ? 'text-blue-500' :
                                      action.color === 'purple' ? 'text-purple-500' :
                                      action.color === 'green' ? 'text-green-500' : 'text-orange-500'
                                    }`} />
                                    {feature}
                                  </div>
                                ))}
                              </div>
                              
                              <Button 
                                className={`w-full mt-4 ${
                                  action.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                                  action.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700' :
                                  action.color === 'green' ? 'bg-green-600 hover:bg-green-700' :
                                  'bg-orange-600 hover:bg-orange-700'
                                }`}
                                disabled={!canAfford}
                                onClick={() => canAfford && handleAction(action)}
                              >
                                {canAfford ? `Use ${action.basePoints} Points` : 'Insufficient Points'}
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FaHistory className="mr-2 h-5 w-5 text-gray-600" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {transactions.slice(0, 5).map((transaction: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-full mr-3 ${
                              transaction.type === 'purchase' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              {transaction.type === 'purchase' ? (
                                <FaShoppingCart className="h-4 w-4 text-green-600" />
                              ) : (
                                <FaCoins className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{transaction.description}</p>
                              <p className="text-sm text-gray-500">{transaction.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${
                              transaction.type === 'purchase' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'purchase' ? '+' : '-'}{transaction.points}
                            </p>
                            <p className="text-sm text-gray-500">points</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Point Packages */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FaShoppingCart className="mr-2 h-5 w-5 text-green-600" />
                      Enterprise Packages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {packages.map((pkg) => (
                        <Card 
                          key={pkg.id}
                          className="border-2 border-green-200 hover:border-green-400 transition-all duration-200 cursor-pointer hover:shadow-lg bg-gradient-to-br from-green-50 to-white"
                          onClick={() => handlePurchasePackage(pkg)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-bold text-gray-900">{pkg.name}</h4>
                                <p className="text-sm text-gray-600">{pkg.features.join(' • ')}</p>
                              </div>
                              {pkg.is_popular && (
                                <Badge variant="warning" className="bg-yellow-100 text-yellow-800">
                                  Popular
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-2xl font-bold text-green-600">{pkg.points}</span>
                              <span className="text-lg font-semibold text-gray-900">${pkg.price_usd}</span>
                            </div>
                            
                            <div className="text-xs text-gray-600 mb-3">
                              <p>• Bulk hiring capabilities</p>
                              <p>• Priority support included</p>
                              <p>• Advanced analytics access</p>
                            </div>
                            
                            <Button 
                              className="w-full bg-green-600 hover:bg-green-700"
                              onClick={() => handlePurchasePackage(pkg)}
                            >
                              Purchase Package
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Purchase Modal */}
            {showPurchaseModal && selectedPackage && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Purchase</h3>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="font-semibold text-gray-900">{selectedPackage.name}</p>
                      <p className="text-sm text-gray-600 mb-2">{selectedPackage.features.join(' • ')}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-green-600">{selectedPackage.points} points</span>
                        <span className="text-lg font-bold text-gray-900">${selectedPackage.price_usd}</span>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setShowPurchaseModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={completePurchase}
                      >
                        Confirm Purchase
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics section */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FaRegChartBar className="mr-2 h-5 w-5 text-green-600" />
                    Enterprise Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Points Usage Chart */}
                    <PointsUsageChart stats={stats} userRole="company" />
                    
                    {/* Spending Patterns Chart */}
                    <SpendingPatternChart transactions={transactions} />
                  </div>
                  
                  {/* Additional enterprise metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    {/* Talent acquisition metrics */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-700 mb-3">Talent Acquisition</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Candidate Matches</span>
                          <span className="text-sm font-medium">{Math.round(stats.spending_breakdown.resume_access * 1.2)}</span>
                        </div>
                        <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm">Saved Profiles</span>
                          <span className="text-sm font-medium">{Math.round(stats.spending_breakdown.resume_access * 0.4)}</span>
                        </div>
                        <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '40%' }}></div>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm">Contact Requests</span>
                          <span className="text-sm font-medium">{Math.round(stats.spending_breakdown.resume_access * 0.25)}</span>
                        </div>
                        <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Market intelligence metrics */}
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-700 mb-3">Market Intelligence</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Salary Reports</span>
                          <span className="text-sm font-medium">{Math.round(stats.spending_breakdown.other * 0.3)}</span>
                        </div>
                        <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm">Competitor Analysis</span>
                          <span className="text-sm font-medium">{Math.round(stats.spending_breakdown.other * 0.45)}</span>
                        </div>
                        <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm">Trend Reports</span>
                          <span className="text-sm font-medium">{Math.round(stats.spending_breakdown.other * 0.25)}</span>
                        </div>
                        <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* ROI metrics */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-700 mb-3">ROI Metrics</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Cost per Hire</span>
                            <span className="text-sm font-medium">75 points</span>
                          </div>
                          <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Screening Efficiency</span>
                            <span className="text-sm font-medium">68%</span>
                          </div>
                          <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: '68%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Time Saved</span>
                            <span className="text-sm font-medium">85%</span>
                          </div>
                          <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-start">
                      <FaExchangeAlt className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-700">Enterprise Strategy Insights</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Based on your usage, your enterprise could benefit from the <strong>Enterprise Plan</strong> with a 20% discount. 
                          Focus your points on market intelligence and global talent search for optimal hiring outcomes in the current quarter.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyWalletPage;
