import React from 'react';
import Image from 'next/image';
import { FaMapMarkerAlt, FaUserFriends, FaEdit } from 'react-icons/fa';

interface HeroSectionProps {
  data: any;
}

const HeroSection: React.FC<HeroSectionProps> = ({ data }) => {
  return (
    <>
      {/* Cover Photo */}
      <div className="relative h-[200px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${data.coverImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
        
        <div className="absolute bottom-[-50px] left-[50px]">
          <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white bg-white shadow-lg">
            <Image
              src={data.profilePicture}
              alt={data.name}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Header with name & headline */}
      <div className="pt-16 px-8">
        <div className="flex flex-col md:flex-row justify-between md:items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {data.name}
            </h1>
            <p className="text-md text-gray-600 dark:text-gray-400">
              {data.headline}
            </p>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
              <FaMapMarkerAlt className="text-blue-600 mr-1" />
              <span>{data.location}</span>
              <span className="mx-2">•</span>
              <FaUserFriends className="text-blue-600 mr-1" />
              <span>{data.connections}+ connections</span>
            </div>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Connect
            </button>
            <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
              Message
            </button>
            <button className="p-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
              <FaEdit />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
