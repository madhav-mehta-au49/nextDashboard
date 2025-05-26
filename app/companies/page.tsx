"use client"

import React, { useState, useEffect } from "react";
import { CompanyActions } from "./components/directory/CompanyActions";
import { CompanyFilterMenu } from "./components/directory/CompanyFilterMenu";
import { CompanySort } from "./components/directory/CompanySort";
import { RightSidebarCard } from "./components/directory/SideCards";
import Footer from '@/components/footer';
import SubHeader from '@/components/subheader';
import { CompanyCard } from "./components/directory/CompanyCard";
import Link from "next/link";
import Header from "../web/components/header";
import EmployeeHeader from "@/components/EmployeeHeader";
import { useRouter } from "next/navigation";
import { companyService } from "@/services/companies/companyService";

// Define the CompanyFilter interface for type safety
export interface CompanyFilter {
  sort_by?: string;
  industry?: string;
  size?: string;
  location?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export default function CompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState<CompanyFilter>({
    sort_by: 'name_asc',
    page: 1,
    per_page: 10
  });

  // Fetch companies when filters change
  useEffect(() => {
    fetchCompanies();
  }, [filters]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await companyService.getCompanies(filters);
      console.log('API Response:', response); // Log the response for debugging

      if (response && response.status === 'success') {
        // Check the structure of the data
        if (response.data && Array.isArray(response.data.data)) {
          // If the data is nested in data.data (pagination structure)
          setCompanies(response.data.data);
        } else if (Array.isArray(response.data)) {
          // If data is directly in data array
          setCompanies(response.data);
        } else {
          console.error('Unexpected data structure:', response);
          setCompanies([]);
          setError('Unexpected data structure received from API');
        }
      } else {
        setError(response?.message || 'An error occurred while fetching companies');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching companies');
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (sortBy: string) => {
    setFilters(prev => ({ ...prev, sort_by: sortBy, page: 1 }));
  };

  const handleFilterChange = (newFilters: Partial<CompanyFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleCompanyAction = async (action: string, companyId: string) => {
    try {
      let success = false;
      let message = '';

      if (action === 'save') {
        const response = await companyService.saveCompany(companyId);
        success = response?.status === 'success';
        message = 'Company added to favorites';
      } else if (action === 'unsave') {
        const response = await companyService.unsaveCompany(companyId);
        success = response?.status === 'success';
        message = 'Company removed from favorites';
      } else if (action === 'share') {
        if (navigator.share) {
          await navigator.share({
            title: 'Check out this company',
            text: 'I found this interesting company!',
            url: window.location.origin + `/companies/${companyId}`,
          });
          success = true;
          message = 'Company shared successfully';
        } else {
          const url = window.location.origin + `/companies/${companyId}`;
          await navigator.clipboard.writeText(url);
          success = true;
          message = 'Link copied to clipboard';
        }
      } else if (action === 'contact') {
        // Just log for now - would implement actual contact form in a real app
        console.log(`Contact company ${companyId}`);
        success = true;
        message = 'Contact feature is coming soon';
      }

      // Show success message using toast or other notification
      if (success) {
        // Refresh companies list to show updated state
        fetchCompanies();
      }
    } catch (err) {
      console.error('Error performing company action:', err);
      
      // Show error message using toast or other notification
    }
  };

  // Data for the right sidebar - this could be fetched from an API in the future
  const testimonials = [
    { id: "1", user: "John Smith", feedback: "Found my dream job through this platform!" },
    { id: "2", user: "Sarah Johnson", feedback: "The company profiles are detailed and accurate." },
  ];

  const events = [
    { id: "1", title: "Tech Career Fair", date: "2023-11-15", location: "Virtual" },
    { id: "2", title: "Networking Mixer", date: "2023-11-20", location: "New York" },
  ];

  const feedItems = [
    { id: "1", title: "TechCorp is hiring!", content: "10 new positions open", time: "2 hours ago" },
    { id: "2", title: "HealthPlus featured in Forbes", content: "Recognized for innovation", time: "1 day ago" },
    { id: "3", title: "GreenEarth wins sustainability award", content: "Industry recognition", time: "3 days ago" },
  ];

  const trendingBlogs = [
    { id: "1", title: "How to Stand Out in Tech Interviews", link: "/blog/tech-interviews", href: "/blog/tech-interviews" },
    { id: "2", title: "The Future of Remote Work", link: "/blog/remote-work-future", href: "/blog/remote-work-future" },
  ];

  return (
    <>
      <Header />
      <EmployeeHeader />
      <SubHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Company Creation CTA Banner */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Represent your company?</h2>
              <p className="text-teal-100">Create a company profile to attract top talent and showcase your brand.</p>
            </div>
            <Link
              href="/companies/create"
              className="mt-4 md:mt-0 px-6 py-3 bg-white text-teal-600 hover:bg-teal-50 font-medium rounded-md shadow-sm transition-colors"
            >
              Create Company Profile
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 px-4">
          <h1 className="text-2xl font-bold text-teal-700 mb-4 md:mb-0">Companies</h1>
          <div className="flex gap-4">
            <CompanyFilterMenu onFilterChange={handleFilterChange} />
            <CompanySort
              sortBy={filters.sort_by || 'name_asc'}
              onSortChange={handleSortChange}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p>{error}</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-3/4 space-y-6">
              {companies.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    We couldn't find any companies matching your criteria. Try adjusting your filters or search terms.
                  </p>
                </div>
              ) : (
                companies.map((company) => (
                  <div key={company.id} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <CompanyCard
                        name={company.name}
                        description={company.description}
                        rating={company.rating || 0}
                        industry={company.industry}
                        logoUrl={company.logo_url || '/images/placeholder-logo.png'}
                        location={company.headquarters}
                        hashtags={company.specialties || []}
                        isFollowing={company.is_following}
                        isSaved={company.is_saved}
                        onBookmark={() => handleCompanyAction(company.is_saved ? 'unsave' : 'save', company.id)}
                        onShare={() => console.log(`Share ${company.name}`)}
                        onContact={() => console.log(`Contact ${company.name}`)}
                        onViewProfile={() => router.push(`/companies/${company.slug || company.id}`)}
                        onFollow={() => handleCompanyAction(company.is_following ? 'unfollow' : 'follow', company.id)}
                      />
                    </div>
                    <div className="hidden md:block">
                      <CompanyActions
                        companyId={company.id}
                        isFollowing={company.is_following}
                        isSaved={company.is_saved}
                        onFollow={() => handleCompanyAction(company.is_following ? 'unfollow' : 'follow', company.id)}
                        onSave={() => handleCompanyAction(company.is_saved ? 'unsave' : 'save', company.id)}
                        onShare={() => console.log(`Share ${company.name}`)}
                        onContact={() => console.log(`Contact ${company.name}`)}
                      />
                    </div>
                  </div>
                ))
              )}

              {/* Pagination */}
              {companies.length > 0 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(Math.max(1, (filters.page || 1) - 1))}
                      disabled={(filters.page || 1) <= 1}
                      className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 rounded-md bg-teal-50 text-teal-700 border border-teal-300">
                      {filters.page || 1}
                    </span>
                    <button
                      onClick={() => handlePageChange((filters.page || 1) + 1)}
                      className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </div>
            <div className="w-full lg:w-1/4">
              <RightSidebarCard
                testimonials={testimonials}
                events={events}
                feedItems={feedItems}
                trendingBlogs={trendingBlogs}
              />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
