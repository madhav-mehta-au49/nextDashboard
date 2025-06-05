"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Footer from "@/components/footer";
import Header from "@/app/web/components/header";
import SubHeader from "@/components/subheader";
import CompanyDetails from "../../../components/jobs/CompanyDetails";
import JobDescription from "../../../components/jobs/JobDescription";
import { JobSchema } from "../../../components/jobs/JobSchema";
import SimilarJobs from "../../../components/jobs/SimilarJobs";
import EmployeeHeader from "@/components/EmployeeHeader";
import JobApplicationModal from "@/app/components/jobs/JobApplicationModal";
import { useJob } from "@/hooks/useJobs";
import { formatSalary } from "@/app/utils/currency";

interface JobPageProps {
  params: {
    jobId: string;
    jobSlug: string;
  };
}

const JobPage = ({ params }: JobPageProps) => {
  // Fetch real job data using the useJob hook
  const { job, loading, error, fetchJob } = useJob();
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  // Fetch job data when component mounts or jobId changes
  useEffect(() => {
    if (params.jobId) {
      fetchJob(parseInt(params.jobId));
    }
  }, [params.jobId, fetchJob]);

  const handleApplyNow = () => {
    setIsApplicationModalOpen(true);
  };

  const handleApplicationSubmitted = () => {
    // Refresh job data to update application status
    if (params.jobId) {
      fetchJob(parseInt(params.jobId));
    }
  };  // Prepare job data for display (moved up to avoid conditional hook calls)
  const jobData = job ? {
    id: job.id.toString(),
    title: job.title,
    company: job.company.name,
    location: job.location,
    logoUrl: job.company.logo || "https://via.placeholder.com/150",
    jobUrl: `#`,
    description: job.description,
    salary: formatSalary(job.salary_min, job.salary_max, job.currency),
    employmentType: job.job_type || "Not specified",
    experienceLevel: job.experience_level || "Not specified",
    locationType: job.location_type || "Not specified",
    categoryId: job.category_id,
    
    // Debug logging for troubleshooting
    requirements: (() => {
      console.log("Job requirements raw:", job.requirements);
      console.log("Job requirements type:", typeof job.requirements);
      return job.requirements ? (Array.isArray(job.requirements) ? job.requirements : (() => {
        try {
          const parsed = typeof job.requirements === 'string' ? JSON.parse(job.requirements) : job.requirements;
          console.log("Job requirements parsed:", parsed);
          return Array.isArray(parsed) ? parsed : [job.requirements];
        } catch (e) {
          console.log("Job requirements parse error:", e);
          return [job.requirements];
        }
      })()) : ["Requirements not specified"];
    })(),
      benefits: (() => {
      console.log("Job benefits raw:", job.benefits);
      console.log("Job benefits type:", typeof job.benefits);
      return job.benefits ? (Array.isArray(job.benefits) ? job.benefits : (() => {
        try {
          const parsed = typeof job.benefits === 'string' ? JSON.parse(job.benefits) : job.benefits;
          console.log("Job benefits parsed:", parsed);
          return Array.isArray(parsed) ? parsed : [job.benefits];
        } catch (e) {
          console.log("Job benefits parse error:", e);
          return [job.benefits];
        }
      })()) : ["Benefits not specified"];
    })(),
    
    requiredSkills: (() => {
      console.log("Job required_skills raw:", job.required_skills);
      console.log("Job required_skills type:", typeof job.required_skills);
      return job.required_skills ? (Array.isArray(job.required_skills) ? job.required_skills : (() => {
        try {
          const parsed = typeof job.required_skills === 'string' ? JSON.parse(job.required_skills) : job.required_skills;
          console.log("Job required_skills parsed:", parsed);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          console.log("Job required_skills parse error:", e);
          return [];
        }
      })()) : [];
    })(),
      preferredSkills: (() => {
      console.log("Job preferred_skills raw:", job.preferred_skills);
      console.log("Job preferred_skills type:", typeof job.preferred_skills);
      return job.preferred_skills ? (Array.isArray(job.preferred_skills) ? job.preferred_skills : (() => {
        try {
          const parsed = typeof job.preferred_skills === 'string' ? JSON.parse(job.preferred_skills) : job.preferred_skills;
          console.log("Job preferred_skills parsed:", parsed);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          console.log("Job preferred_skills parse error:", e);
          return [];
        }
      })()) : [];
    })(),
    applicationDeadline: job.application_deadline ? new Date(job.application_deadline).toLocaleDateString() : null,
    startDate: job.start_date ? new Date(job.start_date).toLocaleDateString() : null,
    isRemoteFriendly: job.is_remote_friendly || false,
    isUrgent: job.urgent || false,
    isFeatured: job.featured || false,
    questions: job.questions || [],
    companyDetails: {
      about: job.company.description || "No company description available.",
      size: job.company.size || "Not specified",
      industry: job.company.industry || "Not specified",
      website: job.company.website || "#"
    },
    postedDate: job.created_at ? new Date(job.created_at).toLocaleDateString() : "Recently posted"
  } : null;

  // Add structured data for SEO (moved up before conditional returns)
  useEffect(() => {
    if (jobData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(JobSchema(jobData));
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [jobData]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <EmployeeHeader />
        <SubHeader />
        <main className="flex-grow py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  // Show error state
  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <EmployeeHeader />
        <SubHeader />
        <main className="flex-grow py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
              <p className="text-gray-600 mb-4">{error || 'The job you are looking for does not exist.'}</p>
              <a
                href="/user/jobs"
                className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
              >
                Back to Jobs
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Additional null check for TypeScript
  if (!jobData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <EmployeeHeader />
        <SubHeader />
        <main className="flex-grow py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
              <p className="text-gray-600">Preparing job details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <EmployeeHeader />
      <SubHeader />

      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Job Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center">              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                <Image
                  src={jobData.logoUrl}
                  alt={`${jobData.company} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>              <div className="flex-grow">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{jobData.title}</h1>
                <p className="text-lg text-gray-600 mb-2">{jobData.company} • {jobData.location}</p>                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                    {jobData.employmentType}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {jobData.postedDate}
                  </span>
                  {jobData.locationType && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                      {jobData.locationType}
                    </span>
                  )}
                  {jobData.experienceLevel && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 capitalize">
                      {jobData.experienceLevel} Level
                    </span>
                  )}
                  {jobData.isUrgent && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      🔥 Urgent
                    </span>
                  )}
                  {jobData.isFeatured && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      ⭐ Featured
                    </span>
                  )}
                  {jobData.isRemoteFriendly && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      🏠 Remote OK
                    </span>
                  )}
                </div>
                <p className="text-teal-600 font-semibold">{jobData.salary}</p>              </div>
              <div className="mt-4 md:mt-0">
                <button 
                  onClick={handleApplyNow}
                  className="w-full md:w-auto px-6 py-3 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">            {/* Main Content */}
            <div className="lg:col-span-2">
              <JobDescription
                title={jobData.title}
                company={jobData.company}
                location={jobData.location}
                description={jobData.description}
                requirements={jobData.requirements}
                benefits={jobData.benefits}
                postedDate={jobData.postedDate}
                salary={jobData.salary}
                employmentType={jobData.employmentType}
                jobUrl={jobData.jobUrl}
                experienceLevel={jobData.experienceLevel}
                locationType={jobData.locationType}
                requiredSkills={jobData.requiredSkills}
                preferredSkills={jobData.preferredSkills}
                applicationDeadline={jobData.applicationDeadline}
                startDate={jobData.startDate}
                isRemoteFriendly={jobData.isRemoteFriendly}
                isUrgent={jobData.isUrgent}
                isFeatured={jobData.isFeatured}
                questions={jobData.questions}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <CompanyDetails
                company={jobData.company}
                logoUrl={jobData.logoUrl}
                about={jobData.companyDetails.about}
                size={jobData.companyDetails.size}
                industry={jobData.companyDetails.industry}
                website={jobData.companyDetails.website}
              />

              {/* Quick Apply Card */}
              <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg shadow-md overflow-hidden">
                <div className="p-6 text-center">                  <h3 className="text-lg font-semibold text-white mb-2">Ready to Apply?</h3>
                  <p className="text-white opacity-90 mb-4">Submit your application in just a few clicks</p>
                  <button 
                    onClick={handleApplyNow}
                    className="w-full bg-white text-teal-600 font-medium py-2 px-4 rounded-md hover:bg-teal-50 transition-colors"
                  >
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
        </div>      </main>

      <Footer />      {/* Job Application Modal */}
      {job && (
        <JobApplicationModal
          isOpen={isApplicationModalOpen}
          onClose={() => setIsApplicationModalOpen(false)}
          job={job}
          onApplicationSubmitted={handleApplicationSubmitted}
        />
      )}
    </div>
  );
};

export default JobPage;
