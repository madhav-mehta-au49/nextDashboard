'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  FiUpload, 
  FiPlus, 
  FiX, 
  FiGlobe, 
  FiMapPin, 
  FiCalendar, 
  FiUsers,
  FiInfo,
  FiCheck
} from 'react-icons/fi';

export default function CreateCompanyProfile() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [locations, setLocations] = useState<{id: string, city: string, country: string, isPrimary: boolean}[]>([]);
  const [socialLinks, setSocialLinks] = useState({
    linkedin: '',
    twitter: '',
    facebook: '',
    instagram: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    description: '',
    website: '',
    headquarters: '',
    founded: '',
    employees: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialLinks(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (index: number) => {
    setSpecialties(specialties.filter((_, i) => i !== index));
  };

  const addLocation = () => {
    const newLocation = {
      id: Date.now().toString(),
      city: '',
      country: '',
      isPrimary: locations.length === 0 // First location is primary by default
    };
    setLocations([...locations, newLocation]);
  };

  const updateLocation = (id: string, field: string, value: string | boolean) => {
    setLocations(locations.map(loc => 
      loc.id === id ? { ...loc, [field]: value } : loc
    ));
  };

  const removeLocation = (id: string) => {
    const updatedLocations = locations.filter(loc => loc.id !== id);
    // If we removed the primary location and there are still locations left, make the first one primary
    if (locations.find(loc => loc.id === id)?.isPrimary && updatedLocations.length > 0) {
      updatedLocations[0].isPrimary = true;
    }
    setLocations(updatedLocations);
  };

  const setPrimaryLocation = (id: string) => {
    setLocations(locations.map(loc => ({
      ...loc,
      isPrimary: loc.id === id
    })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // In a real app, you would send this data to your API
      // const response = await fetch('/api/companies', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...formData,
      //     specialties,
      //     locations,
      //     socialLinks,
      //     logoUrl: logoPreview,
      //     coverImageUrl: coverPreview
      //   })
      // });
      
      // if (!response.ok) throw new Error('Failed to create company profile');
      // const data = await response.json();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccessMessage('Company profile created successfully!');
      
      // Redirect to the new company profile page after a delay
      setTimeout(() => {
        // In a real app, you would redirect to the actual company ID
        // router.push(`/companies/${data.id}`);
        router.push('/companies/1');
      }, 2000);
    } catch (error) {
      console.error('Error creating company profile:', error);
      setErrorMessage('Failed to create company profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create Company Profile</h1>
            
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 flex items-center">
                <FiCheck className="mr-2" />
                <p>{successMessage}</p>
              </div>
            )}
            
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center">
                <FiInfo className="mr-2" />
                <p>{errorMessage}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company Name*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter company name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Industry*
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Education">Education</option>
                      <option value="Retail">Retail</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Media">Media & Entertainment</option>
                      <option value="Hospitality">Hospitality & Tourism</option>
                      <option value="Construction">Construction</option>
                      <option value="Transportation">Transportation & Logistics</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company Description*
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Describe your company, mission, values, and what sets you apart..."
                  />
                </div>
              </div>
              
              {/* Company Details */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <FiGlobe className="inline mr-1" /> Website*
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="https://example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="headquarters" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <FiMapPin className="inline mr-1" /> Headquarters*
                    </label>
                    <input
                      type="text"
                      id="headquarters"
                      name="headquarters"
                      value={formData.headquarters}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="City, Country"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="founded" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <FiCalendar className="inline mr-1" /> Founded Year*
                    </label>
                    <input
                      type="number"
                      id="founded"
                      name="founded"
                      value={formData.founded}
                      onChange={handleInputChange}
                      required
                      min="1800"
                      max={new Date().getFullYear()}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g. 2010"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="employees" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <FiUsers className="inline mr-1" /> Number of Employees*
                    </label>
                    <select
                      id="employees"
                      name="employees"
                      value={formData.employees}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select company size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1001-5000">1001-5000 employees</option>
                      <option value="5001-10000">5001-10000 employees</option>
                      <option value="10001+">10001+ employees</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Company Logo & Cover Image */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company Branding</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Logo
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                        {logoPreview ? (
                          <div className="relative w-full h-full">
                            <Image 
                              src={logoPreview} 
                              alt="Company logo preview" 
                              fill
                              className="object-contain"
                            />
                            <button 
                              type="button"
                              onClick={() => setLogoPreview(null)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                            >
                              <FiX />
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer text-center p-2">
                            <FiUpload className="mx-auto text-gray-400 mb-1" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">Upload Logo</span>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={handleLogoUpload}
                            />
                          </label>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <p>Recommended: Square image, 400x400px or larger</p>
                        <p>PNG or JPG format</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cover Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                      {coverPreview ? (
                        <div className="relative h-40">
                          <Image 
                            src={coverPreview} 
                            alt="Cover image preview" 
                            fill
                            className="object-cover"
                          />
                          <button 
                            type="button"
                            onClick={() => setCoverPreview(null)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <FiX />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center h-40">
                          <FiUpload className="text-gray-400 mb-2" size={24} />
                          <span className="text-sm text-gray-500 dark:text-gray-400">Upload Cover Image</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Recommended: 1200x300px</p>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleCoverUpload}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Specialties */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company Specialties</h2>
                <div className="flex flex-wrap gap-2 mb-3">
                  {specialties.map((specialty, index) => (
                    <div 
                      key={index} 
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {specialty}
                      <button 
                        type="button" 
                        onClick={() => removeSpecialty(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Add a specialty (e.g., Software Development)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                  />
                  <button
                    type="button"
                    onClick={addSpecialty}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                  >
                    <FiPlus />
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Add specialties that describe your company's expertise (e.g., Cloud Computing, Digital Marketing)
                </p>
              </div>
              
              {/* Locations */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Company Locations</h2>
                  <button
                    type="button"
                    onClick={addLocation}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center"
                  >
                    <FiPlus className="mr-1" /> Add Location
                  </button>
                </div>
                
                {locations.length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">No locations added yet</p>
                    <button
                      type="button"
                      onClick={addLocation}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm inline-flex items-center"
                    >
                      <FiPlus className="mr-1" /> Add First Location
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {locations.map((location) => (
                      <div 
                        key={location.id} 
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center">
                            <FiMapPin className="text-blue-500 mr-2" />
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {location.city || 'New Location'}
                            </h3>
                            {location.isPrimary && (
                              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                HQ
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeLocation(location.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FiX />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              City*
                            </label>
                            <input
                              type="text"
                              value={location.city}
                              onChange={(e) => updateLocation(location.id, 'city', e.target.value)}
                              required
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                              placeholder="e.g., San Francisco"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Country*
                            </label>
                            <input
                              type="text"
                              value={location.country}
                              onChange={(e) => updateLocation(location.id, 'country', e.target.value)}
                              required
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                              placeholder="e.g., United States"
                            />
                          </div>
                        </div>
                        
                        {!location.isPrimary && (
                          <button
                            type="button"
                            onClick={() => setPrimaryLocation(location.id)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Set as Headquarters
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Social Links */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Social Media Links</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      id="linkedin"
                      name="linkedin"
                      value={socialLinks.linkedin}
                      onChange={handleSocialLinkChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="https://linkedin.com/company/..."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Twitter
                    </label>
                    <input
                      type="url"
                      id="twitter"
                      name="twitter"
                      value={socialLinks.twitter}
                      onChange={handleSocialLinkChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Facebook
                    </label>
                    <input
                      type="url"
                      id="facebook"
                      name="facebook"
                      value={socialLinks.facebook}
                      onChange={handleSocialLinkChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Instagram
                    </label>
                    <input
                      type="url"
                      id="instagram"
                      name="instagram"
                      value={socialLinks.instagram}
                      onChange={handleSocialLinkChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md mr-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Profile...
                      </>
                    ) : (
                      'Create Company Profile'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

