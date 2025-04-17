import Link from "next/link";
import Image from "next/image";
import { FiMapPin } from "react-icons/fi";
import { createJobUrl } from '@/app/utils/url-helpers';

interface SimilarJob {
  id: string;
  title: string;
  company: string;
  location: string;
  logoUrl: string;
  jobUrl: string;
  salary: string;
  postedDate: string;
}

interface SimilarJobsProps {
  jobs: SimilarJob[];
}

const SimilarJobs = ({ jobs }: SimilarJobsProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Jobs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <Link 
            key={job.id} 
            href={createJobUrl(job.id, job.title)}
            className="block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Job card content */}
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="relative h-10 w-10 rounded-md overflow-hidden bg-gray-100 border border-gray-200 mr-3">
                  <Image
                    src={job.logoUrl}
                    alt={`${job.company} logo`}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 line-clamp-1">{job.title}</h3>
                  <p className="text-sm text-gray-500">{job.company}</p>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <FiMapPin className="mr-1 text-gray-400" />
                <span>{job.location}</span>
              </div>
              
              <p className="text-teal-600 font-medium mb-2">{job.salary}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{job.postedDate}</span>
                <span className="text-sm font-medium text-blue-600">View Job</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarJobs;
