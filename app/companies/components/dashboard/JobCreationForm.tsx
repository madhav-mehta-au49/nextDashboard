'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { JobService } from '@/app/services/jobs';
import { JobCategoryService } from '@/app/services/jobs';
import { JobListing } from '@/app/user/types/jobs';
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi';

interface JobCreationFormProps {
  onJobCreated: (job: JobListing) => void;
  onClose: () => void;
  editJob?: JobListing;
  companyId?: number | null;
}

interface JobFormData {
  title: string;
  description: string;
  requirements: string[];
  benefits?: string[];
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

const JobCreationForm: React.FC<JobCreationFormProps> = ({
  onJobCreated,
  onClose,
  editJob,
  companyId
}) => {const { register, handleSubmit, formState: { errors }, watch, setValue, getValues } = useForm<JobFormData>({
    defaultValues: editJob ? {
      title: editJob.title,
      description: editJob.description,      requirements: (() => {
        if (Array.isArray(editJob.requirements)) return editJob.requirements as string[];
        if (typeof editJob.requirements === 'string') {
          try { return JSON.parse(editJob.requirements); } catch { return []; }
        }
        return [];
      })() as string[],
      benefits: (() => {
        if (Array.isArray(editJob.benefits)) return editJob.benefits as string[];
        if (typeof editJob.benefits === 'string') {
          try { return JSON.parse(editJob.benefits); } catch { return []; }
        }
        return [];
      })() as string[],
      location: editJob.location,
      location_type: editJob.location_type,
      job_type: editJob.job_type,
      experience_level: editJob.experience_level,
      salary_min: editJob.salary_min,
      salary_max: editJob.salary_max,
      currency: editJob.currency || 'INR',
      required_skills: editJob.required_skills || [],
      preferred_skills: editJob.preferred_skills || [],
      application_deadline: editJob.application_deadline,
      start_date: editJob.start_date,
      is_remote_friendly: editJob.is_remote_friendly || false,
      urgent: editJob.urgent || false,
      featured: editJob.featured || false,
      category_id: editJob.category_id,
      status: editJob.status || 'active',      questions: editJob.questions?.map(q => ({
        question: q.question_text || '',
        required: q.is_required || false,
      })) || [],} : {
      location_type: 'onsite',
      job_type: 'full-time',
      experience_level: 'mid',      currency: 'INR',
      required_skills: [],
      preferred_skills: [],
      requirements: [],
      benefits: [],      is_remote_friendly: false,
      urgent: false,
      featured: false,
      status: 'active',
      questions: [],
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);  const [skillInput, setSkillInput] = useState('');
  const [preferredSkillInput, setPreferredSkillInput] = useState('');
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

  const addPreferredSkill = () => {
    if (preferredSkillInput.trim()) {
      const currentSkills = getValues('preferred_skills') || [];
      setValue('preferred_skills', [...currentSkills, preferredSkillInput.trim()]);
      setPreferredSkillInput('');
    }
  };
  const removePreferredSkill = (index: number) => {
    const currentSkills = getValues('preferred_skills') || [];
    setValue('preferred_skills', currentSkills.filter((_, i) => i !== index));
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

  const updateQuestionRequired = (index: number, required: boolean) => {
    const currentQuestions = getValues('questions') || [];
    const updatedQuestions = currentQuestions.map((q, i) =>
      i === index ? { ...q, required } : q
    );
    setValue('questions', updatedQuestions);
  };  const onSubmit = async (data: JobFormData) => {
    try {
      setIsSubmitting(true);

      // Debug logging to see what data we're sending
      console.log('JobCreationForm - Form data before processing:', data);      // Explicitly map all fields to ensure they're all included and in the correct format
      const jobData = {
        title: data.title,
        description: data.description,
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
        company_id: companyId ? Number(companyId) : undefined,
        questions: data.questions?.map(q => ({
          question: q.question,
          required: Boolean(q.required)
        }))
      };

      // Debug logging to see what data we're sending to backend
      console.log('JobCreationForm - Processed job data being sent to backend:', jobData);

      let result: JobListing;
      if (editJob) {
        result = await JobService.updateJob(editJob.id, jobData);
      } else {
        result = await JobService.createJob(jobData);
      }

      console.log('JobCreationForm - Backend response:', result);
      onJobCreated(result);
    } catch (error: any) {
      console.error('Error saving job:', error);
      
      let errorMessage = 'Failed to save job. Please try again.';
      
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
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };const watchedSkills = watch('required_skills') || [];
  const watchedPreferredSkills = watch('preferred_skills') || [];
  const watchedRequirements = watch('requirements') || [];
  const watchedBenefits = watch('benefits') || [];
  const watchedQuestions = watch('questions') || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editJob ? 'Edit Job' : 'Create New Job'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit as any)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                {...register('title', { required: 'Job title is required' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="e.g. Senior Frontend Developer"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Job Type */}
            <div>              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type *
              </label>
              <select
                {...register('job_type', { required: 'Job type is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            {/* Location Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Type *
              </label>
              <select
                {...register('location_type', { required: 'Location type is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"              >
                <option value="onsite">On-site</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                {...register('location', { required: 'Location is required' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="e.g. San Francisco, CA"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level *
              </label>
              <select
                {...register('experience_level', { required: 'Experience level is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"              >
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="lead">Lead</option>
                <option value="executive">Executive</option>
              </select>
            </div>

            {/* Category */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register('category_id', { required: 'Category is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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

          {/* Salary Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary Range
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <input
                  {...register('salary_min')}
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Min salary"
                />
              </div>
              <div>
                <input
                  {...register('salary_max')}
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Max salary"
                />
              </div>              <div>                <select
                  {...register('currency')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>                  <option value="CAD">CAD (C$)</option>
                  <option value="AUD">AUD (A$)</option>
                  <option value="SGD">SGD (S$)</option>
                </select>
              </div>
            </div>
          </div>          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Required Skills
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Add a skill"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                <FiPlus className="w-4 h-4" />
              </button>
            </div>
            {watchedSkills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {watchedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="ml-2 text-teal-600 hover:text-teal-800"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Preferred Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Skills (Nice to Have)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={preferredSkillInput}
                onChange={(e) => setPreferredSkillInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Add a preferred skill"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPreferredSkill())}
              />
              <button
                type="button"
                onClick={addPreferredSkill}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FiPlus className="w-4 h-4" />
              </button>
            </div>
            {watchedPreferredSkills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {watchedPreferredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removePreferredSkill(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              {...register('description', { required: 'Job description is required' })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Add a requirement (e.g., Bachelor's degree in Computer Science)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
              />
              <button
                type="button"
                onClick={addRequirement}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
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
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Benefits & Perks
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={benefitInput}
                onChange={(e) => setBenefitInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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

          {/* Application Questions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Application Questions
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Add a custom question"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addQuestion())}
              />
              <button
                type="button"
                onClick={addQuestion}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                <FiPlus className="w-4 h-4" />
              </button>
            </div>
            {watchedQuestions.length > 0 && (
              <div className="space-y-2">
                {watchedQuestions.map((question, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <span className="flex-1 text-sm">{question.question}</span>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={question.required}
                        onChange={(e) => updateQuestionRequired(index, e.target.checked)}
                        className="mr-1"
                      />
                      <span className="text-xs text-gray-600">Required</span>
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
            )}
          </div>          {/* Application Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application Deadline
            </label>
            <input
              {...register('application_deadline')}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              {...register('start_date')}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>          {/* Job Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Status
            </label>
            <select
              {...register('status', { required: 'Status is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="published">Published</option>
              <option value="paused">Paused</option>
              <option value="closed">Closed</option>
              <option value="expired">Expired</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center">              <input
                {...register('is_remote_friendly')}
                type="checkbox"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Remote work allowed
              </label>
            </div>
            <div className="flex items-center">
              <input
                {...register('urgent')}
                type="checkbox"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Mark as urgent
              </label>
            </div>
            <div className="flex items-center">
              <input
                {...register('featured')}
                type="checkbox"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Feature this job (additional cost may apply)
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : editJob ? 'Update Job' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobCreationForm;
