import React from 'react';
import Image from 'next/image';
import { FaUpload, FaTimes } from 'react-icons/fa';
import { ProfileData } from '../type';

interface BasicInfoFormProps {
  profileData: ProfileData;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>;
  profilePicture: string | null;
  setProfilePicture: React.Dispatch<React.SetStateAction<string | null>>;
  coverImage: string | null;
  setCoverImage: React.Dispatch<React.SetStateAction<string | null>>;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  profileData,
  setProfileData,
  profilePicture,
  setProfilePicture,
  coverImage,
  setCoverImage
}) => {
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Basic Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={profileData.name}
            onChange={handleProfileChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="e.g., John Doe"
          />
        </div>
        
        <div>
          <label htmlFor="headline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Professional Headline*
          </label>
          <input
            type="text"
            id="headline"
            name="headline"
            value={profileData.headline}
            onChange={handleProfileChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="e.g., Senior Software Engineer at Tech Company"
          />
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location*
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={profileData.location}
            onChange={handleProfileChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="e.g., San Francisco, CA"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={profileData.email}
            onChange={handleProfileChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="e.g., john.doe@example.com"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={profileData.phone}
            onChange={handleProfileChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="e.g., (123) 456-7890"
          />
        </div>
        
        <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Website/Portfolio
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={profileData.website}
            onChange={handleProfileChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="e.g., https://yourportfolio.com"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="about" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          About/Summary
        </label>
        <textarea
          id="about"
          name="about"
          value={profileData.about}
          onChange={handleProfileChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Write a brief summary about yourself, your experience, and your career goals..."
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Profile Picture
          </label>
          <div className="mt-1 flex items-center space-x-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              {profilePicture ? (
                <Image 
                  src={profilePicture} 
                  alt="Profile" 
                  width={96} 
                  height={96} 
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-400">No image</span>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer text-sm text-center">
                <FaUpload className="inline-block mr-2" />
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureUpload}
                />
              </label>
              {profilePicture && (
                <button
                  type="button"
                  onClick={() => setProfilePicture(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                >
                  <FaTimes className="inline-block mr-2" />
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cover Image
          </label>
          <div className="mt-1 flex flex-col space-y-2">
            <div className="h-32 w-full rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              {coverImage ? (
                <Image 
                  src={coverImage} 
                  alt="Cover" 
                  width={400} 
                  height={128} 
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-400">No cover image</span>
              )}
            </div>
            <div className="flex space-x-2">
              <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer text-sm text-center flex-1">
                <FaUpload className="inline-block mr-2" />
                Upload Cover
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverImageUpload}
                />
              </label>
              {coverImage && (
                <button
                  type="button"
                  onClick={() => setCoverImage(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                >
                  <FaTimes className="inline-block mr-2" />
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;

