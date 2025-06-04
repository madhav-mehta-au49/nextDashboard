import { useState, useEffect, useCallback } from 'react';
import { 
  JobService, 
  JobListing, 
  JobSearchFilters, 
  JobSearchResult 
} from '@/app/services/jobs';

export interface UseJobSearchReturn {
  jobs: JobListing[];
  loading: boolean;
  error: string | null;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null;
  searchJobs: (filters: JobSearchFilters) => Promise<void>;
  loadMore: () => Promise<void>;
  clearResults: () => void;
  hasMore: boolean;
}

export const useJobSearch = (initialFilters?: JobSearchFilters): UseJobSearchReturn => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<UseJobSearchReturn['meta']>(null);
  const [currentFilters, setCurrentFilters] = useState<JobSearchFilters>(initialFilters || {});
  const searchJobs = useCallback(async (filters: JobSearchFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const result: JobSearchResult = await JobService.searchJobs(filters);
      
      setJobs(result.data);
      setMeta(result.meta);
      setCurrentFilters(filters);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search jobs');
      setJobs([]);
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
      const result: JobSearchResult = await JobService.searchJobs({
        ...currentFilters,
        page: nextPage
      });

      setJobs(prevJobs => [...prevJobs, ...result.data]);
      setMeta(result.meta);
      setCurrentFilters(prev => ({ ...prev, page: nextPage }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more jobs');
    } finally {
      setLoading(false);
    }
  }, [meta, currentFilters, loading]);

  const clearResults = useCallback(() => {
    setJobs([]);
    setMeta(null);
    setError(null);
    setCurrentFilters({});
  }, []);

  const hasMore = meta ? meta.current_page < meta.last_page : false;

  // Initial search if filters are provided
  useEffect(() => {
    if (initialFilters && Object.keys(initialFilters).length > 0) {
      searchJobs(initialFilters);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    jobs,
    loading,
    error,
    meta,
    searchJobs,
    loadMore,
    clearResults,
    hasMore
  };
};

export interface UseJobReturn {
  job: JobListing | null;
  loading: boolean;
  error: string | null;
  fetchJob: (id: number) => Promise<void>;
  clearJob: () => void;
}

export const useJob = (jobId?: number): UseJobReturn => {
  const [job, setJob] = useState<JobListing | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const jobData = await JobService.getJob(id);
      setJob(jobData);
      
      // Track job view
      JobService.trackJobView(id).catch(() => {
        // Silently fail if tracking fails
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch job');
      setJob(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearJob = useCallback(() => {
    setJob(null);
    setError(null);
  }, []);

  // Fetch job if ID is provided
  useEffect(() => {
    if (jobId) {
      fetchJob(jobId);
    }
  }, [jobId, fetchJob]);

  return {
    job,
    loading,
    error,
    fetchJob,
    clearJob
  };
};

export interface UseJobRecommendationsReturn {
  recommendations: JobListing[];
  loading: boolean;
  error: string | null;
  fetchRecommendations: (limit?: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useJobRecommendations = (initialLimit: number = 10): UseJobRecommendationsReturn => {
  const [recommendations, setRecommendations] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(initialLimit);

  const fetchRecommendations = useCallback(async (newLimit?: number) => {
    const targetLimit = newLimit || limit;
    setLoading(true);
    setError(null);

    try {
      const recs = await JobService.getRecommendations(targetLimit);
      setRecommendations(recs.map(rec => rec.job));
      setLimit(targetLimit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const refresh = useCallback(() => {
    return fetchRecommendations(limit);
  }, [fetchRecommendations, limit]);

  // Initial fetch
  useEffect(() => {
    fetchRecommendations();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    recommendations,
    loading,
    error,
    fetchRecommendations,
    refresh
  };
};

export interface UseSavedJobsReturn {
  savedJobs: JobListing[];
  loading: boolean;
  error: string | null;
  saveJob: (jobId: number) => Promise<void>;
  unsaveJob: (jobId: number) => Promise<void>;
  isJobSaved: (jobId: number) => boolean;
  fetchSavedJobs: () => Promise<void>;
}

export const useSavedJobs = (): UseSavedJobsReturn => {
  const [savedJobs, setSavedJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedJobs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const saved = await JobService.getSavedJobs();
      setSavedJobs(saved.map(item => item.job_listing));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch saved jobs');
      setSavedJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveJob = useCallback(async (jobId: number) => {
    try {
      await JobService.saveJob(jobId);
      await fetchSavedJobs(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save job');
      throw err;
    }
  }, [fetchSavedJobs]);

  const unsaveJob = useCallback(async (jobId: number) => {
    try {
      await JobService.unsaveJob(jobId);
      setSavedJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unsave job');
      throw err;
    }
  }, []);

  const isJobSaved = useCallback((jobId: number) => {
    return savedJobs.some(job => job.id === jobId);
  }, [savedJobs]);

  // Initial fetch
  useEffect(() => {
    fetchSavedJobs();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    savedJobs,
    loading,
    error,
    saveJob,
    unsaveJob,
    isJobSaved,
    fetchSavedJobs
  };
};
