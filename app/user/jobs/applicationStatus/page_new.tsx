"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiSearch, FiArrowLeft, FiExternalLink, FiCheck, FiClock, FiEye, FiUsers, FiLoader } from 'react-icons/fi';
import JobListingCard from "../../components/jobs/jobCard";
import Header from "../../../web/components/header";
import SubHeader from "../../../../components/subheader";
import Footer from "../../../../components/footer";
import EmployeeHeader from '@/components/EmployeeHeader';
import ApplicationStatusTimeline from "../../components/applications/ApplicationStatusTimeline";
import { useJobApplications } from '@/hooks/useJobApplications';
import { JobApplication } from '@/app/user/types/jobs';

// Utility function for creating SEO-friendly URLs
const createJobUrl = (jobId: string, jobTitle: string): string => {
  const slug = jobTitle
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
  return `/user/jobs/${jobId}/${slug}`;
};

export default function ApplyHistoryPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('applies');
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);

  // Use the hook to fetch real job applications
  const { applications, loading, error, fetchApplications } = useJobApplications();

  // Fetch applications on component mount
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Convert backend JobApplication data to display format
  const jobApplications = applications.map((app: JobApplication) => ({
    id: app.id.toString(),
    title: app.job_listing?.title || 'Unknown Position',
    company: app.job_listing?.company?.name || 'Unknown Company',
    dateApplied: app.applied_at ? new Date(app.applied_at).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) : 'Unknown Date',
    dateSent: app.applied_at ? new Date(app.applied_at).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) : 'Unknown Date',
    status: app.status.charAt(0).toUpperCase() + app.status.slice(1),
    recruiterActive: 'Unknown', // This would need additional API data
    logoUrl: app.job_listing?.company?.logo || 'https://via.placeholder.com/150',
    actualApplication: app // Store the full application object
  }));

  const similarJobs = [
    {
      id: "3",
      title: "Frontend Developer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      logoUrl: "https://via.placeholder.com/150",
      jobUrl: "https://example.com/job/2",
      description: "We are looking for a skilled Frontend Developer with 3+ years of experience in JavaScript and React."
    },
    {
      id: "4",
      title: "Backend Developer",
      company: "Health Solutions",
      location: "Boston, MA",
      logoUrl: "https://via.placeholder.com/150",
      jobUrl: "https://example.com/job/3",
      description: "Join our team as a Backend Developer to lead the development of innovative healthcare solutions."
    },
    {
      id: "5",
      title: "Full Stack Developer",
      company: "FinTech Pro",
      location: "New York, NY",
      logoUrl: "https://via.placeholder.com/150",
      jobUrl: "https://example.com/job/4",
      description: "We are seeking a creative Full Stack Developer with a strong portfolio in mobile application design."
    },
  ];

  // Get the currently selected job application (first one by default or based on selection)
  const selectedJob = selectedApplicationId 
    ? jobApplications.find(app => app.id === selectedApplicationId.toString())
    : jobApplications[0];

  // Filter applications based on search
  const filteredApplications = jobApplications.filter(app => 
    app.title.toLowerCase().includes(search.toLowerCase()) ||
    app.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <EmployeeHeader />
      <SubHeader />

      <div className="max-w-6xl mx-auto p-8 flex-grow">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="flex items-center space-x-2">
              <FiLoader className="animate-spin text-teal-600" size={20} />
              <span className="text-gray-600">Loading applications...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">Error loading applications: {error}</p>
            <button 
              onClick={() => fetchApplications()}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && jobApplications.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FiSearch className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Applications Found</h3>
            <p className="text-gray-600 mb-4">You haven't applied to any jobs yet.</p>
            <Link 
              href="/user/jobs" 
              className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        )}

        {/* Show content only when we have applications */}
        {!loading && !error && jobApplications.length > 0 && (
          <>
            {/* Header Section with Breadcrumbs */}
            <div className="mb-6">
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Link href="/user/jobs" className="hover:text-teal-600 flex items-center">
                  <FiArrowLeft className="mr-2" />
                  Back to Job Search
                </Link>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Job Application Status</h2>
                  <p className="text-gray-500 text-sm">
                    Not getting views on your CV? <span className="text-teal-500 cursor-pointer hover:underline">Highlight your application</span> to get recruiter's attention.
                  </p>
                </div>
                <div className="flex space-x-6 text-center">
                  <div>
                    <p className="text-2xl font-bold text-teal-600">{jobApplications.length}</p>
                    <p className="text-gray-500 text-sm">Total applies</p>
                  </div>
                  <div className="border-l pl-6">
                    <p className="text-2xl font-bold text-teal-600">00</p>
                    <p className="text-gray-500 text-sm">Application updates</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Sidebar */}
              <div className="w-full md:w-1/3">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex space-x-2 mb-4">
                    <button 
                      className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                        activeTab === 'recruiter' 
                          ? 'bg-teal-50 text-teal-700 border border-teal-200' 
                          : 'border text-gray-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveTab('recruiter')}
                    >
                      Recruiter Actions (0)
                    </button>
                    <button 
                      className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                        activeTab === 'applies' 
                          ? 'bg-teal-50 text-teal-700 border border-teal-200' 
                          : 'border text-gray-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveTab('applies')}
                    >
                      Applies ({filteredApplications.length})
                    </button>
                  </div>
                  
                  {/* Search Box */}
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Search applications..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  
                  {/* Job Applications List */}
                  <div className="space-y-3">
                    {filteredApplications.map((job) => (
                      <div 
                        key={job.id} 
                        className={`p-4 border rounded transition-all cursor-pointer ${
                          selectedJob && selectedJob.id === job.id
                            ? 'bg-teal-50 border-teal-200' 
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedApplicationId(Number(job.id))}
                      >
                        <h3 className="font-semibold text-gray-800 hover:text-teal-600">{job.title}</h3>
                        <p className="text-gray-600">{job.company}</p>
                        <div className="flex justify-between items-center mt-2 text-sm">
                          <span className={`flex items-center gap-1 font-medium ${
                            job.status === 'Applied' || job.status === 'Pending' ? 'text-green-600' : 
                            job.status === 'Reviewing' ? 'text-blue-600' :
                            job.status === 'Interviewed' ? 'text-purple-600' :
                            job.status === 'Offered' ? 'text-orange-600' :
                            job.status === 'Hired' ? 'text-green-700' :
                            job.status === 'Rejected' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {job.status === 'Applied' || job.status === 'Hired' ? <FiCheck size={14} /> : <FiClock size={14} />}
                            {job.status}
                          </span>
                          <span className="text-gray-500">
                            Applied {job.dateApplied}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div className="w-full md:w-2/3">
                {selectedJob ? (
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden border border-gray-200">
                        <img 
                          src={selectedJob.logoUrl} 
                          alt={`${selectedJob.company} logo`} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-1">{selectedJob.title}</h2>
                        <p className="text-gray-600 mb-1">{selectedJob.company}</p>
                        <Link 
                          href={createJobUrl(selectedJob.id, selectedJob.title)} 
                          className="text-teal-500 text-sm hover:underline flex items-center"
                        >
                          View job details <FiExternalLink className="ml-1" size={14} />
                        </Link>
                      </div>
                    </div>

                    {/* Application Status Timeline */}
                    <ApplicationStatusTimeline
                      applicationId={Number(selectedJob.id)}
                      currentStatus={selectedJob.actualApplication?.status || 'pending'}
                      appliedDate={selectedJob.dateApplied}
                      className="mt-6"
                    />

                    {/* Statistics */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border p-4 rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-bold text-teal-600">2,304</p>
                          <div className="bg-teal-100 p-2 rounded-full">
                            <FiUsers className="text-teal-600" />
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">Total applications for this position</p>
                      </div>
                      <div className="border p-4 rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-bold text-teal-600">47</p>
                          <div className="bg-blue-100 p-2 rounded-full">
                            <FiEye className="text-blue-600" />
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">Applications viewed by recruiter</p>
                      </div>
                    </div>

                    {/* Recruiter Info */}
                    <div className="mt-6 p-4 border rounded-lg bg-blue-50 border-blue-200">
                      <h3 className="font-semibold text-gray-800 mb-2">Recruiter Information</h3>
                      <p className="text-gray-600 text-sm mb-1">
                        <span className="font-medium">Last active:</span> {selectedJob.recruiterActive}
                      </p>
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Average response time:</span> 3-5 days
                      </p>
                    </div>

                    {/* Similar Jobs */}
                    <div className="mt-8">
                      <h3 className="font-semibold text-gray-800 mb-4">Similar Jobs You Might Like</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {similarJobs.map((job) => (
                          <Link key={job.id} href={createJobUrl(job.id, job.title)}>
                            <JobListingCard
                              id={job.id}
                              title={job.title}
                              company={job.company}
                              location={job.location}
                              logoUrl={job.logoUrl}
                              jobUrl={job.jobUrl}
                              description={job.description}
                            />
                          </Link>
                        ))}
                      </div>
                      
                      <div className="mt-6 text-center">
                        <Link 
                          href="/user/jobs" 
                          className="inline-flex items-center px-4 py-2 border border-teal-500 text-teal-600 rounded-md hover:bg-teal-50 transition-colors"
                        >
                          View More Jobs
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-center py-12">
                      <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <FiSearch className="text-gray-400" size={24} />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Select an Application</h3>
                      <p className="text-gray-600">Choose an application from the sidebar to view its details and timeline.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
