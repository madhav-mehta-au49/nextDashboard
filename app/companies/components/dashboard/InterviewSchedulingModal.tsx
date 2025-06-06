'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiX, FiCalendar, FiClock, FiMapPin, FiVideo, FiPhone, FiUsers, FiUser, FiSave } from 'react-icons/fi';
import { InterviewService, Interview } from '@/app/services/jobs/interviewService';
import { JobApplication } from '@/app/user/types/jobs';

interface InterviewSchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: JobApplication;
  existingInterview?: Interview | null;
  onInterviewScheduled?: () => void;
}

const InterviewSchedulingModal: React.FC<InterviewSchedulingModalProps> = ({
  isOpen,
  onClose,
  application,
  existingInterview,
  onInterviewScheduled
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    interview_type: 'video' as 'phone' | 'video' | 'in-person' | 'panel',
    scheduled_at: '',
    duration_minutes: 60,
    location: '',
    meeting_link: '',
    interviewer_notes: '',
    internal_notes: '',
    status: 'scheduled' as 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  // Reset form when modal opens or existing interview changes
  useEffect(() => {
    if (isOpen) {
      if (existingInterview) {
        // Populate form with existing interview data
        const scheduledDate = new Date(existingInterview.scheduled_at);
        const formattedDateTime = new Date(scheduledDate.getTime() - scheduledDate.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        
        setFormData({
          interview_type: existingInterview.interview_type,
          scheduled_at: formattedDateTime,
          duration_minutes: existingInterview.duration_minutes,
          location: existingInterview.location || '',
          meeting_link: existingInterview.meeting_link || '',
          interviewer_notes: existingInterview.interview_notes || '',
          internal_notes: existingInterview.internal_notes || '',
          status: existingInterview.status,
          timezone: existingInterview.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
        });
      } else {
        // Reset form for new interview
        setFormData({
          interview_type: 'video',
          scheduled_at: '',
          duration_minutes: 60,
          location: '',
          meeting_link: '',
          interviewer_notes: '',
          internal_notes: '',
          status: 'scheduled',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
      }
    }
  }, [isOpen, existingInterview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.scheduled_at) {
        toast.error('Please select a date and time for the interview');
        return;
      }

      if (formData.interview_type === 'video' && !formData.meeting_link) {
        toast.error('Please provide a meeting link for video interviews');
        return;
      }

      if (formData.interview_type === 'in-person' && !formData.location) {
        toast.error('Please provide a location for in-person interviews');
        return;
      }      // Create or update interview
      const interviewData = {
        job_application_id: application.id,
        interview_type: formData.interview_type,
        scheduled_at: formData.scheduled_at,
        duration_minutes: formData.duration_minutes,
        location: formData.interview_type === 'in-person' ? formData.location : undefined,
        meeting_link: formData.interview_type === 'video' ? formData.meeting_link : undefined,
        interview_notes: formData.interviewer_notes || undefined,
        internal_notes: formData.internal_notes || undefined,
        timezone: formData.timezone
      };      if (existingInterview) {
        // Update existing interview
        await InterviewService.updateInterview(existingInterview.id, interviewData);
        toast.success('Interview updated successfully!');
      } else {
        // Create new interview
        await InterviewService.createInterview(interviewData);
        toast.success('Interview scheduled successfully!');
      }
      onClose();
      
      if (onInterviewScheduled) {
        onInterviewScheduled();
      }
    } catch (error: any) {
      console.error('Error scheduling interview:', error);
      toast.error(error.message || 'Failed to schedule interview');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {existingInterview ? 'Edit Interview' : 'Schedule Interview'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {application.candidate?.name} - {application.job_listing?.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Interview Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interview Type *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: 'phone', icon: FiPhone, label: 'Phone' },
                { value: 'video', icon: FiVideo, label: 'Video' },
                { value: 'in-person', icon: FiMapPin, label: 'In-Person' },
                { value: 'panel', icon: FiUsers, label: 'Panel' }
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleInputChange('interview_type', value)}
                  className={`flex flex-col items-center p-3 border rounded-lg transition-colors ${
                    formData.interview_type === value
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="scheduled_at" className="block text-sm font-medium text-gray-700 mb-2">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                id="scheduled_at"
                required
                value={formData.scheduled_at}
                onChange={(e) => handleInputChange('scheduled_at', e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <select
                id="duration_minutes"
                value={formData.duration_minutes}
                onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
          </div>

          {/* Conditional Fields Based on Interview Type */}
          {formData.interview_type === 'video' && (
            <div>
              <label htmlFor="meeting_link" className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Link *
              </label>
              <input
                type="url"
                id="meeting_link"
                placeholder="https://meet.google.com/..."
                value={formData.meeting_link}
                onChange={(e) => handleInputChange('meeting_link', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          )}

          {formData.interview_type === 'in-person' && (
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                id="location"
                placeholder="Office address or meeting room"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label htmlFor="interviewer_notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes for Interviewer
            </label>
            <textarea
              id="interviewer_notes"
              rows={3}
              placeholder="Any specific instructions or topics to cover..."
              value={formData.interviewer_notes}
              onChange={(e) => handleInputChange('interviewer_notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div>
            <label htmlFor="internal_notes" className="block text-sm font-medium text-gray-700 mb-2">
              Internal Notes
            </label>
            <textarea
              id="internal_notes"
              rows={3}
              placeholder="Internal notes (not visible to candidate)..."
              value={formData.internal_notes}
              onChange={(e) => handleInputChange('internal_notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          {/* Timezone Display */}
          <div className="bg-gray-50 rounded-md p-3">
            <div className="flex items-center text-sm text-gray-600">
              <FiClock className="w-4 h-4 mr-2" />
              <span>Timezone: {formData.timezone}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Scheduling...
                </>              ) : (
                <>
                  <FiSave className="w-4 h-4 mr-2" />
                  {existingInterview ? 'Update Interview' : 'Schedule Interview'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewSchedulingModal;
