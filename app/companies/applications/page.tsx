'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Header from '@/app/web/components/header';
import SubHeader from '@/components/subheader';
import Footer from '@/components/footer';
import EmployeeHeader from '@/components/EmployeeHeader';
import { JobApplicationService } from '@/app/services/jobs';
import { JobApplication } from '@/app/user/types/jobs';
import { FiUser, FiEye, FiCheck, FiX, FiClock, FiMail, FiPhone, FiDownload, FiFilter } from 'react-icons/fi';

interface ApplicationsPageProps {
  jobId?: string;
}

export default function CompanyApplicationsPage({ jobId }: ApplicationsPageProps) {
  const router = useRouter();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loadingActions, setLoadingActions] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    loadApplications();
  }, [statusFilter, jobId]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const filters = {
        status: statusFilter === 'all' ? undefined : statusFilter,
        job_id: jobId ? parseInt(jobId) : undefined,
      };

      const result = await JobApplicationService.getJobApplications(
        jobId ? parseInt(jobId) : 0,
        filters
      );
      setApplications(result.data);
    } catch (err) {
      console.error('Error loading applications:', err);
      setError('Failed to load applications');
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: number, newStatus: string) => {
    try {
      setLoadingActions(prev => ({ ...prev, [applicationId]: true }));
      await JobApplicationService.updateApplicationStatus(applicationId, newStatus);

      // Update local state
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId
            ? { ...app, status: newStatus }
            : app
        )
      );

      toast.success(`Application ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    } finally {
      setLoadingActions(prev => ({ ...prev, [applicationId]: false }));
    }
  };

  const handleScheduleInterview = async (applicationId: number) => {
    // TODO: Implement interview scheduling modal
    toast.info('Interview scheduling coming soon!');
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewing: 'bg-blue-100 text-blue-800',
      interviewed: 'bg-purple-100 text-purple-800',
      hired: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      withdrawn: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || statusColors.pending
        }`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                <p className="mt-4 text-gray-600">Loading applications...</p>
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
              <h3 className="text-lg font-medium text-red-800">Error Loading Applications</h3>
              <p className="mt-2 text-red-700">{error}</p>
              <button
                onClick={loadApplications}
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
      <SubHeader />

      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Application Management</h1>
                <p className="mt-2 text-gray-600">Review and manage candidate applications</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FiFilter className="w-4 h-4 text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="all">All Applications</option>
                    <option value="pending">Pending</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="interviewed">Interviewed</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Applications List */}
          {applications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <FiUser className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-600">Applications will appear here once candidates start applying to your jobs.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Job Position
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((application) => (
                      <tr key={application.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <FiUser className="w-5 h-5 text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {application.candidate?.name || 'Anonymous'}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center space-x-2">
                                {application.candidate?.email && (
                                  <span className="flex items-center">
                                    <FiMail className="w-3 h-3 mr-1" />
                                    {application.candidate.email}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {application.job_listing?.title || 'Job Title'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.job_listing?.location || 'Location'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(application.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FiClock className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              {formatDate(application.created_at)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            {/* View Application */}
                            <button
                              onClick={() => {
                                // TODO: Open application details modal
                                toast.info('Application details coming soon!');
                              }}
                              className="text-teal-600 hover:text-teal-900"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>

                            {/* Download Resume */}
                            {application.resume_url && (
                              <a
                                href={application.resume_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <FiDownload className="w-4 h-4" />
                              </a>
                            )}

                            {/* Status Actions */}
                            {application.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(application.id, 'reviewing')}
                                  disabled={loadingActions[application.id]}
                                  className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                                  title="Start Review"
                                >
                                  {loadingActions[application.id] ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                  ) : (
                                    <FiEye className="w-4 h-4" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(application.id, 'rejected')}
                                  disabled={loadingActions[application.id]}
                                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                  title="Reject"
                                >
                                  <FiX className="w-4 h-4" />
                                </button>
                              </>
                            )}

                            {application.status === 'reviewing' && (
                              <>
                                <button
                                  onClick={() => handleScheduleInterview(application.id)}
                                  disabled={loadingActions[application.id]}
                                  className="text-purple-600 hover:text-purple-900 disabled:opacity-50"
                                  title="Schedule Interview"
                                >
                                  <FiClock className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(application.id, 'hired')}
                                  disabled={loadingActions[application.id]}
                                  className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                  title="Hire"
                                >
                                  <FiCheck className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(application.id, 'rejected')}
                                  disabled={loadingActions[application.id]}
                                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                  title="Reject"
                                >
                                  <FiX className="w-4 h-4" />
                                </button>
                              </>
                            )}

                            {application.status === 'interviewed' && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(application.id, 'hired')}
                                  disabled={loadingActions[application.id]}
                                  className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                  title="Hire"
                                >
                                  <FiCheck className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(application.id, 'rejected')}
                                  disabled={loadingActions[application.id]}
                                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                  title="Reject"
                                >
                                  <FiX className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
