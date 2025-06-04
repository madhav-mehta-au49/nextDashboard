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
  requirements: string[];
  benefits: string[];
  location: string;
  location_type: 'remote' | 'hybrid' | 'onsite';
  job_type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  experience_level: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  salary_min?: number;
  salary_max?: number;
  currency?: string;
  required_skills: string[];
  preferred_skills?: string[];
  application_deadline?: string;
  start_date?: string;
  is_remote_friendly: boolean;
  featured: boolean;
  urgent: boolean;
  category_id?: number;
  status: 'draft' | 'active' | 'published' | 'paused' | 'closed' | 'expired';
  questions?: Array<{
    question: string;
    required: boolean;
  }>;
}

const JobEditForm: React.FC<JobEditFormProps> = ({
  job,
  onJobUpdated,
  onClose
}) => {  // Debug logging to see what data we're receiving from the backend
  console.log('JobEditForm - Original job data:', job);
  console.log('JobEditForm - job.required_skills:', job.required_skills, typeof job.required_skills);
  console.log('JobEditForm - job.experience_level:', job.experience_level);
  console.log('JobEditForm - job.location_type:', job.location_type);
  console.log('JobEditForm - job.salary_min/max:', job.salary_min, job.salary_max);
  console.log('JobEditForm - job.category_id:', job.category_id);
  
  const { register, handleSubmit, formState: { errors }, watch, setValue, getValues } = useForm<JobFormData>({
    defaultValues: {      title: job.title,
      description: job.description,
      requirements: (() => {
        if (Array.isArray(job.requirements)) return job.requirements as string[];
        if (typeof job.requirements === 'string') {
          try { return JSON.parse(job.requirements); } catch { return []; }
        }
        return [];
      })() as string[],
      benefits: (() => {
        if (Array.isArray(job.benefits)) return job.benefits as string[];
        if (typeof job.benefits === 'string') {
          try { return JSON.parse(job.benefits); } catch { return []; }
        }
        return [];
      })() as string[],
      job_type: job.job_type,
      location: job.location,
      location_type: job.location_type,
      experience_level: job.experience_level,
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      currency: job.currency || 'INR',
      required_skills: (() => {
        console.log('JobEditForm - required_skills parsing - original:', job.required_skills);
        if (Array.isArray(job.required_skills)) return job.required_skills;
        if (typeof job.required_skills === 'string') {
          try { 
            const parsed = JSON.parse(job.required_skills);
            console.log('JobEditForm - required_skills parsing - parsed:', parsed);
            return parsed;
          } catch (e) { 
            console.log('JobEditForm - required_skills parsing - error:', e);
            return []; 
          }
        }
        return [];
      })() as string[],      preferred_skills: job.preferred_skills || [],
      application_deadline: job.application_deadline,
      start_date: job.start_date,
      is_remote_friendly: job.is_remote_friendly || false,
      urgent: job.urgent || false,
      featured: job.featured || false,
      category_id: job.category_id,
      status: job.status || 'active',
      questions: job.questions?.map(q => ({
        question: q.question_text || '',
        required: q.is_required || false,
      })) || [],
    }  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState('');
  const [questionInput, setQuestionInput] = useState('');
  const [requirementInput, setRequirementInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');

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
  };  const addSkill = () => {
    if (skillInput.trim()) {
      const currentSkills = getValues('required_skills') || [];
      setValue('required_skills', [...currentSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    const currentSkills = getValues('required_skills') || [];
    setValue('required_skills', currentSkills.filter((_, i) => i !== index));
  };
  
  const addQuestion = () => {
    if (questionInput.trim()) {
      const currentQuestions = getValues('questions') || [];
      setValue('questions', [...currentQuestions, { question: questionInput.trim(), required: false }]);
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
      i === index ? { ...q, required: !q.required } : q
    );
    setValue('questions', updatedQuestions);
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      const currentRequirements = getValues('requirements') || [];
      setValue('requirements', [...currentRequirements, requirementInput.trim()]);
      setRequirementInput('');
    }
  };

  const removeRequirement = (index: number) => {
    const currentRequirements = getValues('requirements') || [];
    setValue('requirements', currentRequirements.filter((_, i) => i !== index));
  };

  const addBenefit = () => {
    if (benefitInput.trim()) {
      const currentBenefits = getValues('benefits') || [];
      setValue('benefits', [...currentBenefits, benefitInput.trim()]);
      setBenefitInput('');
    }
  };
  const removeBenefit = (index: number) => {
    const currentBenefits = getValues('benefits') || [];
    setValue('benefits', currentBenefits.filter((_, i) => i !== index));
  };

const onSubmit = async (data: JobFormData) => {
    try {
      setIsSubmitting(true);
      
      // Debug logging to see what data we're submitting
      console.log('JobEditForm - onSubmit - Form data before processing:', data);
      
      // Only include fields expected by the backend API, with proper type handling
      const jobData = {
        title: data.title,
        description: data.description,
        // Convert requirements and benefits to JSON strings if they're not already strings
        requirements: Array.isArray(data.requirements) ? JSON.stringify(data.requirements) : '[]',
        benefits: Array.isArray(data.benefits) ? JSON.stringify(data.benefits) : '[]',
        location: data.location,
        location_type: data.location_type, 
        job_type: data.job_type,
        experience_level: data.experience_level, 
        salary_min: data.salary_min ? Number(data.salary_min) : undefined,
        salary_max: data.salary_max ? Number(data.salary_max) : undefined,
        currency: data.currency,
        required_skills: Array.isArray(data.required_skills) ? data.required_skills : [],
        preferred_skills: Array.isArray(data.preferred_skills) ? data.preferred_skills : [],
        application_deadline: data.application_deadline,
        start_date: data.start_date,
        is_remote_friendly: Boolean(data.is_remote_friendly),
        featured: Boolean(data.featured),
        urgent: Boolean(data.urgent),
        category_id: data.category_id ? Number(data.category_id) : undefined,
        status: data.status || 'active',
        questions: data.questions?.map(q => ({
          question: q.question,
          required: Boolean(q.required)
        }))
      };
      
      console.log('JobEditForm - onSubmit - Processed job data being sent to backend:', jobData);
      
      const updatedJob = await JobService.updateJob(job.id, jobData);
      onJobUpdated(updatedJob);
      onClose();    
    } catch (error: any) {
      console.error('Error updating job:', error);
      let errorMessage = 'Failed to update job. Please try again.';
      
      // Extract and display validation errors if available
      if (error.response && error.response.data) {
        console.error('Error response data:', error.response.data);
        
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        
        // Display validation errors if available
        if (error.response.data.errors) {
          const errorDetails = Object.entries(error.response.data.errors)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join('\n');
          
          errorMessage += '\n\nValidation errors:\n' + errorDetails;
        }
      }
      
      setErrorMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  const skills = watch('required_skills') || [];
  const questions = watch('questions') || [];
  const watchedRequirements = watch('requirements') || [];
  const watchedBenefits = watch('benefits') || [];

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
              </label>              <select
                {...register('experience_level', { required: 'Experience level is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="lead">Lead Level</option>
                <option value="executive">Executive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Type *
              </label>              <select
                {...register('location_type', { required: 'Location type is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="onsite">On-site</option>
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
              </div>              <div>
                <select
                  {...register('currency')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>                </select>
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
          </div>          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements *
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a requirement (e.g., Bachelor's degree in Computer Science)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
              />
              <button
                type="button"
                onClick={addRequirement}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FiPlus className="w-4 h-4" />
              </button>
            </div>
            {watchedRequirements.length > 0 && (
              <div className="space-y-2">
                {watchedRequirements.map((requirement, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <span className="flex-1 text-sm">{requirement}</span>
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {watchedRequirements.length === 0 && (
              <p className="text-sm text-red-600">At least one requirement is required</p>
            )}
          </div>          {/* Benefits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Benefits & Perks
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={benefitInput}
                onChange={(e) => setBenefitInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a benefit (e.g., Health insurance, Flexible working hours)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
              />
              <button
                type="button"
                onClick={addBenefit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <FiPlus className="w-4 h-4" />
              </button>
            </div>
            {watchedBenefits.length > 0 && (
              <div className="space-y-2">
                {watchedBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <span className="flex-1 text-sm">{benefit}</span>
                    <button
                      type="button"
                      onClick={() => removeBenefit(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
            <div className="space-y-2">              {questions.map((question, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="flex-1">{question.question}</span>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={question.required}
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
