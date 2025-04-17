"use client";

import Image from "next/image";
import { FiGlobe, FiUsers, FiBriefcase } from "react-icons/fi";

interface CompanyDetailsProps {
  company: string;
  logoUrl: string;
  about: string;
  size: string;
  industry: string;
  website: string;
}

const CompanyDetails = ({
  company,
  logoUrl,
  about,
  size,
  industry,
  website
}: CompanyDetailsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-100 border border-gray-200 mr-4">
            <Image
              src={logoUrl}
              alt={`${company} logo`}
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{company}</h2>
        </div>
        
        <p className="text-gray-700 mb-6 line-clamp-4">{about}</p>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <FiBriefcase className="text-teal-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Industry</h3>
              <p className="text-gray-900">{industry}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <FiUsers className="text-teal-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Company Size</h3>
              <p className="text-gray-900">{size}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <FiGlobe className="text-teal-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Website</h3>
              <a 
                href={website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <a 
            href={`/companies/${company.toLowerCase().replace(/\s+/g, '-')}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full justify-center"
          >
            View Company Profile
          </a>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
