'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { JobApplicationService } from '@/app/services/jobs';
import { JobApplication } from '@/app/user/types/jobs';
import { 
  FiUser, 
  FiEye, 
  FiCheck, 
  FiX, 
  FiClock, 
  FiMail, 
  FiPhone, 
  FiDownload, 
  FiFilter,
  FiSearch,
  FiCalendar,
  FiMessageSquare,
  FiBriefcase,
  FiMapPin,
  FiGlobe,
  FiTrendingUp,
  FiDollarSign,
  FiStar,
  FiTarget,
  FiHeart,
  FiFileText,
  FiPaperclip,
  FiFile,
  FiInfo
} from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import InterviewSchedulingModal from './InterviewSchedulingModal';
import InterviewManagement from './InterviewManagement';
import BulkApplicationActions from './BulkApplicationActions';

interface CompanyApplicationsManagerProps {
  companyId?: number | null;
  onStatsUpdate?: () => Promise<void> | void;
}

const CompanyApplicationsManager: React.FC<CompanyApplicationsManagerProps> = ({ companyId, onStatsUpdate }) => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplications, setSelectedApplications] = useState<JobApplication[]>([]);  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [loadingActions, setLoadingActions] = useState<{ [key: number]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [applicationToSchedule, setApplicationToSchedule] = useState<JobApplication | null>(null);

  useEffect(() => {
    loadApplications();
  }, [statusFilter, companyId, currentPage]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);      const filters = {
        status: statusFilter === 'all' ? undefined : statusFilter,
        company_id: companyId || undefined, // Convert null to undefined for the API
        page: currentPage,
        per_page: 10,
        search: searchTerm || undefined
      };

      // Use company applications endpoint if available, otherwise get all applications
      const result = await JobApplicationService.getApplications(filters);
      setApplications(result.data);
      setTotalPages(result.meta.last_page);
    } catch (err) {
      console.error('Error loading applications:', err);
      setError('Failed to load applications');
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };  const handleStatusUpdate = async (applicationId: number, newStatus: string) => {
    try {
      setLoadingActions(prev => ({ ...prev, [applicationId]: true }));
      const notes = `Status updated to ${newStatus} by employer via company dashboard`;
      await JobApplicationService.updateApplicationStatus(applicationId, newStatus, notes);

      // Cast newStatus to the proper type
      const validStatus = newStatus as 'pending' | 'reviewing' | 'interviewed' | 'offered' | 'hired' | 'rejected';

      // Update local state
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId
            ? { ...app, status: validStatus, status_updated_at: new Date().toISOString() }
            : app
        )
      );

      // Update selected application if it's the same one
      if (selectedApplication && selectedApplication.id === applicationId) {
        setSelectedApplication(prev => prev ? { ...prev, status: validStatus, status_updated_at: new Date().toISOString() } : null);
      }

      // Update dashboard stats
      if (onStatsUpdate) {
        await onStatsUpdate();
      }

      toast.success(`Application ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    } finally {
      setLoadingActions(prev => ({ ...prev, [applicationId]: false }));
    }  };
  
  const handleScheduleInterview = (application: JobApplication) => {
    setApplicationToSchedule(application);
    setIsInterviewModalOpen(true);
  };

  const handleInterviewScheduled = async () => {
    // Refresh applications list to show updated status
    await loadApplications();
    
    // Update dashboard stats
    if (onStatsUpdate) {
      await onStatsUpdate();
    }
    
    // Close modal
    setIsInterviewModalOpen(false);
    setApplicationToSchedule(null);
  };
  
  const handleSearch = () => {
    setCurrentPage(1);
    loadApplications();
  };

  // Bulk operations handlers
  const handleSelectApplication = (application: JobApplication, checked: boolean) => {
    if (checked) {
      setSelectedApplications(prev => [...prev, application]);
    } else {
      setSelectedApplications(prev => prev.filter(app => app.id !== application.id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedApplications([...filteredApplications]);
    } else {
      setSelectedApplications([]);
    }
  };

  const handleBulkApplicationsUpdated = (updatedApplications: JobApplication[]) => {
    // Update the main applications state with the updated applications
    setApplications(prev => 
      prev.map(app => {
        const updated = updatedApplications.find(updatedApp => updatedApp.id === app.id);
        return updated || app;
      })
    );

    // Update dashboard stats
    if (onStatsUpdate) {
      onStatsUpdate();
    }
  };

  const handleBulkSelectionCleared = () => {
    setSelectedApplications([]);
  };  const handleBulkScheduleInterview = (applications: JobApplication[]) => {
    // For bulk interview scheduling, we'll open the modal for the first application
    // and provide a way to apply to all selected applications
    if (applications.length > 0 && applications[0]) {
      setApplicationToSchedule(applications[0]);
      setIsInterviewModalOpen(true);
      // Store the bulk applications for potential batch scheduling
      // This can be enhanced later to handle true bulk scheduling
    }
  };

  const handleResumeDownload = (resumeUrl: string, filename: string) => {
    try {
      const fullUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${resumeUrl}`;
      console.log('Downloading from:', fullUrl); // Debug log
      
      // Create download link and trigger download directly
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = filename;
      link.target = '_blank'; // Open in new tab as fallback
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Resume download started');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download resume');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'interviewed':
        return 'bg-purple-100 text-purple-800';
      case 'offered':
        return 'bg-green-100 text-green-800';
      case 'hired':
        return 'bg-emerald-100 text-emerald-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FiClock className="w-4 h-4" />;
      case 'reviewing':
        return <FiEye className="w-4 h-4" />;
      case 'interviewed':
        return <FiMessageSquare className="w-4 h-4" />;
      case 'offered':
      case 'hired':
        return <FiCheck className="w-4 h-4" />;
      case 'rejected':
      case 'withdrawn':
        return <FiX className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
    }
  };

  const filteredApplications = applications.filter(app => {    const matchesSearch = !searchTerm || 
      app.candidate?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job_listing?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job_listing?.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    reviewing: applications.filter(app => app.status === 'reviewing').length,
    interviewed: applications.filter(app => app.status === 'interviewed').length,
    offered: applications.filter(app => app.status === 'offered').length,
    hired: applications.filter(app => app.status === 'hired').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  if (error && !loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <FiX className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Applications</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => loadApplications()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">      {/* Header with search and filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Applications Management</h2>
            <p className="text-sm text-gray-600 mt-1">
              {applications.length} total applications
              {selectedApplications.length > 0 && (
                <span className="ml-2 text-teal-600 font-medium">
                  • {selectedApplications.length} selected
                </span>
              )}
            </p>
          </div>
          
          {/* Search */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 text-sm"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            >
              Search
            </button>
          </div>
        </div>        {/* Status Filter Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <nav className="-mb-px flex flex-wrap space-x-8">
              {[
                { key: 'all', label: 'All', count: statusCounts.all },
                { key: 'pending', label: 'Pending', count: statusCounts.pending },
                { key: 'reviewing', label: 'Reviewing', count: statusCounts.reviewing },
                { key: 'interviewed', label: 'Interviewed', count: statusCounts.interviewed },
                { key: 'offered', label: 'Offered', count: statusCounts.offered },
                { key: 'hired', label: 'Hired', count: statusCounts.hired },
                { key: 'rejected', label: 'Rejected', count: statusCounts.rejected },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setStatusFilter(tab.key);
                    setCurrentPage(1);
                    setSelectedApplications([]); // Clear selection when changing filters
                  }}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    statusFilter === tab.key
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
            
            {/* Bulk Selection Controls */}
            {filteredApplications.length > 0 && (
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span>Select All</span>
                </label>
                {selectedApplications.length > 0 && (
                  <button
                    onClick={() => setSelectedApplications([])}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear Selection
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>      {/* Applications List */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Left Panel - Applications List */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading applications...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="p-8 text-center">
                <FiUser className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-600">
                  {statusFilter !== 'all' 
                    ? `No applications with status "${statusFilter}"`
                    : 'No applications have been submitted yet'
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 max-h-[calc(100vh-12rem)] overflow-y-auto">{/* Applications List with scrolling */}
                {filteredApplications.map((application) => (                  <div
                    key={application.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      selectedApplication?.id === application.id ? 'bg-teal-50 border-l-4 border-teal-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Selection Checkbox */}
                      <div className="flex-shrink-0 pt-1">
                        <input
                          type="checkbox"
                          checked={selectedApplications.some(app => app.id === application.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectApplication(application, e.target.checked);
                          }}
                          className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                        />
                      </div>

                      {/* Candidate Avatar */}
                      <div 
                        className="flex-shrink-0 cursor-pointer"
                        onClick={() => setSelectedApplication(application)}
                      >
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <FiUser className="w-6 h-6 text-gray-600" />
                        </div>
                      </div>

                      {/* Application Details */}
                      <div 
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => setSelectedApplication(application)}
                      >
                        <div className="flex items-center justify-between">                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {application.candidate?.name || application.first_name + ' ' + application.last_name}
                          </h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(application.status)}`}>
                            {getStatusIcon(application.status)}
                            <span className="ml-1 capitalize">{application.status}</span>
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-1">
                          Applied for: {application.job_listing?.title}
                        </p>
                        
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>Applied {formatDistanceToNow(new Date(application.applied_at))} ago</span>
                          {application.email && (
                            <span className="flex items-center">
                              <FiMail className="w-3 h-3 mr-1" />
                              {application.email}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex-shrink-0 flex items-center space-x-2">
                        {application.status === 'pending' && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusUpdate(application.id, 'reviewing');
                              }}
                              disabled={loadingActions[application.id]}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                              <FiEye className="w-3 h-3 mr-1" />
                              Review
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusUpdate(application.id, 'rejected');
                              }}
                              disabled={loadingActions[application.id]}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                            >
                              <FiX className="w-3 h-3 mr-1" />
                              Reject
                            </button>
                          </>
                        )}
                        
                        {application.status === 'reviewing' && (
                          <>                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleScheduleInterview(application);
                              }}
                              disabled={loadingActions[application.id]}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                            >
                              <FiCalendar className="w-3 h-3 mr-1" />
                              Schedule Interview
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusUpdate(application.id, 'rejected');
                              }}
                              disabled={loadingActions[application.id]}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                            >
                              <FiX className="w-3 h-3 mr-1" />
                              Reject
                            </button>
                          </>
                        )}                        {application.status === 'interviewed' && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedApplication(application);
                              }}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <FiCalendar className="w-3 h-3 mr-1" />
                              View Interviews
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusUpdate(application.id, 'offered');
                              }}
                              disabled={loadingActions[application.id]}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                            >
                              <FiCheck className="w-3 h-3 mr-1" />
                              Offer
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusUpdate(application.id, 'rejected');
                              }}
                              disabled={loadingActions[application.id]}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                            >
                              <FiX className="w-3 h-3 mr-1" />
                              Reject
                            </button>
                          </>
                        )}

                        {application.status === 'offered' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(application.id, 'hired');
                            }}
                            disabled={loadingActions[application.id]}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-emerald-700 bg-emerald-100 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                          >
                            <FiCheck className="w-3 h-3 mr-1" />
                            Hire
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>        {/* Right Panel - Application Details */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6 max-h-[calc(100vh-2rem)] overflow-y-auto">
            {selectedApplication ? (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Application Details</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(selectedApplication.status)}`}>
                    {getStatusIcon(selectedApplication.status)}
                    <span className="ml-1 capitalize">{selectedApplication.status}</span>
                  </span>
                </div>                {/* Candidate Information */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <FiUser className="w-4 h-4 mr-2" />
                      Candidate Information
                    </h4>
                    <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        {selectedApplication.candidate?.profile_image && (
                          <img 
                            src={selectedApplication.candidate.profile_image} 
                            alt="Profile" 
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          />
                        )}
                        <div className="flex-1">
                          <div>
                            <span className="font-medium text-gray-700">Name:</span> 
                            <span className="ml-2 text-lg font-semibold text-gray-900">
                              {selectedApplication.candidate?.name || `${selectedApplication.first_name} ${selectedApplication.last_name}`}
                            </span>
                          </div>
                          {selectedApplication.candidate?.experience_level && (
                            <div className="mt-1">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                {selectedApplication.candidate.experience_level}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      {selectedApplication.email && (
                        <div className="flex items-center">
                          <FiMail className="w-4 h-4 mr-2 text-gray-400" />
                          <a href={`mailto:${selectedApplication.email}`} className="text-teal-600 hover:text-teal-500">
                            {selectedApplication.email}
                          </a>
                        </div>
                      )}
                      {selectedApplication.phone && (
                        <div className="flex items-center">
                          <FiPhone className="w-4 h-4 mr-2 text-gray-400" />
                          <a href={`tel:${selectedApplication.phone}`} className="text-teal-600 hover:text-teal-500">
                            {selectedApplication.phone}
                          </a>
                        </div>
                      )}
                      {selectedApplication.current_location && (
                        <div className="flex items-center">
                          <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{selectedApplication.current_location}</span>
                        </div>
                      )}
                      {selectedApplication.linkedin_url && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          <a href={selectedApplication.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-500">
                            LinkedIn Profile
                          </a>
                        </div>
                      )}                      {selectedApplication.portfolio_url && (
                        <div className="flex items-center">
                          <FiGlobe className="w-4 h-4 mr-2 text-gray-400" />
                          <a href={selectedApplication.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-500">
                            Portfolio/Website
                          </a>
                        </div>
                      )}
                    </div>
                  </div>{/* Job Information */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <FiBriefcase className="w-4 h-4 mr-2" />
                      Job Information
                    </h4>
                    <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-700">Position:</span> 
                        <span className="ml-2">{selectedApplication.job_listing?.title}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Company:</span> 
                        <span className="ml-2">{selectedApplication.job_listing?.company?.name}</span>
                      </div>
                      <div className="flex items-center">
                        <FiCalendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium text-gray-700">Applied:</span> 
                        <span className="ml-2">{formatDistanceToNow(new Date(selectedApplication.applied_at))} ago</span>
                      </div>
                      {selectedApplication.status_updated_at && (
                        <div className="flex items-center">
                          <FiClock className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="font-medium text-gray-700">Last Updated:</span> 
                          <span className="ml-2">{formatDistanceToNow(new Date(selectedApplication.status_updated_at))} ago</span>
                        </div>
                      )}
                    </div>
                  </div>                  {/* Professional Information */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <FiTrendingUp className="w-4 h-4 mr-2" />
                      Professional Background
                    </h4>
                    <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                      {selectedApplication.current_job_title && (
                        <div>
                          <span className="font-medium text-gray-700">Current Role:</span>
                          <div className="mt-1 text-gray-900">
                            {selectedApplication.current_job_title}
                            {selectedApplication.current_company && ` at ${selectedApplication.current_company}`}
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedApplication.total_experience && (
                          <div>
                            <span className="font-medium text-gray-700">Total Experience:</span>
                            <div className="mt-1">{selectedApplication.total_experience} years</div>
                          </div>
                        )}
                        {selectedApplication.relevant_experience && (
                          <div>
                            <span className="font-medium text-gray-700">Relevant Experience:</span>
                            <div className="mt-1">{selectedApplication.relevant_experience} years</div>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedApplication.current_salary && (
                          <div>
                            <span className="font-medium text-gray-700">Current Salary:</span>
                            <div className="mt-1">
                              {selectedApplication.salary_currency || 'INR'} {selectedApplication.current_salary.toLocaleString()}
                            </div>
                          </div>
                        )}
                        {selectedApplication.work_type_preference && (
                          <div>
                            <span className="font-medium text-gray-700">Work Preference:</span>
                            <div className="mt-1 capitalize">{selectedApplication.work_type_preference}</div>
                          </div>
                        )}
                      </div>
                      {selectedApplication.notice_period && (
                        <div>
                          <span className="font-medium text-gray-700">Notice Period:</span>
                          <div className="mt-1">{selectedApplication.notice_period}</div>
                        </div>
                      )}
                    </div>
                  </div>                  {/* Salary & Availability */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <FiDollarSign className="w-4 h-4 mr-2" />
                      Salary & Availability
                    </h4>
                    <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(selectedApplication.expected_salary || selectedApplication.salary_expectation) && (
                          <div>
                            <span className="font-medium text-gray-700">Expected Salary:</span>
                            <div className="mt-1">
                              {selectedApplication.salary_currency || 'INR'} {(selectedApplication.expected_salary || selectedApplication.salary_expectation)?.toLocaleString()}
                            </div>
                          </div>
                        )}
                        {selectedApplication.availability_date && (
                          <div>
                            <span className="font-medium text-gray-700">Available From:</span>
                            <div className="mt-1">{new Date(selectedApplication.availability_date).toLocaleDateString()}</div>
                          </div>
                        )}
                      </div>
                      {selectedApplication.willing_to_relocate !== undefined && (
                        <div>
                          <span className="font-medium text-gray-700">Willing to Relocate:</span>
                          <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            selectedApplication.willing_to_relocate 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {selectedApplication.willing_to_relocate ? 'Yes' : 'No'}
                          </span>
                        </div>
                      )}
                      {selectedApplication.visa_status && (
                        <div>
                          <span className="font-medium text-gray-700">Visa Status:</span>
                          <div className="mt-1 capitalize">{selectedApplication.visa_status.replace('_', ' ')}</div>
                        </div>
                      )}
                    </div>
                  </div>                  {/* Skills & Strengths */}
                  {(() => {
                    let strengths: string[] = [];
                    if (selectedApplication.key_strengths) {
                      if (Array.isArray(selectedApplication.key_strengths)) {
                        strengths = selectedApplication.key_strengths;
                      } else if (typeof selectedApplication.key_strengths === 'string') {
                        try {
                          strengths = JSON.parse(selectedApplication.key_strengths);
                        } catch {
                          strengths = selectedApplication.key_strengths.split(',').map(s => s.trim());
                        }
                      }
                    }
                    
                    return strengths.length > 0 ? (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                          <FiStar className="w-4 h-4 mr-2" />
                          Key Strengths & Skills
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex flex-wrap gap-2">
                            {strengths.map((strength: string, index: number) => (
                              <span 
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700"
                              >
                                {strength}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })()}

                  {/* Career Goals */}
                  {selectedApplication.career_goals && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <FiTarget className="w-4 h-4 mr-2" />
                        Career Goals
                      </h4>
                      <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                        {selectedApplication.career_goals}
                      </div>
                    </div>
                  )}

                  {/* Motivation Letter */}
                  {selectedApplication.motivation_letter && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <FiHeart className="w-4 h-4 mr-2" />
                        Motivation Letter
                      </h4>
                      <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                        {selectedApplication.motivation_letter}
                      </div>
                    </div>
                  )}

                  {/* Cover Letter */}
                  {selectedApplication.cover_letter && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <FiFileText className="w-4 h-4 mr-2" />
                        Cover Letter
                      </h4>
                      <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                        {selectedApplication.cover_letter}
                      </div>
                    </div>
                  )}                  {/* Company Questions & Answers */}
                  {selectedApplication.answers && selectedApplication.answers.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <FiMessageSquare className="w-4 h-4 mr-2" />
                        Company Questions
                      </h4>
                      <div className="space-y-4">
                        {selectedApplication.answers.map((answer: any, index: number) => (
                          <div key={answer.id || index} className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm font-medium text-gray-700 mb-2">
                              {answer.question_text}
                            </div>
                            <div className="text-sm text-gray-900">
                              {answer.answer}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Documents & Files */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <FiPaperclip className="w-4 h-4 mr-2" />
                      Documents & Files
                    </h4>
                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                      {selectedApplication.resume_url && (
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <div className="flex items-center">
                            <FiFile className="w-5 h-5 mr-3 text-red-500" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">Resume</div>
                              <div className="text-xs text-gray-500">PDF Document</div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleResumeDownload(
                              selectedApplication.resume_url,
                              selectedApplication.resume_url.split('/').pop() || 'resume.pdf'
                            )}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                          >
                            <FiDownload className="w-4 h-4 mr-1" />
                            Download
                          </button>
                        </div>
                      )}
                      {selectedApplication.cover_letter_file_url && (
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <div className="flex items-center">
                            <FiFile className="w-5 h-5 mr-3 text-blue-500" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">Cover Letter</div>
                              <div className="text-xs text-gray-500">Document</div>
                            </div>
                          </div>
                          <a
                            href={selectedApplication.cover_letter_file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                          >
                            <FiDownload className="w-4 h-4 mr-1" />
                            Download
                          </a>
                        </div>
                      )}                      {(() => {
                        let additionalFiles: string[] = [];
                        if (selectedApplication.additional_files_urls) {
                          if (Array.isArray(selectedApplication.additional_files_urls)) {
                            additionalFiles = selectedApplication.additional_files_urls;
                          } else if (typeof selectedApplication.additional_files_urls === 'string') {
                            try {
                              additionalFiles = JSON.parse(selectedApplication.additional_files_urls);
                            } catch {
                              additionalFiles = [selectedApplication.additional_files_urls];
                            }
                          }
                        }
                        
                        return additionalFiles.length > 0 ? (
                          <div>
                            <div className="text-sm font-medium text-gray-700 mb-2">Additional Documents</div>
                            {additionalFiles.map((fileUrl: string, index: number) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-white rounded border mb-2">
                                <div className="flex items-center">
                                  <FiFile className="w-5 h-5 mr-3 text-green-500" />
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {fileUrl.split('/').pop() || `Document ${index + 1}`}
                                    </div>
                                    <div className="text-xs text-gray-500">Additional File</div>
                                  </div>
                                </div>
                                <a
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                >
                                  <FiDownload className="w-4 h-4 mr-1" />
                                  Download
                                </a>
                              </div>
                            ))}
                          </div>
                        ) : null;
                      })()}                      {(() => {
                        let additionalFiles: string[] = [];
                        if (selectedApplication.additional_files_urls) {
                          if (Array.isArray(selectedApplication.additional_files_urls)) {
                            additionalFiles = selectedApplication.additional_files_urls;
                          } else if (typeof selectedApplication.additional_files_urls === 'string') {
                            try {
                              additionalFiles = JSON.parse(selectedApplication.additional_files_urls);
                            } catch {
                              additionalFiles = [selectedApplication.additional_files_urls];
                            }
                          }
                        }
                        
                        const hasDocuments = selectedApplication.resume_url || 
                                           selectedApplication.cover_letter_file_url || 
                                           additionalFiles.length > 0;
                        
                        return !hasDocuments ? (
                          <div className="text-sm text-gray-500 text-center py-4">
                            No documents uploaded
                          </div>
                        ) : null;
                      })()}
                    </div>
                  </div>

                  {/* Additional Information */}
                  {(selectedApplication.additional_notes || selectedApplication.referral_source) && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <FiInfo className="w-4 h-4 mr-2" />
                        Additional Information
                      </h4>
                      <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                        {selectedApplication.referral_source && (
                          <div>
                            <span className="font-medium text-gray-700">How did you hear about us:</span>
                            <div className="mt-1">{selectedApplication.referral_source}</div>
                          </div>
                        )}
                        {selectedApplication.additional_notes && (
                          <div>
                            <span className="font-medium text-gray-700">Additional Notes:</span>
                            <div className="mt-1">{selectedApplication.additional_notes}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Actions</h4>
                    <div className="space-y-2">
                      {selectedApplication.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(selectedApplication.id, 'reviewing')}
                            disabled={loadingActions[selectedApplication.id]}
                            className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            <FiEye className="w-4 h-4 mr-2" />
                            Start Review
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                            disabled={loadingActions[selectedApplication.id]}
                            className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                          >
                            <FiX className="w-4 h-4 mr-2" />
                            Reject
                          </button>
                        </div>
                      )}                      {selectedApplication.status === 'reviewing' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleScheduleInterview(selectedApplication)}
                            disabled={loadingActions[selectedApplication.id]}
                            className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                          >
                            <FiCalendar className="w-4 h-4 mr-2" />
                            Schedule Interview
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                            disabled={loadingActions[selectedApplication.id]}
                            className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                          >
                            <FiX className="w-4 h-4 mr-2" />
                            Reject
                          </button>
                        </div>
                      )}

                      {selectedApplication.status === 'interviewed' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(selectedApplication.id, 'offered')}
                            disabled={loadingActions[selectedApplication.id]}
                            className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                          >
                            <FiCheck className="w-4 h-4 mr-2" />
                            Make Offer
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                            disabled={loadingActions[selectedApplication.id]}
                            className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                          >
                            <FiX className="w-4 h-4 mr-2" />
                            Reject
                          </button>
                        </div>
                      )}

                      {selectedApplication.status === 'offered' && (
                        <button
                          onClick={() => handleStatusUpdate(selectedApplication.id, 'hired')}
                          disabled={loadingActions[selectedApplication.id]}
                          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                        >
                          <FiCheck className="w-4 h-4 mr-2" />
                          Mark as Hired
                        </button>
                      )}                    </div>
                  </div>

                  {/* Interview Management for interviewed applications */}
                  {selectedApplication.status === 'interviewed' && (
                    <div className="mt-6">                      <InterviewManagement 
                        application={selectedApplication}
                        onInterviewUpdate={loadApplications}
                      />
                    </div>
                  )}
                </div>
              </div>) : (
              <div className="text-center p-6">
                <FiUser className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Application Selected</h3>
                <p className="text-gray-600">
                  Select an application from the list to view details and take actions.
                </p>
              </div>
            )}          </div>
        </div>
      </div>      {/* Interview Scheduling Modal */}
      {isInterviewModalOpen && applicationToSchedule && (
        <InterviewSchedulingModal
          isOpen={isInterviewModalOpen}
          onClose={() => {
            setIsInterviewModalOpen(false);
            setApplicationToSchedule(null);
          }}
          application={applicationToSchedule}
          onInterviewScheduled={handleInterviewScheduled}
        />
      )}      {/* Bulk Actions Toolbar */}
      {selectedApplications.length > 0 && (
        <BulkApplicationActions
          selectedApplications={selectedApplications}
          onApplicationsUpdated={handleBulkApplicationsUpdated}
          onSelectionCleared={handleBulkSelectionCleared}
          onScheduleInterview={handleBulkScheduleInterview}
        />
      )}
    </div>
  );
};

export default CompanyApplicationsManager;
