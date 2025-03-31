import { useState, useEffect } from 'react';
import { Company, CompanyFilter } from '../types';
import { mockCompanies } from '../utils/mockData';

export function useCompanies(initialFilters?: CompanyFilter) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filters, setFilters] = useState<CompanyFilter>(initialFilters || {});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call with a delay
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      try {
        // Filter the mock data based on filters
        let filteredCompanies = [...mockCompanies];
        
        if (filters.industry) {
          filteredCompanies = filteredCompanies.filter(
            company => company.industry === filters.industry
          );
        }
        
        if (filters.size) {
          filteredCompanies = filteredCompanies.filter(
            company => company.size === filters.size
          );
        }
        
        if (filters.location) {
          filteredCompanies = filteredCompanies.filter(
            company => company.locations.some(
              loc => loc.city.includes(filters.location || '') || 
                    loc.country.includes(filters.location || '')
            )
          );
        }
        
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          filteredCompanies = filteredCompanies.filter(
            company => 
              company.name.toLowerCase().includes(searchLower) ||
              company.description.toLowerCase().includes(searchLower) ||
              company.industry.toLowerCase().includes(searchLower)
          );
        }
        
        setCompanies(filteredCompanies);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load companies. Please try again later.');
        setIsLoading(false);
      }
    }, 800); // Simulate network delay
    
    return () => clearTimeout(timer);
  }, [filters]);

  const updateFilters = (newFilters: Partial<CompanyFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return { companies, isLoading, error, filters, updateFilters };
}
