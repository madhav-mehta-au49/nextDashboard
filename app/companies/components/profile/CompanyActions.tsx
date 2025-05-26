import React from 'react';
import { 
  Star, 
  MessageSquare, 
  Share2, 
  Briefcase, 
  Bell, 
  Flag 
} from 'lucide-react';

interface CompanyActionsProps {
  companyId: string;
  isSaved?: boolean;
  onSave?: () => void;
  onShare?: () => void;
  onContact?: () => void;
  onViewJobs?: () => void;
  onJobAlerts?: () => void;
  onReport?: () => void;
}

export const CompanyActions: React.FC<CompanyActionsProps> = ({ 
  companyId,
  isSaved = false,
  onSave,
  onShare,
  onContact,
  onViewJobs,
  onJobAlerts,
  onReport
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="p-5">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
          Company Actions
        </h3>
        
        <div className="space-y-2">
          <button 
            onClick={onSave}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors group"
          >
            <Star className={`h-4 w-4 mr-3 text-gray-500 group-hover:text-yellow-500 transition-colors ${isSaved ? 'fill-yellow-500 text-yellow-500' : ''}`} />
            <span className={`group-hover:text-gray-900 dark:group-hover:text-white transition-colors ${isSaved ? 'text-gray-900 dark:text-white' : ''}`}>
              {isSaved ? 'Saved to favorites' : 'Add to favorites'}
            </span>
          </button>
          
          <button 
            onClick={onContact}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors group"
          >
            <MessageSquare className="h-4 w-4 mr-3 text-gray-500 group-hover:text-blue-500 transition-colors" />
            <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Message company</span>
          </button>
          
          <button 
            onClick={onShare}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors group"
          >
            <Share2 className="h-4 w-4 mr-3 text-gray-500 group-hover:text-green-500 transition-colors" />
            <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Share profile</span>
          </button>
        </div>
        
        <hr className="my-4 border-gray-200 dark:border-gray-700" />
        
        <div className="space-y-2">
          <button 
            onClick={onViewJobs}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors group"
          >
            <Briefcase className="h-4 w-4 mr-3 text-gray-500 group-hover:text-cyan-500 transition-colors" />
            <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">View all jobs</span>
          </button>
          
          <button 
            onClick={onJobAlerts}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors group"
          >
            <Bell className="h-4 w-4 mr-3 text-gray-500 group-hover:text-orange-500 transition-colors" />
            <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Get job alerts</span>
          </button>
        </div>
        
        <hr className="my-4 border-gray-200 dark:border-gray-700" />
        
        <button 
          onClick={onReport}
          className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors group"
        >
          <Flag className="h-4 w-4 mr-3 text-gray-500 group-hover:text-red-500 transition-colors" />
          <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Report company</span>
        </button>
        
        <div className="mt-5 text-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ID: {companyId}
          </span>
        </div>
      </div>
    </div>
  );
};
