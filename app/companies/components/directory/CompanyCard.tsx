import React from 'react';
import { 
  StarIcon, 
  BuildingIcon, 
  MessageSquareIcon, 
  BookmarkIcon, 
  ShareIcon,
  HeartIcon
} from 'lucide-react';
import { PlaceholderLogo } from '@/app/components/PlaceholderLogo';

interface CompanyCardProps {
  name: string;
  description: string;
  rating: number | null | undefined;
  industry: string;
  logoUrl?: string;
  location: string;
  hashtags: string[];
  isFollowing?: boolean;
  isSaved?: boolean;
  onBookmark?: () => void;
  onShare?: () => void;
  onContact?: () => void;
  onViewProfile?: () => void;
  onFollow?: () => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  name,
  description,
  rating,
  industry,
  logoUrl,
  location,
  hashtags,
  isFollowing = false,
  isSaved = false,
  onBookmark,
  onShare,
  onContact,
  onViewProfile,
  onFollow
}) => {
  // Convert rating to a number or default to 0
  const numericRating = typeof rating === 'number' ? rating : 0;

  return (
    <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border border-gray-100">
            {/* Use the placeholder component instead of Image */}
            <PlaceholderLogo 
              name={name} 
              className="w-full h-full"
              width={96}
              height={96}
            />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900">{name}</h3>
            <div className="flex gap-2">
              <button 
                onClick={onBookmark}
                className={`p-1.5 rounded-full ${isSaved 
                  ? 'text-teal-600 bg-teal-50' 
                  : 'text-gray-500 hover:text-teal-600 hover:bg-teal-50'
                } transition-colors`}
                title={isSaved ? "Saved" : "Save"}
              >
                <BookmarkIcon className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
              <button 
                onClick={onShare}
                className="p-1.5 rounded-full text-gray-500 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                title="Share"
              >
                <ShareIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            {Array.isArray(hashtags) && hashtags.length > 0 ? (
              hashtags.map((hashtag, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 text-xs font-medium text-teal-700 bg-teal-50 rounded-full"
                >
                  #{typeof hashtag === 'string' ? hashtag : (hashtag.specialty || hashtag)}
                </span>
              ))
            ) : (
              <span className="px-2 py-1 text-xs font-medium text-teal-700 bg-teal-50 rounded-full">
                #{industry}
              </span>
            )}
          </div>

          <div className="flex items-center mb-2">
            <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-4 h-1 rounded-sm ${i < Math.floor(numericRating) ? 'bg-yellow-400' : 'bg-gray-200'}`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">{numericRating.toFixed(1)}</span>
          </div>
          
          <p className="text-gray-600 text-sm line-clamp-2 mb-2">{description}</p>
          <p className="text-teal-600 text-sm font-medium mb-1">{industry}</p>
          <p className="text-gray-500 text-sm mb-3">{location}</p>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={onViewProfile}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <BuildingIcon className="w-4 h-4" />
              View Profile
            </button>
            <button
              onClick={onContact}
              className="px-4 py-2 border border-teal-600 text-teal-600 rounded-md hover:bg-teal-50 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <MessageSquareIcon className="w-4 h-4" />
              Contact
            </button>
            {onFollow && (
              <button
                onClick={onFollow}
                className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium ${
                  isFollowing 
                    ? 'bg-teal-50 text-teal-700 border border-teal-300' 
                    : 'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                <HeartIcon className={`w-4 h-4 ${isFollowing ? 'fill-current text-teal-500' : ''}`} />
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
