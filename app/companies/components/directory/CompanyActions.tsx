import React from 'react';
import {
  Star,
  MessageSquare,
  Share2
} from 'lucide-react';

interface CompanyActionsProps {
  companyId: string;
  isSaved?: boolean;
  onSave?: () => void;
  onShare?: () => void;
  onContact?: () => void;
}

export const CompanyActions: React.FC<CompanyActionsProps> = ({
  companyId,
  isSaved = false,
  onSave,
  onShare,
  onContact
}) => {
  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={onSave}
        className={`p-2 rounded-full ${isSaved
          ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400'
          : 'text-gray-600 hover:text-yellow-500 hover:bg-yellow-50 dark:text-gray-400 dark:hover:text-yellow-400 dark:hover:bg-yellow-900/20'
          } transition-colors duration-200 group`}
        aria-label={isSaved ? "Saved to favorites" : "Add to favorites"}
        title={isSaved ? "Saved to favorites" : "Add to favorites"}
      >
        <Star className={`w-5 h-5 group-hover:scale-110 transition-transform duration-200 ${isSaved ? 'fill-current' : ''}`} />
      </button>

      <button
        onClick={onContact}
        className="p-2 rounded-full text-gray-600 hover:text-blue-500 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 transition-colors duration-200 group"
        aria-label="Message"
        title="Message"
      >
        <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
      </button>

      <button
        onClick={onShare}
        className="p-2 rounded-full text-gray-600 hover:text-green-500 hover:bg-green-50 dark:text-gray-400 dark:hover:text-green-400 dark:hover:bg-green-900/20 transition-colors duration-200 group"
        aria-label="Share profile"
        title="Share profile"
      >
        <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
      </button>
    </div>
  );
};