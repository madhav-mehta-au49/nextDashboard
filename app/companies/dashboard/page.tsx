'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Header from '@/app/web/components/header';
import SubHeader from '@/components/subheader';
import Footer from '@/components/footer';
import EmployeeHeader from '@/components/EmployeeHeader';
import { JobService } from '@/app/services/jobs';
import { JobApplicationService } from '@/app/services/jobs';
import { CompanyJobList, JobCreationForm, CompanyAnalytics } from '../components/dashboard';
import { JobListing } from '@/app/user/types/jobs';
import { FiPlus, FiBriefcase, FiUsers, FiTrendingUp, FiSettings } from 'react-icons/fi';

interface Company {
  id: number;
  name: string;
  slug: string;
  logo_url?: string;
}

interface DashboardStats {
  total_jobs: number;
  active_jobs: number;
  total_applications: number;
  pending_applications: number;
  views_this_month: number;
  applications_this_month: number;
}

export default function CompanyDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState<string | null>(null);
    useEffect(() => {
    // Check if user is authenticated and has correct role
    const checkUserAccess = () => {
      const userRole = localStorage.getItem('userRole');
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      
      console.log('Company dashboard checking access:', { userRole, isAuthenticated });
      
      if (!isAuthenticated) {
        console.log('User not authenticated, redirecting to login');
        toast.error('Please log in to access the company dashboard.');
        router.push('/login');
        return false;
      }
      
      // If user is a candidate, redirect them away from company dashboard
      if (userRole === 'candidate') {
        console.log('User is a candidate, redirecting to user dashboard');
        toast.error('Access denied. Candidates cannot access the company dashboard.');
        router.push('/user/dashboard');
        return false;
      }
      
      return true;
    };
    
    // Only load data if user has proper access
    if (checkUserAccess()) {
      loadDashboardData();
    }
  }, []);  // Set the first company as selected by default when companies load
  useEffect(() => {
    if (companies.length > 0 && selectedCompanyId === null && companies[0]) {
      setSelectedCompanyId(companies[0].id);
    }
  }, [companies, selectedCompanyId]);

  // Reload data when selected company changes
  useEffect(() => {
    if (selectedCompanyId !== null) {
      loadCompanySpecificData();
    }
  }, [selectedCompanyId]);
  const loadCompanySpecificData = async () => {
    if (!selectedCompanyId) return;

    try {
      setLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

      const fetchOptions = {
        credentials: 'include' as RequestCredentials,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      };

      // Load company-specific jobs using the correct endpoint with company_id parameter
      const jobsResponse = await fetch(`${API_URL}/company/dashboard/jobs?company_id=${selectedCompanyId}`, fetchOptions);
      
      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json() as any;
        if (jobsData.status === 'success') {
          setJobs(jobsData.data);
        }
      } else {
        console.error('Failed to load company-specific jobs:', jobsResponse.status);
        // If fails, try to load all jobs
        const allJobsResponse = await fetch(`${API_URL}/company/dashboard/jobs`, fetchOptions);
        if (allJobsResponse.ok) {
          const allJobsData = await allJobsResponse.json() as any;
          if (allJobsData.status === 'success') {
            // Filter jobs by selected company on frontend as fallback
            const filteredJobs = allJobsData.data.filter((job: any) => job.company_id === selectedCompanyId);
            setJobs(filteredJobs);
          }
        }
      }
    } catch (err) {
      console.error('Error loading company-specific data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get the currently selected company
  const selectedCompany = companies.find(company => company.id === selectedCompanyId) || companies[0];

  // Function to refresh only stats without reloading jobs
  const refreshStats = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const fetchOptions = {
        credentials: 'include' as RequestCredentials,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      };

      const dashboardResponse = await fetch(`${API_URL}/company/dashboard`, fetchOptions);
      
      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json() as any;
        if (dashboardData.status === 'success') {
          setStats(dashboardData.data.stats);
        }
      }
    } catch (err) {
      console.error('Error refreshing stats:', err);
    }
  };  // Filter jobs based on visibility rules 
  const getVisibleJobs = (jobList: JobListing[]) => {
    // Show all jobs in overview and jobs tabs for management purposes
    // Jobs should remain visible but status indicators will show current state
    return jobList;
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

      // Use session-based authentication with credentials
      const fetchOptions = {
        credentials: 'include' as RequestCredentials,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      };      // Load company-specific dashboard data
      const dashboardResponse = await fetch(`${API_URL}/company/dashboard`, fetchOptions);
      
      if (!dashboardResponse.ok) {
        if (dashboardResponse.status === 401) {
          toast.error('Please log in to access your company dashboard');
          setError('Authentication required');
          router.push('/login');
          return;
        }
        
        if (dashboardResponse.status === 403) {
          toast.error('Access denied. Your account does not have permission to access the company dashboard.');
          setError('Permission denied');
          router.push('/user/dashboard');
          return;
        }
        
        throw new Error('Failed to load company dashboard data');
      }

      const dashboardData = await dashboardResponse.json() as any;      if (dashboardData.status === 'success') {
        setStats(dashboardData.data.stats);
        setCompanies(dashboardData.data.companies || []);
        
        // Only set jobs from dashboard if no specific company is selected yet
        if (!selectedCompanyId) {
          setJobs(dashboardData.data.active_jobs || []);
        }
      } else {
        throw new Error(dashboardData.message || 'Failed to load dashboard data');
      }

      // Don't load all jobs again if we're already loading company-specific jobs
      if (!selectedCompanyId) {
        // Load all jobs only if no specific company is selected
        const jobsResponse = await fetch(`${API_URL}/company/dashboard/jobs`, fetchOptions);
        
        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json() as any;
          if (jobsData.status === 'success') {
            setJobs(jobsData.data);
          }
        }
      }

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please check your permissions.');
    } finally {
      setLoading(false);
    }
  };  const handleJobCreated = (newJob: JobListing) => {
    setJobs(prevJobs => [newJob, ...prevJobs]);
    setIsCreatingJob(false);
    toast.success('Job created successfully!');
    // Refresh only stats to show updated active_jobs count
    refreshStats();
  };
  const handleJobUpdated = (updatedJob: JobListing) => {
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === updatedJob.id ? updatedJob : job
      )
    );
    toast.success('Job updated successfully!');
    // Refresh stats to reflect status changes
    refreshStats();
  };
  const handleJobDeleted = (jobId: number) => {
    setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
    toast.success('Job deleted successfully!');
    // Refresh stats to reflect deleted job
    refreshStats();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <EmployeeHeader />
        <SubHeader />
        <main className="flex-grow py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading dashboard...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <EmployeeHeader />
        <SubHeader />
        <main className="flex-grow py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-red-800">Error Loading Dashboard</h3>
              <p className="mt-2 text-red-700">{error}</p>
              <button
                onClick={loadDashboardData}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <EmployeeHeader />
      <SubHeader />      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Welcome to your dashboard</h1>
            {selectedCompany && (
              <p className="text-lg text-gray-700 mt-1">
                {selectedCompany.name} Dashboard
              </p>
            )}
          </div>
          
          {/* Company Header */}
          <div className="mb-6">
            {selectedCompany && (
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-center space-x-4">
                  {selectedCompany.logo_url ? (
                    <img 
                      src={selectedCompany.logo_url} 
                      alt={selectedCompany.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-semibold text-lg">
                        {selectedCompany.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedCompany.name}</h2>
                    <p className="text-sm text-gray-500">@{selectedCompany.slug}</p>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex items-center space-x-4">
                  {companies.length > 1 && (
                    <div className="flex items-center">
                      <select
                        id="company-select"
                        value={selectedCompanyId || ''}
                        onChange={(e) => setSelectedCompanyId(Number(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                      >
                        {companies.map((company) => (
                          <option key={company.id} value={company.id}>
                            {company.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  <button
                    onClick={() => setIsCreatingJob(true)}
                    className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors text-sm"
                  >
                    <FiPlus className="w-4 h-4 mr-1" />
                    Post Job
                  </button>
                </div>
              </div>
            )}
            
            {companies.length > 1 && (
              <div className="text-sm text-gray-600 mb-6">
                Multi-Company Management: You're managing {companies.length} companies. 
                {selectedCompanyId ? 
                  " Currently viewing data for " + selectedCompany?.name + "." : 
                  " Data shown reflects aggregated metrics across all your companies."}
              </div>
            )}
          </div>{/* Dashboard Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiBriefcase className="w-8 h-8 text-teal-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.active_jobs}</p>                    <p className="text-xs text-gray-500 mt-1">
                      {companies.length === 1 && companies[0] ? companies[0].name : `Across ${companies.length} companies`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiUsers className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_applications}</p>
                    <p className="text-xs text-gray-500 mt-1">All time applications</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiTrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">This Month Apps</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.applications_this_month}</p>
                    <p className="text-xs text-gray-500 mt-1">Recent activity</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiSettings className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pending_applications}</p>
                    <p className="text-xs text-gray-500 mt-1">Needs attention</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'jobs'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Job Listings ({activeTab === 'jobs' ? jobs.length : getVisibleJobs(jobs).length})
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'analytics'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Analytics
              </button>
            </nav>
          </div>          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">                {/* Companies Section - only show if managing multiple companies */}
                {companies.length > 1 && (
                  <div className="border-b border-gray-200 pb-6 mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Your Companies</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {companies.map((company) => (
                        <button
                          key={company.id}
                          onClick={() => setSelectedCompanyId(company.id)}
                          className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                            selectedCompanyId === company.id
                              ? 'bg-teal-50 border border-teal-200'
                              : 'border border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {company.logo_url ? (
                            <img 
                              src={company.logo_url} 
                              alt={company.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              selectedCompanyId === company.id ? 'bg-teal-100' : 'bg-gray-100'
                            }`}>
                              <span className={`font-medium text-sm ${
                                selectedCompanyId === company.id ? 'text-teal-600' : 'text-gray-600'
                              }`}>
                                {company.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${
                              selectedCompanyId === company.id ? 'text-teal-700' : 'text-gray-900'
                            }`}>
                              {company.name}
                            </p>
                            <p className="text-xs text-gray-500">@{company.slug}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Jobs</h3>
                    <CompanyJobList
                      jobs={getVisibleJobs(jobs).slice(0, 5)}
                      onJobUpdated={handleJobUpdated}
                      onJobDeleted={handleJobDeleted}
                      compact={true}
                    />
                  </div>

                  {stats && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Total Jobs Posted</span>
                          <span className="font-medium text-gray-900">{stats.total_jobs}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Active Job Listings</span>
                          <span className="font-medium text-teal-600">{stats.active_jobs}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Pending Applications</span>
                          <span className="font-medium text-orange-600">{stats.pending_applications}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600">Views This Month</span>
                          <span className="font-medium text-blue-600">{stats.views_this_month}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}            {activeTab === 'jobs' && (
              <CompanyJobList
                jobs={jobs}
                onJobUpdated={handleJobUpdated}
                onJobDeleted={handleJobDeleted}
                onJobsUpdated={(updatedJobs) => {
                  if (updatedJobs.length === 0) {
                    // Jobs were deleted, reload to get fresh data
                    if (selectedCompanyId) {
                      loadCompanySpecificData();
                    } else {
                      loadDashboardData();
                    }
                  } else {
                    // Jobs were updated, merge them with existing jobs
                    setJobs(prevJobs => 
                      prevJobs.map(job => {
                        const updatedJob = updatedJobs.find(updated => updated.id === job.id);
                        return updatedJob || job;
                      })
                    );
                    // Refresh stats after bulk updates
                    refreshStats();
                  }
                }}
              />
            )}

            {activeTab === 'analytics' && stats && (
              <CompanyAnalytics stats={stats} />
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Job Creation Modal */}
      {isCreatingJob && (
        <JobCreationForm
          onJobCreated={handleJobCreated}
          onClose={() => setIsCreatingJob(false)}
        />
      )}
    </div>
  );
}
