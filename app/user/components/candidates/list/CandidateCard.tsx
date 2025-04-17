"use client"

import React from 'react';
import { FiMapPin, FiUsers, FiBriefcase, FiBook } from 'react-icons/fi';

interface CandidateCardProps {
  name: string;
  headline: string;
  location: string;
  connections: number;
  skills: string[];
  experience: string;
  education: string;
  profilePicture: string;
  availability: string;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  name,
  headline,
  location,
  connections,
  skills,
  experience,
  education,
  profilePicture,
  availability
}) => {
  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'Actively looking':
        return 'bg-green-100 text-green-800';
      case 'Open to opportunities':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-5 transform hover:-translate-y-1 hover:border-blue-200">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-shrink-0">
          <img 
            src={profilePicture} 
            alt={name} 
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-100"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/80?text=' + name.charAt(0);
            }}
          />
        </div>

        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{name}</h3>
              <p className="text-gray-600 mb-2">{headline}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(availability)} self-start sm:self-center mt-2 sm:mt-0`}>
              {availability}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 mb-4">
            <div className="flex items-center text-gray-600">
              <FiMapPin className="mr-2 text-blue-500" />
              <span className="text-sm">{location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FiUsers className="mr-2 text-blue-500" />
              <span className="text-sm">{connections}+ connections</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FiBriefcase className="mr-2 text-blue-500" />
              <span className="text-sm">{experience}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FiBook className="mr-2 text-blue-500" />
              <span className="text-sm">{education}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span 
                key={index} 
                className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
