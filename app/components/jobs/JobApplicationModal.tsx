"use client";

import { useState, useRef } from 'react';
import { FiX, FiUpload, FiCheck, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useJobApplication } from '@/hooks/useJobApplications';
import { JobListing, ApplicationQuestion } from '@/app/user/types/jobs';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobListing;
  onApplicationSubmitted?: () => void;
}

export default function JobApplicationModal({ 
  isOpen, 
  onClose, 
  job, 
  onApplicationSubmitted 
}: JobApplicationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Personal Information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  
  // Step 2: Professional Information
  const [currentJobTitle, setCurrentJobTitle] = useState('');
  const [currentCompany, setCurrentCompany] = useState('');
  const [totalExperience, setTotalExperience] = useState('');
  const [relevantExperience, setRelevantExperience] = useState('');
  const [currentSalary, setCurrentSalary] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('');
  const [workType, setWorkType] = useState('');
  const [willRelocate, setWillRelocate] = useState('');
  
  // Step 3: Documents & Cover Letter
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  
  // Step 4: Application Details
  const [salaryExpectation, setSalaryExpectation] = useState('');
  const [availabilityDate, setAvailabilityDate] = useState('');
  const [motivationLetter, setMotivationLetter] = useState('');
  const [keyStrengths, setKeyStrengths] = useState<string[]>(['']);
  const [careerGoals, setCareerGoals] = useState('');
  
  // Step 5: Company Questions (if any)
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverLetterFileRef = useRef<HTMLInputElement>(null);
  const additionalFilesRef = useRef<HTMLInputElement>(null);

  const { submitApplication, loading, error } = useJobApplication();

  const totalSteps = job.questions && job.questions.length > 0 ? 5 : 4;
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateFile(file)) {
      setResumeFile(file);
    }
  };

  const handleCoverLetterFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateFile(file)) {
      setCoverLetterFile(file);
    }
  };

  const handleAdditionalFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => validateFile(file));
    
    if (validFiles.length + additionalFiles.length > 3) {
      alert('You can upload maximum 3 additional files');
      return;
    }
    
    setAdditionalFiles(prev => [...prev, ...validFiles]);
  };

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      alert('Please upload a PDF, DOC, or DOCX file');
      return false;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return false;
    }
    
    return true;
  };

  const removeAdditionalFile = (index: number) => {
    setAdditionalFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addKeyStrength = () => {
    if (keyStrengths.length < 5) {
      setKeyStrengths(prev => [...prev, '']);
    }
  };

  const removeKeyStrength = (index: number) => {
    if (keyStrengths.length > 1) {
      setKeyStrengths(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateKeyStrength = (index: number, value: string) => {
    setKeyStrengths(prev => prev.map((strength, i) => i === index ? value : strength));
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        // Personal Information - all required
        return firstName.trim() !== '' && 
               lastName.trim() !== '' && 
               email.trim() !== '' && 
               phone.trim() !== '' && 
               currentLocation.trim() !== '';
      
      case 2:
        // Professional Information - most required
        return totalExperience.trim() !== '' && 
               workType !== '' && 
               noticePeriod !== '' &&
               willRelocate !== '';
      
      case 3:
        // Documents - resume is required
        return resumeFile !== null;
      
      case 4:
        // Application Details - salary and availability required
        return salaryExpectation.trim() !== '' && 
               availabilityDate !== '' &&
               motivationLetter.trim() !== '' &&
               keyStrengths.some(strength => strength.trim() !== '');
      
      case 5:
        // Company Questions - validate required questions
        if (!job.questions) return true;
        
        const requiredQuestions = job.questions.filter(q => q.is_required);
        return requiredQuestions.every(q => answers[q.id] && answers[q.id]?.trim() !== '');
      
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      alert('Please complete all required fields before proceeding');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      alert('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !currentLocation.trim()) {
        throw new Error('Please fill in all required personal information fields.');
      }

      if (!currentJobTitle.trim() || !currentCompany.trim()) {
        throw new Error('Please fill in your current job title and company.');
      }

      if (!resumeFile) {
        throw new Error('Please upload your resume.');
      }

      // Prepare answers array for submission
      const questionAnswers = job.questions ? job.questions
        .filter(q => answers[q.id] && answers[q.id]?.trim())
        .map(q => ({
          question_id: q.id,
          answer: answers[q.id]!.trim()
        })) : [];

      // Filter out empty key strengths
      const filteredKeyStrengths = keyStrengths.filter(strength => strength.trim() !== '');

      const applicationData = {
        job_listing_id: job.id,
        
        // Personal Information
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        current_location: currentLocation.trim(),
        linkedin_url: linkedinUrl.trim() || undefined,
        portfolio_url: portfolioUrl.trim() || undefined,
        
        // Professional Information
        current_job_title: currentJobTitle.trim(),
        current_company: currentCompany.trim(),
        total_experience: totalExperience || undefined,
        relevant_experience: relevantExperience || undefined,
        current_salary: currentSalary ? parseInt(currentSalary) : undefined,
        notice_period: noticePeriod || undefined,
        work_type_preference: workType || undefined,
        willing_to_relocate: willRelocate !== undefined ? willRelocate : '',
        
        // Application Details
        cover_letter: coverLetter.trim() || undefined,
        salary_expectation: salaryExpectation ? parseInt(salaryExpectation) : undefined,
        availability_date: availabilityDate || undefined,
        motivation_letter: motivationLetter.trim() || undefined,
        key_strengths: keyStrengths.filter(strength => strength.trim() !== ''),
        career_goals: careerGoals.trim() || undefined,
        
        // Company Questions
        answers: questionAnswers.length > 0 ? questionAnswers : undefined,
        
        // File uploads
        resume_file: resumeFile,
        cover_letter_file: coverLetterFile || undefined,
        additional_files: additionalFiles.length > 0 ? additionalFiles : undefined
      };      try {
        await submitApplication(applicationData);
        
        // Success - close modal and notify parent
        onClose();
        onApplicationSubmitted?.();
        
        // Show success message
        alert('Your application has been submitted successfully! You will receive a confirmation email shortly.');
        
      } catch (err: any) {
        console.error('Application submission error:', err);
        
        // Handle validation errors from the backend
        if (err.response?.data?.errors) {
          const errorMessages = Object.entries(err.response.data.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          
          alert('Please correct the following errors:\n\n' + errorMessages);
        } else if (err.response?.data?.message) {
          alert(err.response.data.message);
        } else {
          alert(err.message || 'Failed to submit application. Please try again.');
        }
      }
    } catch (err) {
      console.error('Form validation error:', err);
      alert(err instanceof Error ? err.message : 'Please ensure all required fields are filled correctly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFileUploadArea = () => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {resumeFile ? (
        <div className="space-y-2">
          <FiCheck className="mx-auto h-8 w-8 text-green-500" />
          <p className="text-sm font-medium text-gray-900">{resumeFile.name}</p>
          <p className="text-xs text-gray-500">
            {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm text-teal-600 hover:text-teal-700"
          >
            Replace file
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <FiUpload className="mx-auto h-8 w-8 text-gray-400" />
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              Click to upload
            </button>
            <p className="text-xs text-gray-500">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">
            PDF, DOC, DOCX up to 5MB
          </p>
        </div>
      )}
    </div>
  );
  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="Enter your first name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="Enter your last name"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="your.email@example.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="+91 98765 43210"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Location <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={currentLocation}
          onChange={(e) => setCurrentLocation(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="City, State, Country"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn Profile (Optional)
          </label>
          <input
            type="url"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Portfolio/Website (Optional)
          </label>
          <input
            type="url"
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="https://yourportfolio.com"
          />
        </div>
      </div>
    </div>
  );
  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Job Title
          </label>
          <input
            type="text"
            value={currentJobTitle}
            onChange={(e) => setCurrentJobTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="e.g., Senior Software Engineer"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Company
          </label>
          <input
            type="text"
            value={currentCompany}
            onChange={(e) => setCurrentCompany(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="e.g., Tech Company Ltd"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Experience <span className="text-red-500">*</span>
          </label>
          <select
            value={totalExperience}
            onChange={(e) => setTotalExperience(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            required
          >
            <option value="">Select experience</option>
            <option value="0-1">0-1 years</option>
            <option value="1-3">1-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5-8">5-8 years</option>
            <option value="8-12">8-12 years</option>
            <option value="12+">12+ years</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Relevant Experience
          </label>
          <select
            value={relevantExperience}
            onChange={(e) => setRelevantExperience(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="">Select relevant experience</option>
            <option value="0-1">0-1 years</option>
            <option value="1-3">1-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5-8">5-8 years</option>
            <option value="8-12">8-12 years</option>
            <option value="12+">12+ years</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Salary (Optional)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">₹</span>
            <input
              type="number"
              value={currentSalary}
              onChange={(e) => setCurrentSalary(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="0"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Annual salary in INR</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notice Period <span className="text-red-500">*</span>
          </label>
          <select
            value={noticePeriod}
            onChange={(e) => setNoticePeriod(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            required
          >
            <option value="">Select notice period</option>
            <option value="immediate">Immediate</option>
            <option value="15-days">15 days</option>
            <option value="1-month">1 month</option>
            <option value="2-months">2 months</option>
            <option value="3-months">3 months</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Work Type <span className="text-red-500">*</span>
          </label>
          <select
            value={workType}
            onChange={(e) => setWorkType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            required
          >
            <option value="">Select work type</option>
            <option value="onsite">On-site</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="any">Any</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Willing to Relocate? <span className="text-red-500">*</span>
          </label>          <select
            value={willRelocate}
            onChange={(e) => setWillRelocate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            required
          >
            <option value="">Select option</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="depends">Depends</option>
          </select>
        </div>
      </div>
    </div>
  );
  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Documents & Cover Letter</h3>
      
      {/* Resume Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Resume <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Upload your most recent resume to apply for this position.
        </p>
        {renderFileUploadArea()}
      </div>

      {/* Cover Letter File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cover Letter File (Optional)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input
            ref={coverLetterFileRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleCoverLetterFileChange}
            className="hidden"
          />
          
          {coverLetterFile ? (
            <div className="space-y-2">
              <FiCheck className="mx-auto h-6 w-6 text-green-500" />
              <p className="text-sm font-medium text-gray-900">{coverLetterFile.name}</p>
              <p className="text-xs text-gray-500">
                {(coverLetterFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button
                type="button"
                onClick={() => coverLetterFileRef.current?.click()}
                className="text-sm text-teal-600 hover:text-teal-700"
              >
                Replace file
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <FiUpload className="mx-auto h-6 w-6 text-gray-400" />
              <div>
                <button
                  type="button"
                  onClick={() => coverLetterFileRef.current?.click()}
                  className="text-sm font-medium text-teal-600 hover:text-teal-700"
                >
                  Click to upload cover letter
                </button>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 5MB</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cover Letter Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cover Letter Message (Optional)
        </label>
        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          rows={6}
          maxLength={2000}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="Tell us why you're interested in this position and what makes you a great fit..."
        />
        <p className="text-xs text-gray-500 mt-1">
          {coverLetter.length}/2000 characters
        </p>
      </div>

      {/* Additional Files */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Documents (Optional)
        </label>
        <p className="text-sm text-gray-600 mb-2">
          Upload portfolio, certificates, or other relevant documents (max 3 files)
        </p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input
            ref={additionalFilesRef}
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleAdditionalFilesChange}
            multiple
            className="hidden"
          />
          
          <div className="space-y-2">
            <FiUpload className="mx-auto h-6 w-6 text-gray-400" />
            <div>
              <button
                type="button"
                onClick={() => additionalFilesRef.current?.click()}
                className="text-sm font-medium text-teal-600 hover:text-teal-700"
                disabled={additionalFiles.length >= 3}
              >
                Click to upload additional files
              </button>
              <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG up to 5MB each</p>
            </div>
          </div>
        </div>

        {/* Display uploaded additional files */}
        {additionalFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
            {additionalFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-2">
                  <FiCheck className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-900">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeAdditionalFile(index)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Application Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salary Expectation <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">₹</span>
            <input
              type="number"
              value={salaryExpectation}
              onChange={(e) => setSalaryExpectation(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="0"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Annual salary expectation in INR</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Availability Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={availabilityDate}
            onChange={(e) => setAvailabilityDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">When can you start working?</p>
        </div>
      </div>        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Why are you interested in this role? <span className="text-red-500">*</span>
          </label>
          <textarea
            value={motivationLetter}
            onChange={(e) => setMotivationLetter(e.target.value)}
            rows={4}
            maxLength={1000}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="Tell us what motivates you to apply for this position..."
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {motivationLetter.length}/1000 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Key Strengths <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-gray-600 mb-3">
            List your top skills and strengths relevant to this position (max 5)
          </p>
          
          <div className="space-y-2">
            {keyStrengths.map((strength, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={strength}
                  onChange={(e) => updateKeyStrength(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder={`Strength ${index + 1}`}
                />
                {keyStrengths.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeKeyStrength(index)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            
            {keyStrengths.length < 5 && (
              <button
                type="button"
                onClick={addKeyStrength}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                + Add another strength
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Career Goals (Optional)
          </label>
          <textarea
            value={careerGoals}
            onChange={(e) => setCareerGoals(e.target.value)}
            rows={3}
            maxLength={500}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="Where do you see yourself in the next 2-3 years?"
          />
          <p className="text-xs text-gray-500 mt-1">
            {careerGoals.length}/500 characters
          </p>
        </div>
      </div>
    );

  const renderStep5 = () => {
    if (!job.questions || job.questions.length === 0) {
      return (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">No Additional Questions</h3>
          <p className="text-gray-600">This employer hasn't added any specific questions.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Company Questions</h3>
        <p className="text-sm text-gray-600 mb-4">
          Please answer the following questions from the employer.
        </p>
        
        {job.questions.map((question) => (
          <div key={question.id}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {question.question_text}
              {question.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {question.question_type === 'textarea' ? (
              <textarea
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Your answer..."
                required={question.is_required}
              />
            ) : question.question_type === 'select' && question.options ? (
              <select
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                required={question.is_required}
              >
                <option value="">Select an option</option>
                {question.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : question.question_type === 'boolean' ? (
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`question_${question.id}`}
                    value="yes"
                    checked={answers[question.id] === 'yes'}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`question_${question.id}`}
                    value="no"
                    checked={answers[question.id] === 'no'}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            ) : (
              <input
                type="text"
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Your answer..."
                required={question.is_required}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Apply for {job.title}</h2>
            <p className="text-sm text-gray-600">{job.company.name} • {job.location}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-500">
              {currentStep === 1 && 'Personal Information'}
              {currentStep === 2 && 'Professional Details'}
              {currentStep === 3 && 'Documents & Cover Letter'}
              {currentStep === 4 && 'Application Details'}
              {currentStep === 5 && 'Company Questions'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-teal-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50 flex-shrink-0">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={!validateStep(currentStep)}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <FiArrowRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !validateStep(currentStep)}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
