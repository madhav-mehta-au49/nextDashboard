'use client';

import React, { useState } from 'react';
import { JobListing } from '@/app/user/types/jobs';
import { JobService } from '@/app/services/jobs';
import { FiTrash2, FiPlay, FiPause, FiArchive, FiCheck, FiX } from 'react-icons/fi';

interface BulkJobActionsProps {
  selectedJobs: JobListing[];
  onJobsUpdated: (jobs: JobListing[]) => void;
  onSelectionCleared: () => void;
  companyId?: number | null;
}

const BulkJobActions: React.FC<BulkJobActionsProps> = ({
  selectedJobs,
  onJobsUpdated,
  onSelectionCleared,
  companyId
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingAction, setProcessingAction] = useState<string>('');

  const handleBulkAction = async (action: string) => {
    if (selectedJobs.length === 0) return;

    let confirmMessage = '';
    let statusUpdate = '';    switch (action) {
      case 'activate':
        confirmMessage = `Activate ${selectedJobs.length} selected jobs?`;
        statusUpdate = 'active';
        break;
      case 'pause':
        confirmMessage = `Pause ${selectedJobs.length} selected jobs?`;
        statusUpdate = 'paused';
        break;
      case 'publish':
        confirmMessage = `Publish ${selectedJobs.length} selected jobs?`;
        statusUpdate = 'published';
        break;
      case 'close':
        confirmMessage = `Close ${selectedJobs.length} selected jobs?`;
        statusUpdate = 'closed';
        break;
      case 'delete':
        confirmMessage = `Delete ${selectedJobs.length} selected jobs? This action cannot be undone.`;
        break;
      default:
        return;
    }

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingAction(action);      if (action === 'delete') {
        // Delete jobs
        await Promise.all(
          selectedJobs.map(job => JobService.deleteJob(job.id))
        );
        // Signal deletion by passing empty array
        onJobsUpdated([]);
      } else {
        // Update job status
        const updatedJobs = await Promise.all(
          selectedJobs.map(job =>
            JobService.updateJob(job.id, { status: statusUpdate })
          )
        );
        // Pass updated jobs for merging
        onJobsUpdated(updatedJobs);
      }

      onSelectionCleared();
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error);
      alert(`Failed to ${action} jobs. Please try again.`);
    } finally {
      setIsProcessing(false);
      setProcessingAction('');
    }
  };

  if (selectedJobs.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FiCheck className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-gray-900">
            {selectedJobs.length} job{selectedJobs.length !== 1 ? 's' : ''} selected
          </span>
        </div>

        <div className="h-6 w-px bg-gray-300" />        <div className="flex items-center gap-2">
          <button
            onClick={() => handleBulkAction('activate')}
            disabled={isProcessing}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isProcessing && processingAction === 'activate' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <FiPlay className="w-4 h-4" />
            )}
            Activate
          </button>

          <button
            onClick={() => handleBulkAction('pause')}
            disabled={isProcessing}
            className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 disabled:opacity-50"
          >
            {isProcessing && processingAction === 'pause' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <FiPause className="w-4 h-4" />
            )}
            Pause
          </button>

          <button
            onClick={() => handleBulkAction('close')}
            disabled={isProcessing}
            className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            {isProcessing && processingAction === 'close' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <FiArchive className="w-4 h-4" />
            )}
            Close
          </button>

          <button
            onClick={() => handleBulkAction('delete')}
            disabled={isProcessing}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isProcessing && processingAction === 'delete' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <FiTrash2 className="w-4 h-4" />
            )}
            Delete
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        <button
          onClick={onSelectionCleared}
          disabled={isProcessing}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          <FiX className="w-4 h-4" />
          Clear
        </button>
      </div>
    </div>
  );
};

export default BulkJobActions;
