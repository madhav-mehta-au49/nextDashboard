import { useState, useEffect } from 'react';
import { companyService } from '@/services/companies/companyService';
import { toast } from 'react-hot-toast';

export const useCompanyDetails = (companySlug: string) => {
  const [company, setCompany] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setIsLoading(true);
        
        // Fetch company details
        const companyResponse = await companyService.getCompany(companySlug);
        setCompany(companyResponse.data);
        
        // Fetch company jobs
        const jobsResponse = await companyService.getCompanyJobs(companySlug);
        setJobs(jobsResponse.data || []);
        
        // Check if user is following/saved this company
        // This would typically come from your auth service or user profile
        // For now, we'll just set these to false
        setIsFollowing(false);
        setIsSaved(false);
        
        setError(null);
      } catch (err: any) {
        console.error('Error fetching company details:', err);
        setError(err.message || 'Failed to load company details');
        toast.error('Failed to load company details');
      } finally {
        setIsLoading(false);
      }
    };

    if (companySlug) {
      fetchCompanyDetails();
    }
  }, [companySlug]);

  const toggleFollow = async () => {
    try {
      if (isFollowing) {
        await companyService.unfollowCompany(companySlug);
        toast.success('Company unfollowed');
      } else {
        await companyService.followCompany(companySlug);
        toast.success('Company followed');
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error('Error toggling follow:', err);
      toast.error('Failed to update follow status');
    }
  };

  const toggleSave = async () => {
    try {
      if (isSaved) {
        await companyService.unsaveCompany(companySlug);
        toast.success('Company removed from saved');
      } else {
        await companyService.saveCompany(companySlug);
        toast.success('Company saved');
      }
      setIsSaved(!isSaved);
    } catch (err) {
      console.error('Error toggling save:', err);
      toast.error('Failed to update save status');
    }
  };

  const shareCompany = async () => {
    try {
      await companyService.shareCompany(companySlug);
      toast.success('Company share link generated');
      
      // In a real application, you might want to show a share dialog
      // or copy a link to clipboard
      if (navigator.share) {
        await navigator.share({
          title: company?.name,
          text: `Check out ${company?.name} on our platform!`,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      }
    } catch (err) {
      console.error('Error sharing company:', err);
      toast.error('Failed to share company');
    }
  };

  const contactCompany = async (contactData: any) => {
    try {
      await companyService.contactCompany(companySlug, contactData);
      toast.success('Message sent to company');
    } catch (err) {
      console.error('Error contacting company:', err);
      toast.error('Failed to send message');
    }
  };

  return {
    company,
    jobs,
    isLoading,
    error,
    isFollowing,
    isSaved,
    toggleFollow,
    toggleSave,
    shareCompany,
    contactCompany
  };
};

