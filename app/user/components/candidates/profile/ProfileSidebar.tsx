import React from 'react';
import Image from 'next/image';
import { FaDownload, FaShare, FaBookmark, FaPrint, FaEnvelope, FaEye, FaSearch, FaChartLine } from 'react-icons/fa';

interface ProfileSidebarProps {
  candidateData: any;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ candidateData }) => {
  return (
    <div className="space-y-6">
      {/* Profile Actions Card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden p-4">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
          Profile Actions
        </p>
        
        <div className="space-y-2">
          <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors">
            <span className="flex items-center">
            <FaDownload className="text-blue-600 mr-2" />
              Download Resume
            </span>
          </button>
          
          <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors">
            <span className="flex items-center">
              <FaShare className="text-blue-600 mr-2" />
              Share Profile
            </span>
          </button>
          
          <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors">
            <span className="flex items-center">
              <FaBookmark className="text-blue-600 mr-2" />
              Save Profile
            </span>
          </button>
          
          <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors">
            <span className="flex items-center">
              <FaPrint className="text-blue-600 mr-2" />
              Print Profile
            </span>
          </button>
          
          <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors">
            <span className="flex items-center">
              <FaEnvelope className="text-blue-600 mr-2" />
              Email Profile
            </span>
          </button>
        </div>
      </div>
      
      {/* Profile Stats Card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden p-4">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
          Profile Stats
        </p>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FaEye className="text-blue-600 mr-2" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Profile views</span>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">1,245</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FaSearch className="text-blue-600 mr-2" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Search appearances</span>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">843</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FaChartLine className="text-blue-600 mr-2" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Post impressions</span>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">3.2K</span>
          </div>
        </div>
      </div>
      
      {/* People Also Viewed Card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden p-4">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
          People Also Viewed
        </p>
        
        <div className="space-y-4">
          {[
            { name: "Alex Johnson", title: "Product Designer", img: "/images/avatar1.jpg" },
            { name: "Sarah Miller", title: "UX Researcher", img: "/images/avatar2.jpg" },
            { name: "David Chen", title: "Frontend Developer", img: "/images/avatar3.jpg" }
          ].map((person, idx) => (
            <div key={idx} className="flex items-center space-x-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={person.img}
                  alt={person.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{person.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{person.title}</p>
              </div>
            </div>
          ))}
        </div>
        
        <hr className="my-4 border-gray-200 dark:border-gray-700" />
        
        <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View more suggestions
        </a>
      </div>
    </div>
  );
};

export default ProfileSidebar;

