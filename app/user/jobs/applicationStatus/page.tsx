"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiArrowLeft, FiExternalLink, FiCheck, FiClock, FiEye, FiUsers, FiLoader } from 'react-icons/fi';
import JobListingCard from "../../components/jobs/jobCard";
import Header from "../../../web/components/header";
import SubHeader from "../../../../components/subheader";
import Footer from "../../../../components/footer";
import EmployeeHeader from '@/components/EmployeeHeader';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

// Utility function for creating SEO-friendly URLs
const createJobUrl = (jobId: string, jobTitle: string): string => {
  const slug = jobTitle
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
  return `/user/jobs/${jobId}/${slug}`;
};

interface Application {
  id: string;
  job_id: string;
  job_title: string;
  company_name: string;
  company_logo: string;
  status: string;
  applied_at: string;
  updated_at: string;
  recruiter_activity?: string;
}

export default function ApplyHistoryPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('applies');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Fetch applications when the page loads
  useEffect(() => {
    const fetchApplications = async () => {
      if (!user?.candidate_id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/candidates/${user.candidate_id}/applications`);
        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }
        const data = await response.json();
        setApplications(data.data);

        // Select the first application by default
        if (data.data.length > 0 && !selectedJobId) {
          setSelectedJobId(data.data[0].id);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  // Filter applications based on search
  const filteredApplications = applications.filter(app =>
    app.job_title.toLowerCase().includes(search.toLowerCase()) ||
    app.company_name.toLowerCase().includes(search.toLowerCase())
  );

  // Get the selected application
  const selectedJob = selectedJobId
    ? applications.find(app => app.id === selectedJobId)
    : applications[0];

  // Mock similar jobs data (could be replaced with API call)
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <EmployeeHeader />
      <SubHeader />

      <div className="max-w-6xl mx-auto p-8 flex-grow">
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
                <p className="text-2xl font-bold text-teal-600">{applications.length}</p>
                <p className="text-gray-500 text-sm">Total applies</p>
              </div>
              <div className="border-l pl-6">
                <p className="text-2xl font-bold text-teal-600">
                  {applications.filter(app => app.status === 'reviewing' || app.status === 'shortlisted' || app.status === 'interview').length}
                </p>
                <p className="text-gray-500 text-sm">Application updates</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FiLoader className="w-10 h-10 animate-spin text-teal-600" />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg text-red-700">
            <p>Error loading applications: {error}</p>
            <button
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : (
          /* Main Content */
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-1/3">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex space-x-2 mb-4">
                  <button
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'recruiter'
                        ? 'bg-teal-50 text-teal-700 border border-teal-200'
                        : 'border text-gray-600 hover:bg-gray-50'
                      }`}
                    onClick={() => setActiveTab('recruiter')}
                  >
                    Recruiter Actions ({applications.filter(a => a.recruiter_activity).length})
                  </button>
                  <button
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'applies'
                        ? 'bg-teal-50 text-teal-700 border border-teal-200'
                        : 'border text-gray-600 hover:bg-gray-50'
                      }`}
                    onClick={() => setActiveTab('applies')}
                  >
                    Applies ({applications.length})
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

                {/* Applications List */}
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredApplications.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No applications found</p>
                  ) : (
                    filteredApplications.map((application) => (
                      <div
                        key={application.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedJobId === application.id
                            ? 'bg-teal-50 border border-teal-200'
                            : 'bg-white border border-gray-200 hover:bg-gray-50'
                          }`}
                        onClick={() => setSelectedJobId(application.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-md bg-gray-200 flex-shrink-0 overflow-hidden">
                            {application.company_logo ? (
                              <Image
                                src={application.company_logo}
                                alt={application.company_name}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                                {application.company_name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="flex-grow min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">{application.job_title}</h3>
                            <p className="text-sm text-gray-500">{application.company_name}</p>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <span>Applied: {application.applied_at}</span>
                            </div>
                          </div>
                          <div className="ml-auto">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${application.status === 'applied' ? 'bg-green-100 text-green-700' :
                                application.status === 'reviewing' ? 'bg-blue-100 text-blue-700' :
                                  application.status === 'shortlisted' ? 'bg-purple-100 text-purple-700' :
                                    application.status === 'interview' ? 'bg-yellow-100 text-yellow-700' :
                                      application.status === 'offered' ? 'bg-indigo-100 text-indigo-700' :
                                        application.status === 'hired' ? 'bg-teal-100 text-teal-700' :
                                          application.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                            'bg-gray-100 text-gray-600'
                              }`}>
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full md:w-2/3">
              {selectedJob ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Job Header */}
                  <div className="p-6 border-b">
                    <div className="flex items-start">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden mr-4">
                        {selectedJob.company_logo ? (
                          <Image
                            src={selectedJob.company_logo}
                            alt={selectedJob.company_name}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xl">
                            {selectedJob.company_name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{selectedJob.job_title}</h2>
                        <p className="text-gray-700">{selectedJob.company_name}</p>

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <div className="flex items-center text-sm text-gray-500">
                            <FiClock className="mr-1" />
                            <span>Applied: {selectedJob.applied_at}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <FiEye className="mr-1" />
                            <span>Last update: {selectedJob.updated_at}</span>
                          </div>
                          <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${selectedJob.status === 'applied' ? 'bg-green-100 text-green-700' :
                              selectedJob.status === 'reviewing' ? 'bg-blue-100 text-blue-700' :
                                selectedJob.status === 'shortlisted' ? 'bg-purple-100 text-purple-700' :
                                  selectedJob.status === 'interview' ? 'bg-yellow-100 text-yellow-700' :
                                    selectedJob.status === 'offered' ? 'bg-indigo-100 text-indigo-700' :
                                      selectedJob.status === 'hired' ? 'bg-teal-100 text-teal-700' :
                                        selectedJob.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                          'bg-gray-100 text-gray-600'
                            }`}>
                            {selectedJob.status === 'applied' ? <FiCheck size={14} /> : <FiClock size={14} />}
                            {selectedJob.status.charAt(0).toUpperCase() + selectedJob.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="ml-auto">
                        <Link
                          href={createJobUrl(selectedJob.job_id, selectedJob.job_title)}
                          className="inline-flex items-center text-teal-600 hover:text-teal-700"
                        >
                          <span>View Job</span>
                          <FiExternalLink className="ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Application Status Timeline */}
                  <div className="p-6 border-b">
                    <h3 className="text-lg font-medium mb-4">Application Status</h3>

                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                      <div className="relative pl-10 pb-6">
                        <div className="absolute left-0 rounded-full w-8 h-8 bg-green-100 text-green-600 flex items-center justify-center">
                          <FiCheck />
                        </div>
                        <div>
                          <h4 className="font-medium">Applied</h4>
                          <p className="text-sm text-gray-500">You successfully applied for this position on {selectedJob.applied_at}</p>
                        </div>
                      </div>

                      <div className="relative pl-10 pb-6">
                        <div className={`absolute left-0 rounded-full w-8 h-8 flex items-center justify-center ${['reviewing', 'shortlisted', 'interview', 'offered', 'hired'].includes(selectedJob.status)
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-400'
                          }`}>
                          <FiEye />
                        </div>
                        <div>
                          <h4 className={`font-medium ${['reviewing', 'shortlisted', 'interview', 'offered', 'hired'].includes(selectedJob.status)
                              ? 'text-gray-900'
                              : 'text-gray-400'
                            }`}>Application Review</h4>
                          <p className="text-sm text-gray-500">
                            {['reviewing', 'shortlisted', 'interview', 'offered', 'hired'].includes(selectedJob.status)
                              ? 'Your application is being reviewed by the hiring team'
                              : 'Waiting for the hiring team to review your application'}
                          </p>
                        </div>
                      </div>

                      <div className="relative pl-10 pb-6">
                        <div className={`absolute left-0 rounded-full w-8 h-8 flex items-center justify-center ${['shortlisted', 'interview', 'offered', 'hired'].includes(selectedJob.status)
                            ? 'bg-purple-100 text-purple-600'
                            : 'bg-gray-100 text-gray-400'
                          }`}>
                          <FiUsers />
                        </div>
                        <div>
                          <h4 className={`font-medium ${['shortlisted', 'interview', 'offered', 'hired'].includes(selectedJob.status)
                              ? 'text-gray-900'
                              : 'text-gray-400'
                            }`}>Shortlisted</h4>
                          <p className="text-sm text-gray-500">
                            {['shortlisted', 'interview', 'offered', 'hired'].includes(selectedJob.status)
                              ? 'Congratulations! You\'ve been shortlisted for this position'
                              : 'You\'ll be notified if you\'re shortlisted for this position'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Similar Jobs */}
                  <div className="p-6">
                    <h3 className="text-lg font-medium mb-4">Similar Jobs You Might Like</h3>

                    <div className="space-y-4">
                      {similarJobs.map(job => (
                        <JobListingCard key={job.id} job={job} />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <p className="text-gray-500">Select an application to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
<FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div >

  {/* Job Applications List */ }
  < div className = "space-y-3" >
  {
    jobApplications.map((job, index) => (
      <div
        key={job.id}
        className={`p-4 border rounded transition-all ${index === 0
            ? 'bg-teal-50 border-teal-200'
            : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
      >
        <Link href={createJobUrl(job.id, job.title)}>
          <h3 className="font-semibold text-gray-800 hover:text-teal-600">{job.title}</h3>
          <p className="text-gray-600">{job.company}</p>
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className={`flex items-center gap-1 font-medium ${job.status === 'Applied' ? 'text-green-600' : 'text-blue-600'
              }`}>
              {job.status === 'Applied' ? <FiCheck size={14} /> : <FiClock size={14} />}
              {job.status}
            </span>
            <span className="text-gray-500">
              Applied {job.dateApplied}
            </span>
          </div>
        </Link>
      </div>
    ))
  }
              </div >
            </div >
          </div >

  {/* Job Details */ }
  < div className = "w-full md:w-2/3" >
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

      {/* Application Status */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">Application Status</h3>
        <div className="flex items-center mt-2">
          <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white">
            <FiCheck size={14} />
          </div>
          <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
          <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white">
            <FiCheck size={14} />
          </div>
          <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
            <FiEye size={14} />
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <div className="text-center">
            <p className="font-medium text-teal-600">Applied</p>
            <p>{selectedJob.dateApplied}</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-teal-600">Application Sent</p>
            <p>{selectedJob.dateSent}</p>
          </div>
          <div className="text-center">
            <p className="font-medium">Awaiting Review</p>
            <p>Pending</p>
          </div>
        </div>
      </div>

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
    </div>
          </div >
        </div >
      </div >

  <Footer />
    </div >
  );
}
