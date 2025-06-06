import React, { useState } from 'react';
import { FaBriefcase, FaGraduationCap, FaLightbulb, FaCertificate, FaQuoteLeft, FaExternalLinkAlt, FaChevronDown, FaChevronUp, FaCheck } from 'react-icons/fa';
import ApplicationStatusSection from '../../applications/ApplicationStatusSection';

interface ProfileTabsProps {
  candidateData: any;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ candidateData }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'profile'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'activity'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('activity')}
          >
            Activity
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {activeTab === 'profile' ? (
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <p className="text-gray-700">
              {candidateData.about}
            </p>
          </div>        ) : (
          <div>
            <h3 className="text-lg font-semibold mb-6">Application Status & Activity</h3>
            <ApplicationStatusSection showSimilarJobs={false} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileTabs;
