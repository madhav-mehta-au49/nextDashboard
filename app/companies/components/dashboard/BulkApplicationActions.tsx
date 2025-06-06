'use client';

import React, { useState } from 'react';
import { JobApplication } from '@/app/user/types/jobs';
import { JobApplicationService } from '@/app/services/jobs';
import { 
  FiTrash2, 
  FiCheck, 
  FiX, 
  FiEye, 
  FiClock, 
  FiMessageSquare,
  FiDownload,
  FiCalendar,
  FiMail
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

interface BulkApplicationActionsProps {
  selectedApplications: JobApplication[];
  onApplicationsUpdated: (applications: JobApplication[]) => void;
  onSelectionCleared: () => void;
  onScheduleInterview?: (applications: JobApplication[]) => void;
}

const BulkApplicationActions: React.FC<BulkApplicationActionsProps> = ({
  selectedApplications,
  onApplicationsUpdated,
  onSelectionCleared,
  onScheduleInterview
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingAction, setProcessingAction] = useState<string>('');

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedApplications.length === 0) return;

    const statusLabels = {
      'pending': 'Pending',
      'reviewing': 'Reviewing', 
      'interviewed': 'Interviewed',
      'offered': 'Offered',
      'hired': 'Hired',
      'rejected': 'Rejected'
    };

    const confirmMessage = `Update ${selectedApplications.length} application${selectedApplications.length !== 1 ? 's' : ''} to "${statusLabels[status as keyof typeof statusLabels]}"?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingAction(status);      const applicationIds = selectedApplications.map(app => app.id);
      const updatedCount = await JobApplicationService.bulkUpdateStatus({
        application_ids: applicationIds,
        status: status as 'pending' | 'reviewing' | 'interviewed' | 'offered' | 'hired' | 'rejected',
        notes: `Status updated to ${statusLabels[status as keyof typeof statusLabels]} by employer via bulk action`
      });

      // Update the applications locally
      const updatedApplications = selectedApplications.map(app => ({
        ...app,
        status: status as 'pending' | 'reviewing' | 'interviewed' | 'offered' | 'hired' | 'rejected',
        status_updated_at: new Date().toISOString()
      }));

      onApplicationsUpdated(updatedApplications);
      onSelectionCleared();
      
      toast.success(`Successfully updated ${updatedCount} application${updatedCount !== 1 ? 's' : ''}`);
    } catch (error) {
      console.error('Error updating application statuses:', error);
      toast.error('Failed to update application statuses');
    } finally {
      setIsProcessing(false);
      setProcessingAction('');
    }
  };

  const handleBulkScheduleInterview = () => {
    if (selectedApplications.length === 0) return;
    if (onScheduleInterview) {
      onScheduleInterview(selectedApplications);
    }
  };

  const handleExportApplications = async () => {
    try {
      setIsProcessing(true);
      setProcessingAction('export');

      // Create CSV data from selected applications
      const csvData = selectedApplications.map(app => ({
        'Application ID': app.id,
        'Job Title': app.job_listing?.title || '',
        'Company': app.job_listing?.company?.name || '',
        'Candidate Name': app.candidate?.name || `${app.first_name || ''} ${app.last_name || ''}`.trim(),
        'Email': app.email || app.candidate?.user?.email || '',
        'Phone': app.phone || '',
        'Status': app.status,
        'Applied Date': app.applied_at ? new Date(app.applied_at).toLocaleDateString() : '',
        'Last Updated': app.status_updated_at ? new Date(app.status_updated_at).toLocaleDateString() : '',
        'Current Job Title': app.current_job_title || '',
        'Current Company': app.current_company || '',
        'Experience': app.total_experience || '',
        'Current Salary': app.current_salary || '',
        'Location': app.current_location || ''
      }));

      if (csvData.length === 0) {
        toast.error('No applications to export');
        return;
      }

      // Convert to CSV format
      const headers = Object.keys(csvData[0]);
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          headers.map(header => {
            const value = row[header as keyof typeof row];
            // Escape commas and quotes in CSV values
            const escapedValue = String(value || '').replace(/"/g, '""');
            return `"${escapedValue}"`;
          }).join(',')
        )
      ].join('\n');

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `job-applications-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast.success(`Exported ${csvData.length} application${csvData.length !== 1 ? 's' : ''} to CSV`);
    } catch (error) {
      console.error('Error exporting applications:', error);
      toast.error('Failed to export applications');
    } finally {
      setIsProcessing(false);
      setProcessingAction('');
    }
  };

  if (selectedApplications.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 max-w-4xl">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Selection Info */}
        <div className="flex items-center gap-2">
          <FiCheck className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-gray-900">
            {selectedApplications.length} application{selectedApplications.length !== 1 ? 's' : ''} selected
          </span>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        {/* Status Update Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleBulkStatusUpdate('reviewing')}
            disabled={isProcessing}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isProcessing && processingAction === 'reviewing' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <FiEye className="w-4 h-4" />
            )}
            Mark Reviewing
          </button>

          <button
            onClick={() => handleBulkStatusUpdate('interviewed')}
            disabled={isProcessing}
            className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {isProcessing && processingAction === 'interviewed' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <FiMessageSquare className="w-4 h-4" />
            )}
            Mark Interviewed
          </button>

          <button
            onClick={() => handleBulkStatusUpdate('offered')}
            disabled={isProcessing}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isProcessing && processingAction === 'offered' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <FiCheck className="w-4 h-4" />
            )}
            Send Offer
          </button>

          <button
            onClick={() => handleBulkStatusUpdate('rejected')}
            disabled={isProcessing}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {isProcessing && processingAction === 'rejected' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <FiX className="w-4 h-4" />
            )}
            Reject
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        {/* Additional Actions */}
        <div className="flex items-center gap-2">
          {onScheduleInterview && (
            <button
              onClick={handleBulkScheduleInterview}
              disabled={isProcessing}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <FiCalendar className="w-4 h-4" />
              Schedule Interviews
            </button>
          )}

          <button
            onClick={handleExportApplications}
            disabled={isProcessing}
            className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {isProcessing && processingAction === 'export' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <FiDownload className="w-4 h-4" />
            )}
            Export CSV
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        {/* Clear Selection */}
        <button
          onClick={onSelectionCleared}
          disabled={isProcessing}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 transition-colors"
        >
          <FiX className="w-4 h-4" />
          Clear
        </button>
      </div>
    </div>
  );
};

export default BulkApplicationActions;
