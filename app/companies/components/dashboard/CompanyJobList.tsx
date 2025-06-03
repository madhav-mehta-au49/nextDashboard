'use client';

import React, { useState } from 'react';
import { JobListing } from '@/app/user/types/jobs';
import { JobService } from '@/app/services/jobs';
import { FiEdit, FiTrash2, FiEye, FiUsers, FiClock, FiMoreVertical } from 'react-icons/fi';
import Link from 'next/link';
import JobEditForm from './JobEditForm';
import BulkJobActions from './BulkJobActions';

interface CompanyJobListProps {
    jobs: JobListing[];
    onJobUpdated: (job: JobListing) => void;
    onJobDeleted: (jobId: number) => void;
    onJobsUpdated?: (jobs: JobListing[]) => void;
    compact?: boolean;
}

const CompanyJobList: React.FC<CompanyJobListProps> = ({
    jobs,
    onJobUpdated,
    onJobDeleted,
    onJobsUpdated,
    compact = false
}) => {
    const [loadingActions, setLoadingActions] = useState<{ [key: number]: string }>({});
    const [showMenu, setShowMenu] = useState<number | null>(null);
    const [editingJob, setEditingJob] = useState<JobListing | null>(null);
    const [selectedJobs, setSelectedJobs] = useState<number[]>([]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedJobs(jobs.map(job => job.id));
        } else {
            setSelectedJobs([]);
        }
    };

    const handleSelectJob = (jobId: number, checked: boolean) => {
        if (checked) {
            setSelectedJobs(prev => [...prev, jobId]);
        } else {
            setSelectedJobs(prev => prev.filter(id => id !== jobId));
        }
    };    const handleBulkJobsUpdated = (updatedJobs: JobListing[]) => {
        if (onJobsUpdated) {
            onJobsUpdated(updatedJobs);
        }
        setSelectedJobs([]);
    };

    const handleBulkSelectionCleared = () => {
        setSelectedJobs([]);
    };

    const selectedJobObjects = jobs.filter(job => selectedJobs.includes(job.id));

    const handleDeleteJob = async (jobId: number) => {
        if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
            return;
        }

        try {
            setLoadingActions(prev => ({ ...prev, [jobId]: 'deleting' }));
            await JobService.deleteJob(jobId);
            onJobDeleted(jobId);
        } catch (error) {
            console.error('Error deleting job:', error);
            alert('Failed to delete job. Please try again.');
        } finally {
            setLoadingActions(prev => {
                const newState = { ...prev };
                delete newState[jobId];
                return newState;
            });
        }
    };    const handleToggleStatus = async (job: JobListing) => {
        try {
            setLoadingActions(prev => ({ ...prev, [job.id]: 'updating' }));
            // Primary toggle: active <-> paused
            // Secondary options available through bulk actions
            const newStatus = job.status === 'active' ? 'paused' : 'active';
            const updatedJob = await JobService.updateJob(job.id, { status: newStatus });
            onJobUpdated(updatedJob);
        } catch (error) {
            console.error('Error updating job status:', error);
            alert('Failed to update job status. Please try again.');
        } finally {
            setLoadingActions(prev => {
                const newState = { ...prev };
                delete newState[job.id];
                return newState;
            });
        }
    };const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'published':
                return 'bg-blue-100 text-blue-800';
            case 'paused':
                return 'bg-yellow-100 text-yellow-800';
            case 'closed':
                return 'bg-red-100 text-red-800';
            case 'expired':
                return 'bg-orange-100 text-orange-800';
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (compact) {
        return (
            <div className="space-y-4">
                {jobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-medium text-gray-900">{job.title}</h4>
                                <p className="text-sm text-gray-500">{job.location} • {job.job_type}</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                                    {job.status}
                                </span>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center space-x-2">
                                    <FiUsers className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">{job.applicants_count || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedJobs.length === jobs.length && jobs.length > 0}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Job Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Applications
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Views
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Posted
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {jobs.map((job) => (
                                <tr key={job.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            checked={selectedJobs.includes(job.id)}
                                            onChange={(e) => handleSelectJob(job.id, e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <Link href={`/user/jobs/${job.id}/${job.title.toLowerCase().replace(/\s+/g, '-')}`}>
                                                <div className="text-sm font-medium text-gray-900 hover:text-teal-600 cursor-pointer">
                                                    {job.title}
                                                </div>
                                            </Link>
                                            <div className="text-sm text-gray-500">
                                                {job.location} • {job.job_type}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FiUsers className="w-4 h-4 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-900">
                                                {job.applicants_count || 0}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FiEye className="w-4 h-4 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-900">
                                                {job.views_count || 0}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <FiClock className="w-4 h-4 text-gray-400 mr-2" />
                                            {formatDate(job.created_at)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowMenu(showMenu === job.id ? null : job.id)}
                                                className="inline-flex items-center p-2 text-gray-400 bg-transparent border-0 rounded-lg hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-100"
                                                disabled={!!loadingActions[job.id]}
                                            >
                                                {loadingActions[job.id] ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                                                ) : (
                                                    <FiMoreVertical className="w-4 h-4" />
                                                )}
                                            </button>

                                            {showMenu === job.id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                                    <div className="py-1">
                                                        <Link
                                                            href={`/user/jobs/${job.id}/${job.title.toLowerCase().replace(/\s+/g, '-')}`}
                                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            onClick={() => setShowMenu(null)}
                                                        >
                                                            <FiEye className="w-4 h-4 mr-2" />
                                                            View Job
                                                        </Link>
                                                        <button
                                                            onClick={() => {
                                                                setEditingJob(job);
                                                                setShowMenu(null);
                                                            }}
                                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            <FiEdit className="w-4 h-4 mr-2" />
                                                            Edit Job
                                                        </button>                                                        <button
                                                            onClick={() => {
                                                                handleToggleStatus(job);
                                                                setShowMenu(null);
                                                            }}
                                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            {job.status === 'active' ? 'Pause Job' : 'Activate Job'}
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                handleDeleteJob(job.id);
                                                                setShowMenu(null);
                                                            }}
                                                            className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                                        >
                                                            <FiTrash2 className="w-4 h-4 mr-2" />
                                                            Delete Job
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingJob && (
                <JobEditForm
                    job={editingJob}
                    onJobUpdated={(updatedJob) => {
                        onJobUpdated(updatedJob);
                        setEditingJob(null);
                    }}
                    onClose={() => setEditingJob(null)}
                />
            )}

            <BulkJobActions
                selectedJobs={selectedJobObjects}
                onJobsUpdated={handleBulkJobsUpdated}
                onSelectionCleared={handleBulkSelectionCleared}
            />
        </>
    );
};

export default CompanyJobList;
