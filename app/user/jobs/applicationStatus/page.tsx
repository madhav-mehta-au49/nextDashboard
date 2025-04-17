"use client";
import { useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiArrowLeft, FiExternalLink, FiCheck, FiClock, FiEye, FiUsers } from 'react-icons/fi';
import JobListingCard from "../../components/jobs/jobCard";
import Header from "../../../web/components/header";
import SubHeader from "../../../../components/subheader";
import Footer from "../../../../components/footer";
import EmployeeHeader from '@/components/EmployeeHeader';

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

  const jobApplications = [
    { 
      id: "1", 
      title: 'Software Developer', 
      company: 'Job Express Live', 
      dateApplied: '19 Mar 2025', 
      dateSent: '19 Mar 2025', 
      status: 'Applied',
      recruiterActive: 'today',
      logoUrl: 'https://via.placeholder.com/150'
    },
    { 
      id: "2", 
      title: 'Frontend Engineer', 
      company: 'TechCorp Solutions', 
      dateApplied: '15 Mar 2025', 
      dateSent: '15 Mar 2025', 
      status: 'Reviewing',
      recruiterActive: '2 days ago',
      logoUrl: 'https://via.placeholder.com/150'
    },
  ];

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

  // Get the currently selected job application (first one by default)
  const selectedJob = jobApplications[0];

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
                  Applies ({jobApplications.length})
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
                {jobApplications.map((job, index) => (
                  <div 
                    key={job.id} 
                    className={`p-4 border rounded transition-all ${
                      index === 0 
                        ? 'bg-teal-50 border-teal-200' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Link href={createJobUrl(job.id, job.title)}>
                      <h3 className="font-semibold text-gray-800 hover:text-teal-600">{job.title}</h3>
                      <p className="text-gray-600">{job.company}</p>
                      <div className="flex justify-between items-center mt-2 text-sm">
                        <span className={`flex items-center gap-1 font-medium ${
                          job.status === 'Applied' ? 'text-green-600' : 'text-blue-600'
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
                ))}
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="w-full md:w-2/3">
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
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
