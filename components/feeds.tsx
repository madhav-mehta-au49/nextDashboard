import React from 'react';
import Image from 'next/image';

export interface FeedItem {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  author?: {
    name: string;
    avatar?: string;
  };
  tags?: string[];
}

interface FeedCardProps {
  feedItems: FeedItem[];
}

const FeedCard: React.FC<FeedCardProps> = ({ feedItems }) => {
  return (
    <div className="space-y-4">
      {feedItems.map((item) => (
        <div 
          key={item.id} 
          className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
        >
          <h3 className="font-bold text-sm text-gray-900">{item.title}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {item.content}
          </p>
          
          {item.author && (
            <div className="flex items-center mt-2 space-x-2">
              <div className="relative h-5 w-5 rounded-full overflow-hidden bg-gray-200">
                {item.author.avatar ? (
                  <Image
                    src={item.author.avatar}
                    alt={item.author.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-teal-100 text-teal-800 text-xs font-medium">
                    {item.author.name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-500">{item.author.name}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">{item.timestamp}</span>
            
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedCard;
