import React from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Clock, 
  Users, 
  DollarSign, 
  ArrowRight,
  Briefcase
} from 'lucide-react';
import { CompanyJob } from '../../types';

interface CompanyJobsListProps {
  jobs: CompanyJob[];
  companyName: string;
}

export const CompanyJobsList: React.FC<CompanyJobsListProps> = ({ jobs, companyName }) => {
  if (jobs.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
        <div className="flex flex-col items-center">
          <Briefcase className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No open positions
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {companyName} doesn't have any active job postings at the moment. Check back later for new opportunities or follow the company to get updates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'} at {companyName}
      </h3>
      
      <div className="space-y-4">
        {jobs.map(job => (
          <div 
            key={job.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {job.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {companyName}
                  </p>
                </div>
                
                <span className={`
                  inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${job.type === 'Full-time' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                    job.type === 'Part-time' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 
                    job.type === 'Contract' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : 
                    job.type === 'Internship' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
                    'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'}
                `}>
                  {job.type}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {job.description}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center text-gray-500 dark:text-gray-400 min-w-[120px]">
                  <MapPin className="h-4 w-4 mr-1.5" />
                  <span className="text-sm">
                    {job.isRemote ? 'Remote' : job.location}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-500 dark:text-gray-400 min-w-[120px]">
                  <Clock className="h-4 w-4 mr-1.5" />
                  <span className="text-sm">
                    Posted {formatDate(job.postedDate)}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-500 dark:text-gray-400 min-w-[120px]">
                  <Users className="h-4 w-4 mr-1.5" />
                  <span className="text-sm">
                    {job.applicantsCount} applicants
                  </span>
                </div>
                
                {job.salary && (
                  <div className="flex items-center text-gray-500 dark:text-gray-400 min-w-[120px]">
                    <DollarSign className="h-4 w-4 mr-1.5" />
                    <span className="text-sm">
                      {formatSalary(job.salary)}
                    </span>
                  </div>
                )}
              </div>
              
              <hr className="my-4 border-gray-200 dark:border-gray-700" />
              
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {job.isRemote && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                      Remote
                    </span>
                  )}
                  
                  {job.applicationDeadline && (
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${isDeadlineSoon(job.applicationDeadline) 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}
                    `}>
                      {isDeadlineSoon(job.applicationDeadline) 
                        ? "Closing soon" 
                        : `Closes ${formatDate(job.applicationDeadline)}`}
                    </span>
                  )}
                </div>
                
                <Link 
                  href={`/jobs/${job.id}`}
                  className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-sm font-medium transition-colors duration-200 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white"
                >
                  View Job
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper functions
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

function formatSalary(salary: { min: number; max: number; currency: string }): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: salary.currency,
    maximumFractionDigits: 0,
  });
  
  return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
}

function isDeadlineSoon(dateString: string): boolean {
  const deadline = new Date(dateString);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays <= 3 && diffDays >= 0;
}
