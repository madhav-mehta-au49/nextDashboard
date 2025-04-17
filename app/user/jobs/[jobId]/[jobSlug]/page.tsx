"use client";

import { useEffect } from "react";
import Image from "next/image";
import Footer from "@/components/footer";
import Header from "@/app/web/components/header";
import SubHeader from "@/components/subheader";
import CompanyDetails from "../../../components/jobs/CompanyDetails";
import JobDescription from "../../../components/jobs/JobDescription";
import { JobSchema } from "../../../components/jobs/JobSchema";
import SimilarJobs from "../../../components/jobs/SimilarJobs";
import EmployeeHeader from "@/components/EmployeeHeader";

interface JobPageProps {
  params: {
    jobId: string;
    jobSlug: string;
  };
}

const JobPage = ({ params }: JobPageProps) => {
  // Mock job data - in a real app, you would fetch this from an API based on jobId
  const job = {
    id: params.jobId,
    title: "Senior Software Engineer", // In real app, fetch this based on jobId
    company: "Tech Corp",
    location: "San Francisco, CA",
    logoUrl: "https://via.placeholder.com/150",
    jobUrl: "https://example.com/job/1",
    description: "We are looking for a talented Senior Software Engineer to join our team. You will be responsible for developing high-quality software solutions, collaborating with cross-functional teams, and mentoring junior developers.",
    salary: "$120,000 - $180,000",
    employmentType: "Full-time",
    requirements: [
      "5+ years of experience in software development",
      "Strong knowledge of JavaScript and TypeScript",
      "Experience with React and Node.js",
      "Bachelor's degree in Computer Science or related field",
      "Excellent problem-solving and communication skills",
      "Experience with cloud platforms (AWS, Azure, or GCP)"
    ],
    benefits: [
      "Health, dental, and vision insurance",
      "401(k) matching",
      "Flexible work hours",
      "Remote work options",
      "Professional development budget",
      "Generous paid time off"
    ],
    companyDetails: {
      about: "Tech Corp is a leading software company specializing in cloud solutions. We build innovative products that help businesses streamline their operations and improve efficiency.",
      size: "1000-5000 employees",
      industry: "Information Technology",
      website: "https://techcorp.example.com"
    },
    postedDate: "2 weeks ago"
  };

  // Mock similar jobs data
  const similarJobs = [
    {
      id: "2",
      title: "Full Stack Developer",
      company: "StartUp Inc",
      location: "New York, NY",
      logoUrl: "https://via.placeholder.com/150",
      jobUrl: "https://example.com/job/2",
      salary: "$100,000 - $150,000",
      postedDate: "1 week ago"
    },
    // ... other similar jobs
  ];

  // Add structured data for SEO
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(JobSchema(job));
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <EmployeeHeader />
      <SubHeader />

      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Job Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                  <Image
                    src={job.logoUrl}
                    alt={`${job.company} logo`}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="flex-grow">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h1>
                <p className="text-lg text-gray-600 mb-2">{job.company} • {job.location}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                    {job.employmentType}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {job.postedDate}
                  </span>
                </div>
                <p className="text-teal-600 font-semibold">{job.salary}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <button className="w-full md:w-auto px-6 py-3 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors">
                  Apply Now
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <JobDescription
                title={job.title}
                company={job.company}
                location={job.location}
                description={job.description}
                requirements={job.requirements}
                benefits={job.benefits}
                postedDate={job.postedDate}
                salary={job.salary}
                employmentType={job.employmentType}
                jobUrl={job.jobUrl}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <CompanyDetails
                company={job.company}
                logoUrl={job.logoUrl}
                about={job.companyDetails.about}
                size={job.companyDetails.size}
                industry={job.companyDetails.industry}
                website={job.companyDetails.website}
              />
              
              {/* Quick Apply Card */}
              <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg shadow-md overflow-hidden">
                <div className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Ready to Apply?</h3>
                  <p className="text-white opacity-90 mb-4">Submit your application in just a few clicks</p>
                  <button className="w-full bg-white text-teal-600 font-medium py-2 px-4 rounded-md hover:bg-teal-50 transition-colors">
                    Quick Apply
                  </button>
                </div>
              </div>
              
              {/* Job Alert Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Get Similar Job Alerts</h3>
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                  <button className="w-full bg-teal-600 text-white font-medium py-2 px-4 rounded-md hover:bg-teal-700 transition-colors">
                    Create Job Alert
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Jobs Section */}
          <div className="mt-12">
            <SimilarJobs jobs={similarJobs} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JobPage;
