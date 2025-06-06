'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { InterviewService, Interview } from '@/app/services/jobs/interviewService';
import { JobApplication } from '@/app/user/types/jobs';
import { 
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiVideo, 
  FiPhone, 
  FiUsers, 
  FiEdit, 
  FiTrash2, 
  FiPlus,
  FiUser,
  FiMessageSquare,
  FiExternalLink,
  FiRotateCcw
} from 'react-icons/fi';
import { format } from 'date-fns';
import InterviewSchedulingModal from './InterviewSchedulingModal';

interface InterviewManagementProps {
  application: JobApplication;
  onInterviewUpdate?: () => void;
}

const InterviewManagement: React.FC<InterviewManagementProps> = ({ 
  application, 
  onInterviewUpdate 
}) => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);
  const [loadingActions, setLoadingActions] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchInterviews();
  }, [application.id]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const interviewData = await InterviewService.getApplicationInterviews(application.id);
      setInterviews(interviewData);
    } catch (err) {
      console.error('Error fetching interviews:', err);
      setError('Failed to load interviews');
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteInterview = async (interviewId: number) => {
    if (!confirm('Are you sure you want to delete this interview?')) {
      return;
    }

    try {
      setLoadingActions(prev => ({ ...prev, [interviewId]: true }));
      await InterviewService.deleteInterview(interviewId);
      toast.success('Interview deleted successfully');
      await fetchInterviews();
      onInterviewUpdate?.();
    } catch (err) {
      console.error('Error deleting interview:', err);
      toast.error('Failed to delete interview');
    } finally {
      setLoadingActions(prev => ({ ...prev, [interviewId]: false }));
    }
  };

  const handleInterviewScheduled = async () => {
    await fetchInterviews();
    onInterviewUpdate?.();
    setIsSchedulingModalOpen(false);
    setEditingInterview(null);
  };

  const getInterviewTypeIcon = (type: string) => {
    switch (type) {
      case 'phone':
        return <FiPhone className="w-4 h-4" />;
      case 'video':
        return <FiVideo className="w-4 h-4" />;
      case 'in-person':
        return <FiMapPin className="w-4 h-4" />;
      case 'panel':
        return <FiUsers className="w-4 h-4" />;
      default:
        return <FiCalendar className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatInterviewType = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={fetchInterviews}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <FiCalendar className="w-5 h-5 mr-2" />
            Interviews ({interviews.length})
          </h3>
          <button
            onClick={() => setIsSchedulingModalOpen(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="w-4 h-4 mr-1" />
            Add Interview
          </button>
        </div>

        {interviews.length === 0 ? (
          <div className="text-center py-8">
            <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No interviews scheduled yet</p>
            <button
              onClick={() => setIsSchedulingModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Schedule First Interview
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div
                key={interview.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center text-gray-600">
                        {getInterviewTypeIcon(interview.interview_type)}
                        <span className="ml-1 text-sm font-medium">
                          {formatInterviewType(interview.interview_type)}
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                        {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <FiCalendar className="w-4 h-4 mr-2" />
                        {format(new Date(interview.scheduled_at), 'MMM d, yyyy')}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FiClock className="w-4 h-4 mr-2" />
                        {format(new Date(interview.scheduled_at), 'h:mm a')} ({interview.duration_minutes} min)
                      </div>
                    </div>

                    {interview.location && (
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <FiMapPin className="w-4 h-4 mr-2" />
                        {interview.location}
                      </div>
                    )}

                    {interview.meeting_link && (
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <FiVideo className="w-4 h-4 mr-2" />
                        <a
                          href={interview.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          Join Meeting
                          <FiExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    )}

                    {interview.primary_interviewer && (
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <FiUser className="w-4 h-4 mr-2" />
                        {interview.primary_interviewer.name} ({interview.primary_interviewer.email})
                      </div>
                    )}

                    {interview.interview_notes && (
                      <div className="flex items-start text-sm text-gray-600 mb-2">
                        <FiMessageSquare className="w-4 h-4 mr-2 mt-0.5" />
                        <span>{interview.interview_notes}</span>
                      </div>
                    )}
                  </div>                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setEditingInterview(interview);
                        setIsSchedulingModalOpen(true);
                      }}
                      disabled={loadingActions[interview.id]}
                      className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      title="Edit"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteInterview(interview.id)}
                      disabled={loadingActions[interview.id]}
                      className="inline-flex items-center p-2 border border-gray-300 rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isSchedulingModalOpen && (
        <InterviewSchedulingModal
          isOpen={isSchedulingModalOpen}
          onClose={() => {
            setIsSchedulingModalOpen(false);
            setEditingInterview(null);
          }}
          application={application}
          existingInterview={editingInterview}
          onInterviewScheduled={handleInterviewScheduled}
        />
      )}
    </>
  );
};

export default InterviewManagement;
