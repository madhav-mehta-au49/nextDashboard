'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FaArrowLeft,
  FaCoins,
  FaCreditCard,
  FaShoppingCart,
  FaCheckCircle,
  FaStar,
  FaShieldAlt,
  FaTag,
  FaPercent
} from 'react-icons/fa';
import { useUser } from '../../contexts/UserContext';
import { mockPointsPackages } from '@/services/wallet/pointsMockData';
import { PointsPackage } from '../../types/points';
import WalletNavigation from '../components/WalletNavigation';

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

const PurchasePointsPage = () => {
  const router = useRouter();
  const { userRole, userPoints, setUserPoints } = useUser();
  const [packages, setPackages] = useState<PointsPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PointsPackage | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [recommendedPackages, setRecommendedPackages] = useState<PointsPackage[]>([]);

  useEffect(() => {
    // Filter packages based on user role
    const filteredPackages = mockPointsPackages.filter(pkg =>
      !pkg.target_roles || pkg.target_roles.includes(userRole as any)
    );
    setPackages(filteredPackages);

    // Set recommended packages based on user role
    const recommended = filteredPackages.filter(pkg => pkg.is_popular);
    if (recommended.length > 0) {
      setRecommendedPackages(recommended);
    } else {
      setRecommendedPackages(filteredPackages.slice(0, 1));
    }
  }, [userRole]);

  const handleSelectPackage = (pkg: PointsPackage) => {
    setSelectedPackage(pkg);
    setShowCheckout(true);
  };

  const handlePurchase = () => {
    if (!selectedPackage) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Calculate final points to add with any promo discount
      const finalPoints = selectedPackage.points;

      // Update user points
      setUserPoints(userPoints + finalPoints);
      setLoading(false);
      setPurchaseComplete(true);

      // Reset after a delay
      setTimeout(() => {
        setPurchaseComplete(false);
        setShowCheckout(false);
        setSelectedPackage(null);
        setPromoCode('');
        setPromoDiscount(0);
        setPromoApplied(false);
        setPromoError('');
      }, 3000);
    }, 1500);
  };

  const handleBack = () => {
    if (showCheckout) {
      setShowCheckout(false);
      setSelectedPackage(null);
    } else {
      router.back();
    }
  };

  const getPackageColor = (pkg: PointsPackage) => {
    const price = pkg.price_usd;
    if (price < 10) return "bg-blue-100 border-blue-200";
    if (price < 30) return "bg-purple-100 border-purple-200";
    return "bg-indigo-100 border-indigo-200";
  };

  const getPackageTextColor = (pkg: PointsPackage) => {
    const price = pkg.price_usd;
    if (price < 10) return "text-blue-700";
    if (price < 30) return "text-purple-700";
    return "text-indigo-700";
  };

  // Handle promo code application
  const handleApplyPromo = () => {
    // Reset previous promo states
    setPromoApplied(false);
    setPromoDiscount(0);
    setPromoError('');

    // Simulate promo code validation
    if (promoCode.toLowerCase() === 'welcome10') {
      setPromoDiscount(10);
      setPromoApplied(true);
    } else if (promoCode.toLowerCase() === 'special20') {
      setPromoDiscount(20);
      setPromoApplied(true);
    } else if (promoCode.toLowerCase() === 'vip25') {
      setPromoDiscount(25);
      setPromoApplied(true);
    } else {
      setPromoError('Invalid promo code. Please try again.');
    }
  };

  // Calculate final price after applying promo code
  const calculateFinalPrice = (basePrice: number) => {
    if (!promoApplied) return basePrice;
    const discountAmount = (basePrice * promoDiscount) / 100;
    return basePrice - discountAmount;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            <span>Back</span>
          </button>

          <div className="flex items-center mb-4">
            <FaCoins className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Purchase Points</h1>
          </div>
          <p className="text-gray-600">Buy points packages to access premium features</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <WalletNavigation />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {purchaseComplete ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center max-w-md mx-auto">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-green-100">
                  <FaCheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Purchase Complete!</h2>
                <p className="text-gray-600 mb-6">
                  Your points have been added to your wallet.
                </p>
                <p className="text-lg font-bold text-blue-600 mb-6">
                  New Balance: {userPoints} points
                </p>
                <div className="flex space-x-4 justify-center">
                  <Button onClick={() => router.push(`/user/wallet/${userRole}`)}>
                    Go to Wallet
                  </Button>
                  <Button variant="outline" onClick={() => setPurchaseComplete(false)}>
                    Buy More Points
                  </Button>
                </div>
              </div>
            ) : showCheckout && selectedPackage ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Checkout</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="font-bold text-gray-900">{selectedPackage.name}</h3>
                            <p className="text-gray-600 text-sm">{selectedPackage.points} points</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">${selectedPackage.price_usd.toFixed(2)}</p>
                            {selectedPackage.discount_percentage && (
                              <Badge variant="success">Save {selectedPackage.discount_percentage}%</Badge>
                            )}
                          </div>
                        </div>

                        {/* Promo Code Section */}
                        <div className="mb-4">
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                placeholder="Enter promo code"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              />
                              {promoError && <p className="text-red-500 text-xs mt-1">{promoError}</p>}
                            </div>
                            <Button
                              variant="outline"
                              onClick={handleApplyPromo}
                              disabled={!promoCode.trim()}
                            >
                              Apply
                            </Button>
                          </div>
                          {promoApplied && (
                            <div className="mt-2 p-2 bg-green-50 rounded border border-green-200 text-green-700 text-sm">
                              <FaCheckCircle className="inline-block mr-1 h-3 w-3" />
                              {promoDiscount}% discount applied!
                            </div>
                          )}
                        </div>

                        <hr className="my-4 border-gray-200" />

                        <div className="flex justify-between items-center font-bold">
                          <span>Total</span>
                          <span>
                            {promoApplied ? (
                              <span className="flex flex-col items-end">
                                <span className="text-sm line-through text-gray-400">
                                  ${selectedPackage.price_usd.toFixed(2)}
                                </span>
                                <span className="text-green-600">
                                  ${calculateFinalPrice(selectedPackage.price_usd).toFixed(2)}
                                </span>
                              </span>
                            ) : (
                              `$${selectedPackage.price_usd.toFixed(2)}`
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
                        <div className="border border-gray-200 rounded-lg p-4 mb-4">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="card"
                              name="payment"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              defaultChecked
                            />
                            <label htmlFor="card" className="ml-3 block text-gray-700">
                              <div className="flex items-center">
                                <FaCreditCard className="h-5 w-5 text-gray-400 mr-2" />
                                Credit or Debit Card
                              </div>
                            </label>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                            <input
                              type="text"
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              placeholder="1234 5678 9012 3456"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                            <input
                              type="text"
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              placeholder="John Doe"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                            <input
                              type="text"
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                            <input
                              type="text"
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              placeholder="123"
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        className="w-full justify-center"
                        onClick={handlePurchase}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            Complete Purchase
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600">Package</p>
                          <p className="font-medium">{selectedPackage.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Points</p>
                          <p className="font-medium">{selectedPackage.points} points</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Price</p>
                          <p className="font-medium">${selectedPackage.price_usd.toFixed(2)}</p>
                        </div>
                        {selectedPackage.discount_percentage && (
                          <div>
                            <p className="text-sm text-gray-600">Package Discount</p>
                            <p className="font-medium text-green-600">{selectedPackage.discount_percentage}% off</p>
                          </div>
                        )}
                        {promoApplied && (
                          <div>
                            <p className="text-sm text-gray-600">Promo Discount</p>
                            <p className="font-medium text-green-600">{promoDiscount}% off</p>
                          </div>
                        )}

                        <hr className="border-gray-200" />

                        <div className="flex justify-between">
                          <p className="font-semibold">Total</p>
                          <p className="font-bold">
                            {promoApplied
                              ? `$${calculateFinalPrice(selectedPackage.price_usd).toFixed(2)}`
                              : `$${selectedPackage.price_usd.toFixed(2)}`}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <FaShieldAlt className="inline-block mr-2" />
                      Your payment is secure and encrypted
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Recommended Packages */}
                {recommendedPackages.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended for {userRole === 'candidate' ? 'Candidates' : userRole === 'hr' ? 'HR Professionals' : 'Enterprises'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {recommendedPackages.map((pkg) => (
                        <Card
                          key={pkg.id}
                          className="border-2 border-yellow-300 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 bg-gradient-to-br from-yellow-50 to-white"
                          onClick={() => handleSelectPackage(pkg)}
                        >
                          <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            RECOMMENDED
                          </div>
                          <CardContent className="p-6">
                            <div className="text-center mb-4">
                              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3 bg-yellow-100 text-yellow-700 border-2 border-yellow-300">
                                <FaStar className="h-6 w-6" />
                              </div>
                              <h3 className="text-xl font-bold mb-1 text-yellow-700">{pkg.name}</h3>
                              <div className="flex items-center justify-center">
                                <span className="text-3xl font-bold">{pkg.points}</span>
                                <span className="text-gray-600 ml-1">points</span>
                              </div>
                            </div>

                            <div className="mb-6">
                              <div className="flex items-center justify-center mb-4">
                                <span className="text-3xl font-bold">${pkg.price_usd.toFixed(2)}</span>
                                {pkg.discount_percentage && (
                                  <span className="ml-2 text-sm line-through text-gray-500">
                                    ${(pkg.price_usd / (1 - pkg.discount_percentage / 100)).toFixed(2)}
                                  </span>
                                )}
                              </div>
                              {pkg.price_inr && (
                                <p className="text-center text-gray-500 text-sm">
                                  ₹{pkg.price_inr.toFixed(2)} INR
                                </p>
                              )}
                            </div>

                            <Button
                              className="w-full justify-center bg-yellow-500 hover:bg-yellow-600 text-white"
                              onClick={() => handleSelectPackage(pkg)}
                            >
                              <FaShoppingCart className="mr-2 h-4 w-4" />
                              Best Value - Buy Now
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Packages Grid */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">All Available Packages</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {packages.map((pkg) => (
                      <Card
                        key={pkg.id}
                        className={`border-2 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${getPackageColor(pkg)} ${pkg.discount_percentage ? 'relative' : ''}`}
                        onClick={() => handleSelectPackage(pkg)}
                      >
                        {pkg.discount_percentage && (
                          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            SAVE {pkg.discount_percentage}%
                          </div>
                        )}
                        <CardContent className="p-6">
                          <div className="text-center mb-4">
                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${getPackageTextColor(pkg)} bg-white border-2 ${pkg.price_usd < 10 ? 'border-blue-300' : pkg.price_usd < 30 ? 'border-purple-300' : 'border-indigo-300'}`}>
                              <FaCoins className="h-6 w-6" />
                            </div>
                            <h3 className={`text-xl font-bold mb-1 ${getPackageTextColor(pkg)}`}>{pkg.name}</h3>
                            <div className="flex items-center justify-center">
                              <span className="text-3xl font-bold">{pkg.points}</span>
                              <span className="text-gray-600 ml-1">points</span>
                            </div>
                          </div>

                          <div className="mb-6">
                            <div className="flex items-center justify-center mb-4">
                              <span className="text-3xl font-bold">${pkg.price_usd.toFixed(2)}</span>
                              {pkg.discount_percentage && (
                                <span className="ml-2 text-sm line-through text-gray-500">
                                  ${(pkg.price_usd / (1 - pkg.discount_percentage / 100)).toFixed(2)}
                                </span>
                              )}
                            </div>
                            {pkg.price_inr && (
                              <p className="text-center text-gray-500 text-sm">
                                ₹{pkg.price_inr.toFixed(2)} INR
                              </p>
                            )}
                          </div>

                          <Button
                            className="w-full justify-center bg-white border-2 hover:bg-opacity-10 hover:bg-black text-gray-800"
                            onClick={() => handleSelectPackage(pkg)}
                          >
                            <FaShoppingCart className="mr-2 h-4 w-4" />
                            Purchase Now
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Features Section */}
                <Card className="mt-12">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <CardTitle className="text-center text-white">Why Purchase Points?</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-blue-100 p-3 rounded-full mb-4">
                          <FaStar className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-bold mb-2">Premium Access</h3>
                        <p className="text-gray-600 text-sm">
                          Get access to premium candidates, jobs, and insights that aren't available with free accounts.
                        </p>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-green-100 p-3 rounded-full mb-4">
                          <FaTag className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="font-bold mb-2">Volume Discounts</h3>
                        <p className="text-gray-600 text-sm">
                          The more points you buy, the more you save. Our larger packages come with significant discounts.
                        </p>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-purple-100 p-3 rounded-full mb-4">
                          <FaPercent className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="font-bold mb-2">Promo Codes</h3>
                        <p className="text-gray-600 text-sm">
                          Use promo codes like "WELCOME10" for new users, "SPECIAL20" for returning users, or "VIP25" for premium members.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasePointsPage;
