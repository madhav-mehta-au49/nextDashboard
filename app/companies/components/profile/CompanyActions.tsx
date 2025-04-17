import React from 'react';
import { 
  Star, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Briefcase, 
  Bell, 
  Flag 
} from 'lucide-react';

interface CompanyActionsProps {
  companyId: string;
}

export const CompanyActions: React.FC<CompanyActionsProps> = ({ companyId }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="p-5">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
          Company Actions
        </h3>
        
        <div className="space-y-2">
          <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors group">
            <Star className="h-4 w-4 mr-3 text-gray-500 group-hover:text-yellow-500 transition-colors" />
            <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Add to favorites</span>
          </button>
          
          <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors group">
            <MessageSquare className="h-4 w-4 mr-3 text-gray-500 group-hover:text-blue-500 transition-colors" />
            <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Message company</span>
          </button>
          
          <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors group">
            <Share2 className="h-4 w-4 mr-3 text-gray-500 group-hover:text-green-500 transition-colors" />
            <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Share profile</span>
          </button>
          
          <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors group">
            <Bookmark className="h-4 w-4 mr-3 text-gray-500 group-hover:text-purple-500 transition-colors" />
            <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Save profile</span>
          </button>
        </div>
        
        <hr className="my-4 border-gray-200 dark:border-gray-700" />
        
        <div className="space-y-2">
          <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors group">
            <Briefcase className="h-4 w-4 mr-3 text-gray-500 group-hover:text-cyan-500 transition-colors" />
            <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">View all jobs</span>
          </button>
          
          <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors group">
            <Bell className="h-4 w-4 mr-3 text-gray-500 group-hover:text-orange-500 transition-colors" />
            <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Get job alerts</span>
          </button>
        </div>
        
        <hr className="my-4 border-gray-200 dark:border-gray-700" />
        
        <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors group">
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
