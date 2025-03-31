"use client";
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import JobListingCard from "../../components/jobs/jobCard";

export default function ApplyHistoryPage() {
  const [search, setSearch] = useState('');

  const jobApplications = [
    { id: 1, title: 'Software Developer', company: 'Job Express Live', dateApplied: '19 Mar 2025', dateSent: '19 Mar 2025', status: 'Applied' },
  ];

  const similarJobs = [
    {
      id: "2",
      title: "Frontend Developer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      logoUrl: "/images/tech-corp-logo.png",
      jobUrl: "https://example.com/job/2",
      description: "We are looking for a skilled Frontend Developer with 3+ years of experience in JavaScript and React."
    },
    {
      id: "3",
      title: "Backend Developer",
      company: "Health Solutions",
      location: "Boston, MA",
      logoUrl: "/images/health-solutions-logo.png",
      jobUrl: "https://example.com/job/3",
      description: "Join our team as a Backend Developer to lead the development of innovative healthcare solutions."
    },
    {
      id: "4",
      title: "Full Stack Developer",
      company: "FinTech Pro",
      location: "New York, NY",
      logoUrl: "/images/fintech-pro-logo.png",
      jobUrl: "https://example.com/job/4",
      description: "We are seeking a creative Full Stack Developer with a strong portfolio in mobile application design."
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Job application status</h2>
          <p className="text-gray-500 text-sm">
            Not getting views on your CV? <span className="text-blue-500 cursor-pointer">Highlight your application</span> to get recruiter's attention.
          </p>
        </div>
        <div className="flex space-x-6 text-center">
          <div>
            <p className="text-2xl font-bold">01</p>
            <p className="text-gray-500 text-sm">Total applies</p>
          </div>
          <div className="border-l pl-6">
            <p className="text-2xl font-bold">00</p>
            <p className="text-gray-500 text-sm">Application updates</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-1/3 bg-white p-4 rounded shadow-md border">
          <div className="flex space-x-2 mb-4">
            <button className="border px-4 py-2 rounded text-gray-600">Recruiter Actions (0)</button>
            <button className="border px-4 py-2 rounded bg-gray-200 font-medium">Applies on (1)</button>
          </div>
          <div className="p-4 border rounded bg-blue-50">
            <h3 className="font-semibold">{jobApplications[0].title}</h3>
            <p className="text-gray-600">{jobApplications[0].company}</p>
            <div className="flex justify-between items-center mt-2 text-sm">
              <span className="flex items-center gap-2 text-green-600 font-medium">✅ Application sent today</span>
              <span className="text-gray-500">Recruiter last active today</span>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="w-2/3 bg-white p-6 rounded shadow-md border">
          <h2 className="text-lg font-semibold mb-1">{jobApplications[0].title}</h2>
          <p className="text-gray-600 mb-1">{jobApplications[0].company}</p>
          <a href="#" className="text-blue-500 text-sm">View similar jobs</a>

          {/* Application Status */}
          <div className="mt-6">
            <h3 className="font-semibold">Application Status</h3>
            <div className="flex items-center mt-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Applied</span>
              <span>{jobApplications[0].dateApplied}</span>
              <span>Application Sent</span>
              <span>{jobApplications[0].dateSent}</span>
              <span>Awaiting Recruiter Action</span>
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-6 flex gap-6">
            <div className="border p-4 rounded text-center flex-1">
              <p className="text-xl font-bold">2304</p>
              <p className="text-gray-600 text-sm">Total applications</p>
            </div>
            <div className="border p-4 rounded text-center flex-1">
              <p className="text-xl font-bold">47</p>
              <p className="text-gray-600 text-sm">Applications viewed by recruiter</p>
            </div>
          </div>

          {/* Similar Jobs */}
          <div className="mt-6">
            <h3 className="font-semibold mb-4">Similar Jobs</h3>
            <div className="grid grid-cols-1 gap-4">
              {similarJobs.map((job) => (
                <JobListingCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  company={job.company}
                  location={job.location}
                  logoUrl={job.logoUrl}
                  jobUrl={job.jobUrl}
                  description={job.description}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}