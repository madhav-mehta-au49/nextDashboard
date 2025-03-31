import { useState, useEffect } from 'react';
import { Company, CompanyJob } from '../types';
import { mockCompanies, mockCompanyJobs } from '../utils/mockData';

export function useCompanyDetails(companyId: string) {
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<CompanyJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // Simulate API call with a delay
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      try {
        const foundCompany = mockCompanies.find(c => c.id === companyId);
        
        if (foundCompany) {
          setCompany(foundCompany);
          
          // Get company jobs from mock data
          const companyJobs = mockCompanyJobs[companyId] || [];
          setJobs(companyJobs);
          
          // Simulate user following status (random for demo)
          setIsFollowing(Math.random() > 0.5);
        } else {
          setError('Company not found');
        }
        
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load company details. Please try again later.');
        setIsLoading(false);
      }
    }, 800); // Simulate network delay
    
    return () => clearTimeout(timer);
  }, [companyId]);

  const toggleFollow = async () => {
    if (!company) return;
    
    // Simulate API call for following/unfollowing
    setIsFollowing(!isFollowing);
    
    // Update follower count
    setCompany(prev => prev ? {
      ...prev,
      followers: isFollowing ? prev.followers - 1 : prev.followers + 1
    } : null);
  };

  return { 
    company, 
    jobs, 
    isLoading, 
    error, 
    isFollowing, 
    toggleFollow 
  };
}
