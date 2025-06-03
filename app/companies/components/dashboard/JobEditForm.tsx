'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { JobService } from '@/app/services/jobs';
import { JobCategoryService } from '@/app/services/jobs';
import { JobListing } from '@/app/user/types/jobs';
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi';

interface JobEditFormProps {
  job: JobListing;
  onJobUpdated: (job: JobListing) => void;
  onClose: () => void;
}

interface JobFormData {
  title: string;
  description: string;
  requirements: string;
  benefits: string;
  job_type: string;
  location: string;
  location_type: string;
  experience_level: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  salary_period: string;
  category_id: number;
  skills: string[];
  questions: { question_text: string; is_required: boolean; question_type: string }[];
  application_deadline?: string;
  is_remote_friendly: boolean;
  urgent: boolean;
  featured: boolean;
  status: string;
}

const JobEditForm: React.FC<JobEditFormProps> = ({
  job,
  onJobUpdated,
  onClose
}) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue, getValues } = useForm<JobFormData>({
    defaultValues: {
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      benefits: job.benefits,
      job_type: job.job_type,
      location: job.location,
      location_type: job.location_type,
      experience_level: job.experience_level,
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      salary_currency: job.currency || 'USD',
      salary_period: 'year',
      category_id: job.category_id,
      skills: job.required_skills || [],
      questions: job.questions?.map(q => ({
        question_text: q.question_text,
        is_required: q.is_required,
        question_type: q.question_type
      })) || [],
      application_deadline: job.application_deadline,
      is_remote_friendly: job.is_remote_friendly || false,
      urgent: job.urgent || false,
      featured: job.featured || false,
      status: job.status,
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [questionInput, setQuestionInput] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await JobCategoryService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      const currentSkills = getValues('skills') || [];
      setValue('skills', [...currentSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    const currentSkills = getValues('skills') || [];
    setValue('skills', currentSkills.filter((_, i) => i !== index));
  };
  const addQuestion = () => {
    if (questionInput.trim()) {
      const currentQuestions = getValues('questions') || [];
      setValue('questions', [...currentQuestions, { question_text: questionInput.trim(), is_required: false, question_type: 'text' }]);
      setQuestionInput('');
    }
  };

  const removeQuestion = (index: number) => {
    const currentQuestions = getValues('questions') || [];
    setValue('questions', currentQuestions.filter((_, i) => i !== index));
  };

  const toggleQuestionRequired = (index: number) => {
    const currentQuestions = getValues('questions') || [];
    const updatedQuestions = currentQuestions.map((q, i) =>
      i === index ? { ...q, is_required: !q.is_required } : q
    );
    setValue('questions', updatedQuestions);
  };
  const onSubmit = async (data: JobFormData) => {
    try {
      setIsSubmitting(true);

      const jobData = {
        ...data,
        salary_range: data.salary_min || data.salary_max ?
          `${data.salary_min || 0}-${data.salary_max || 0}` : undefined,
        required_skills: data.skills,
        questions: data.questions?.map(q => ({
          question_text: q.question_text,
          is_required: q.is_required,
          question_type: q.question_type || 'text'
        }))
      };
      const updatedJob = await JobService.updateJob(job.id, jobData);
      onJobUpdated(updatedJob);
      onClose();
    } catch (error) {
      console.error('Error updating job:', error);
      alert('Failed to update job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const skills = watch('skills') || [];
  const questions = watch('questions') || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Edit Job Listing</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit as any)} className="p-6 space-y-6">          {/* Job Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Status
            </label>
            <select
              {...register('status', { required: 'Status is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >                            <option value="draft">Draft</option>
                            <option value="active">Active</option>
                            <option value="published">Published</option>
                            <option value="paused">Paused</option>
                            <option value="closed">Closed</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                {...register('title', { required: 'Job title is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Senior Frontend Developer"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register('category_id', {
                  required: 'Category is required',
                  valueAsNumber: true
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="mt-1 text-sm text-red-600">{errors.category_id.message}</p>
              )}
            </div>
          </div>

          {/* Job Type and Experience Level */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type *
              </label>
              <select
                {...register('job_type', { required: 'Job type is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level *
              </label>
              <select
                {...register('experience_level', { required: 'Experience level is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="entry-level">Entry Level</option>
                <option value="mid-level">Mid Level</option>
                <option value="senior-level">Senior Level</option>
                <option value="executive">Executive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Type *
              </label>
              <select
                {...register('location_type', { required: 'Location type is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="on-site">On-site</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              {...register('location', { required: 'Location is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. New York, NY or Remote"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>

          {/* Salary Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary Range (Optional)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <input
                  type="number"
                  {...register('salary_min', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Min salary"
                />
              </div>
              <div>
                <input
                  type="number"
                  {...register('salary_max', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Max salary"
                />
              </div>
              <div>
                <select
                  {...register('salary_currency')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
              </div>
              <div>
                <select
                  {...register('salary_period')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="year">Per Year</option>
                  <option value="month">Per Month</option>
                  <option value="hour">Per Hour</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              {...register('description', { required: 'Job description is required' })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the role, responsibilities, and what you're looking for..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements *
            </label>
            <textarea
              {...register('requirements', { required: 'Requirements are required' })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="List the required qualifications, skills, and experience..."
            />
            {errors.requirements && (
              <p className="mt-1 text-sm text-red-600">{errors.requirements.message}</p>
            )}
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Benefits & Perks
            </label>
            <textarea
              {...register('benefits')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Health insurance, flexible hours, remote work, etc..."
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Required Skills
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a skill and press Enter"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <FiPlus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <FiTrash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Custom Questions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Application Questions
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addQuestion())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a custom question"
              />
              <button
                type="button"
                onClick={addQuestion}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <FiPlus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {questions.map((question, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="flex-1">{question.question_text}</span>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={question.is_required}
                      onChange={() => toggleQuestionRequired(index)}
                      className="mr-2"
                    />
                    Required
                  </label>
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Application Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application Deadline (Optional)
            </label>
            <input
              type="date"
              {...register('application_deadline')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Job Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Settings
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('is_remote_friendly')}
                  className="mr-2"
                />
                Remote work allowed
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('urgent')}
                  className="mr-2"
                />
                Mark as urgent
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('featured')}
                  className="mr-2"
                />
                Featured job (premium)
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobEditForm;
