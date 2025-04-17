import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPinIcon, BriefcaseIcon, UsersIcon, StarIcon } from 'lucide-react';

interface HorizontalCompanyCardProps {
  id: string;
  name: string;
  logoUrl: string;
  industry: string;
  location: string;
  size: string;
  jobCount: number;
  rating: number;
  followers: number;
  description: string;
}

export const HorizontalCompanyCard: React.FC<HorizontalCompanyCardProps> = ({
  id,
  name,
  logoUrl,
  industry,
  location,
  size,
  jobCount,
  rating,
  followers,
  description
}) => {
  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-100">
            <Image
              src={logoUrl || '/placeholder-logo.png'}
              alt={`${name} logo`}
              fill
              className="object-cover"
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{name}</h3>
            <div className="flex items-center gap-1">
              <StarIcon className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <BriefcaseIcon className="w-4 h-4 text-gray-400" />
              <span>{industry}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <MapPinIcon className="w-4 h-4 text-gray-400" />
              <span>{location}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <UsersIcon className="w-4 h-4 text-gray-400" />
              <span>{size}</span>
            </div>
          </div>
          
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{description}</p>
          
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              {followers.toLocaleString()} followers
            </span>
            
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
              {jobCount} open {jobCount === 1 ? 'job' : 'jobs'}
            </span>
          </div>
          
          <div className="mt-3">
            <Link 
              href={`/companies/${id}`}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-teal-700 bg-teal-50 rounded-md hover:bg-teal-100 transition-colors"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
