import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  UsersIcon, 
  StarIcon,
  HeartIcon,
  BookmarkIcon
} from 'lucide-react';

export interface HorizontalCompanyCardProps {
  id: string;
  slug?: string;
  name: string;
  logoUrl: string;
  industry: string;
  location: string;
  size: string;
  jobCount: number;
  rating: number;
  followers: number;
  description: string;
  isFollowing?: boolean;
  isSaved?: boolean;
  onFollow?: () => void;
  onSave?: () => void;
}

export const HorizontalCompanyCard: React.FC<HorizontalCompanyCardProps> = ({
  id,
  slug,
  name,
  logoUrl,
  industry,
  location,
  size,
  jobCount,
  rating,
  followers,
  description,
  isFollowing = false,
  isSaved = false,
  onFollow,
  onSave
}) => {
  const companyUrl = slug ? `/companies/${slug}` : `/companies/${id}`;

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <Link href={companyUrl}>
            <div className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-100">
              <Image
                src={logoUrl || '/placeholder-logo.png'}
                alt={`${name} logo`}
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback to a placeholder if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/64?text=' + name.charAt(0);
                }}
              />
            </div>
          </Link>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <Link href={companyUrl}>
              <h3 className="text-lg font-semibold text-gray-900 truncate hover:text-teal-600 transition-colors">{name}</h3>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <StarIcon className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={onFollow}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                    isFollowing 
                      ? 'bg-teal-50 text-teal-700 border border-teal-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <HeartIcon className={`w-3 h-3 ${isFollowing ? 'fill-teal-500 text-teal-500' : ''}`} />
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                
                <button
                  onClick={onSave}
                  className={`p-1 rounded-md ${
                    isSaved 
                      ? 'bg-teal-50 text-teal-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title={isSaved ? "Saved" : "Save"}
                >
                  <BookmarkIcon className={`w-4 h-4 ${isSaved ? 'fill-teal-500 text-teal-500' : ''}`} />
                </button>
              </div>
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
            
            {jobCount > 0 && (
              <div className="flex items-center gap-1 text-teal-600 font-medium">
                <BriefcaseIcon className="w-4 h-4" />
                <span>{jobCount} open {jobCount === 1 ? 'position' : 'positions'}</span>
              </div>
            )}
          </div>
          
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{description}</p>
          
          <div className="mt-3 flex justify-between items-center">
            <span className="text-xs text-gray-500">{followers.toLocaleString()} followers</span>
            <Link 
              href={companyUrl}
              className="text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

