import { useState, useEffect, useCallback } from 'react';
import { 
  JobApplicationService, 
  JobApplication, 
  ApplicationFilters,
  JobApplicationData,
  ApplicationAnalytics
} from '../app/services/jobs';

export interface UseJobApplicationsReturn {
  applications: JobApplication[];
  loading: boolean;
  error: string | null;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null;
  fetchApplications: (filters?: ApplicationFilters) => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export const useJobApplications = (initialFilters?: ApplicationFilters): UseJobApplicationsReturn => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<UseJobApplicationsReturn['meta']>(null);
  const [currentFilters, setCurrentFilters] = useState<ApplicationFilters>(initialFilters || {});
  const fetchApplications = useCallback(async (filters?: ApplicationFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await JobApplicationService.getApplications({
        ...filters,
        page: 1 // Reset to first page for new fetch
      });
      
      if (result.data) {
        setApplications(result.data);
        setMeta(result.meta);
        setCurrentFilters({ ...filters, page: 1 });
      } else {
        // Handle case where data is not in expected format
        console.error('Unexpected API response format:', result);
        setApplications([]);
        setMeta(null);
        setError('Received invalid data format from the server');
      }
    } catch (err) {
      console.error('Error in useJobApplications hook:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
      setApplications([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!meta || meta.current_page >= meta.last_page || loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const nextPage = meta.current_page + 1;
      const result = await JobApplicationService.getApplications({
        ...currentFilters,
        page: nextPage
      });

      setApplications(prev => [...prev, ...result.data]);
      setMeta(result.meta);
      setCurrentFilters(prev => ({ ...prev, page: nextPage }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more applications');
    } finally {
      setLoading(false);
    }
  }, [meta, currentFilters, loading]);

  const hasMore = meta ? meta.current_page < meta.last_page : false;

  // Initial fetch
  useEffect(() => {
    fetchApplications(initialFilters);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    applications,
    loading,
    error,
    meta,
    fetchApplications,
    loadMore,
    hasMore
  };
};

export interface UseJobApplicationReturn {
  application: JobApplication | null;
  loading: boolean;
  error: string | null;
  submitApplication: (data: JobApplicationData) => Promise<JobApplication>;
  updateApplication: (id: number, data: Partial<JobApplicationData>) => Promise<JobApplication>;
  withdrawApplication: (id: number) => Promise<void>;
  deleteApplication: (id: number) => Promise<void>;
  fetchApplication: (id: number) => Promise<void>;
}

export const useJobApplication = (): UseJobApplicationReturn => {
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitApplication = useCallback(async (data: JobApplicationData): Promise<JobApplication> => {
    setLoading(true);
    setError(null);

    try {
      const newApplication = await JobApplicationService.submitApplication(data);
      setApplication(newApplication);
      return newApplication;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit application';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateApplication = useCallback(async (
    id: number, 
    data: Partial<JobApplicationData>
  ): Promise<JobApplication> => {
    setLoading(true);
    setError(null);

    try {
      const updatedApplication = await JobApplicationService.updateApplication(id, data);
      setApplication(updatedApplication);
      return updatedApplication;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update application';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const withdrawApplication = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await JobApplicationService.withdrawApplication(id);
      if (application && application.id === id) {
        setApplication({ ...application, status: 'withdrawn' });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to withdraw application';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [application]);

  const deleteApplication = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await JobApplicationService.deleteApplication(id);
      if (application && application.id === id) {
        setApplication(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete application';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [application]);

  const fetchApplication = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const app = await JobApplicationService.getApplication(id);
      setApplication(app);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch application';
      setError(errorMessage);
      setApplication(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    application,
    loading,
    error,
    submitApplication,
    updateApplication,
    withdrawApplication,
    deleteApplication,
    fetchApplication
  };
};

export interface UseApplicationAnalyticsReturn {
  analytics: ApplicationAnalytics | null;
  loading: boolean;
  error: string | null;
  fetchAnalytics: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useApplicationAnalytics = (): UseApplicationAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<ApplicationAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await JobApplicationService.getApplicationAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    return fetchAnalytics();
  }, [fetchAnalytics]);

  // Initial fetch
  useEffect(() => {
    fetchAnalytics();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
    refresh
  };
};

export interface UseApplicationStatusReturn {
  updating: boolean;
  error: string | null;
  updateStatus: (id: number, status: 'pending' | 'reviewing' | 'interviewed' | 'offered' | 'hired' | 'rejected', notes?: string) => Promise<void>;
  bulkUpdateStatus: (applicationIds: number[], status: 'pending' | 'reviewing' | 'interviewed' | 'offered' | 'hired' | 'rejected', notes?: string) => Promise<void>;
}

export const useApplicationStatus = (): UseApplicationStatusReturn => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = useCallback(async (
    id: number, 
    status: 'pending' | 'reviewing' | 'interviewed' | 'offered' | 'hired' | 'rejected', 
    notes?: string
  ) => {
    setUpdating(true);
    setError(null);

    try {
      await JobApplicationService.updateApplicationStatus(id, status, notes);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update status';
      setError(errorMessage);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, []);  const bulkUpdateStatus = useCallback(async (
    applicationIds: number[], 
    status: 'pending' | 'reviewing' | 'interviewed' | 'offered' | 'hired' | 'rejected', 
    notes?: string
  ) => {
    setUpdating(true);
    setError(null);

    try {
      await JobApplicationService.bulkUpdateStatus({ 
        application_ids: applicationIds, 
        status,
        notes 
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to bulk update status';
      setError(errorMessage);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, []);

  return {
    updating,
    error,
    updateStatus,
    bulkUpdateStatus
  };
};

export interface UseApplicationByJobReturn {
  applications: JobApplication[];
  loading: boolean;
  error: string | null;
  fetchJobApplications: (jobId: number, filters?: ApplicationFilters) => Promise<void>;
  hasApplicationFromUser: (userId: number) => boolean;
}

export const useApplicationsByJob = (): UseApplicationByJobReturn => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobApplications = useCallback(async (jobId: number, filters?: ApplicationFilters) => {
    setLoading(true);
    setError(null);

    try {
      const result = await JobApplicationService.getJobApplications(jobId, filters);
      setApplications(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch job applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const hasApplicationFromUser = useCallback((userId: number) => {
    return applications.some(app => app.candidate?.user_id === userId);
  }, [applications]);

  return {
    applications,
    loading,
    error,
    fetchJobApplications,
    hasApplicationFromUser
  };
};
