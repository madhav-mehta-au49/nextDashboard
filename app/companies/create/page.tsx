'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Building, 
  Upload, 
  Plus, 
  X, 
  Globe, 
  MapPin, 
  Calendar, 
  Users,
  Info,
  Check,
  ArrowLeft
} from 'lucide-react';

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
        {/* Header with back button */}
        <div className="mb-6 flex items-center">
          <button 
            onClick={() => router.back()} 
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="ml-2">Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Company Profile</h1>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {/* Progress indicator */}
          <div className="w-full bg-gray-100 dark:bg-gray-700 h-1">
            <div className="bg-teal-500 h-1 w-0 transition-all duration-300" style={{ width: isSubmitting ? '100%' : '0%' }}></div>
          </div>
          
          <div className="p-6 sm:p-8">
            {successMessage && (
              <div className="p-4 mb-6 rounded-md bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700">
                <div className="flex">
                  <Check className="h-5 w-5 text-green-400 dark:text-green-300" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Success</h3>
                    <div className="mt-1 text-sm text-green-700 dark:text-green-300">
                      {successMessage}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {errorMessage && (
              <div className="p-4 mb-6 rounded-md bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700">
                <div className="flex">
                  <Info className="h-5 w-5 text-red-400 dark:text-red-300" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                    <div className="mt-1 text-sm text-red-700 dark:text-red-300">
                      {errorMessage}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div>
                <div className="flex items-center mb-4">
                  <Building className="text-teal-500 mr-2 h-5 w-5" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>
                </div>
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
                      placeholder="Enter company name"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white bg-white dark:bg-gray-700"
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
                    placeholder="Describe your company, mission, values, and what sets you apart..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                  ></textarea>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Minimum 100 characters. Include your company's mission, values, and what makes you unique.
                  </p>
                </div>
              </div>
              
              {/* Company Details */}
              <div>
                <div className="flex items-center mb-4">
                  <Info className="text-teal-500 mr-2 h-5 w-5" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Company Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Globe className="inline mr-1 h-4 w-4" /> Website*
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      required
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="headquarters" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <MapPin className="inline mr-1 h-4 w-4" /> Headquarters*
                    </label>
                    <input
                      type="text"
                      id="headquarters"
                      name="headquarters"
                      value={formData.headquarters}
                      onChange={handleInputChange}
                      required
                      placeholder="City, Country"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="founded" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Calendar className="inline mr-1 h-4 w-4" /> Founded Year*
                    </label>
                    <input
                      type="number"
                      id="founded"
                      name="                      founded"
                      value={formData.founded}
                      onChange={handleInputChange}
                      required
                      min="1800"
                      max={new Date().getFullYear()}
                      placeholder="e.g. 2010"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="employees" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Users className="inline mr-1 h-4 w-4" /> Number of Employees*
                    </label>
                    <select
                      id="employees"
                      name="employees"
                      value={formData.employees}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white bg-white dark:bg-gray-700"
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
                <div className="flex items-center mb-4">
                  <Upload className="text-teal-500 mr-2 h-5 w-5" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Company Branding</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Logo
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center overflow-hidden relative">
                        {logoPreview ? (
                          <Image 
                            src={logoPreview} 
                            alt="Company logo preview" 
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Building className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Logo
                          <input 
                            type="file" 
                            className="sr-only" 
                            accept="image/*"
                            onChange={handleLogoUpload}
                          />
                        </label>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Recommended: Square image, at least 400x400px
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cover Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-2 relative">
                      {coverPreview ? (
                        <div className="h-32 relative">
                          <Image 
                            src={coverPreview} 
                            alt="Cover image preview" 
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      ) : (
                        <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                          <Globe className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <div className="mt-2">
                        <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Cover Image
                          <input 
                            type="file" 
                            className="sr-only" 
                            accept="image/*"
                            onChange={handleCoverUpload}
                          />
                        </label>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Recommended: 1200x300px, 4:1 ratio
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Specialties */}
              <div>
                <div className="flex items-center mb-4">
                  <Info className="text-teal-500 mr-2 h-5 w-5" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Company Specialties</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      placeholder="Add a specialty (e.g., Machine Learning, Digital Marketing)"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                    />
                    <button 
                      type="button" 
                      onClick={addSpecialty}
                      disabled={!newSpecialty.trim()}
                      className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </button>
                  </div>
                  
                  {specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {specialties.map((specialty, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100">
                          {specialty}
                          <button 
                            type="button" 
                            onClick={() => removeSpecialty(index)}
                            className="ml-1.5 text-teal-600 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-100 focus:outline-none"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {specialties.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      No specialties added yet. Add at least 3 specialties to help others understand your company's expertise.
                    </p>
                  )}
                </div>
              </div>
              
              {/* Locations */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <MapPin className="text-teal-500 mr-2 h-5 w-5" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Company Locations</h2>
                  </div>
                  <button 
                    type="button" 
                    onClick={addLocation}
                    className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Location
                  </button>
                </div>
                
                {locations.length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No locations added yet. Add your company's locations to help candidates find you.
                    </p>
                    <button 
                      type="button" 
                      onClick={addLocation}
                      className="mt-3 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 inline-flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Location
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {locations.map((location) => (
                      <div 
                        key={location.id} 
                        className={`border ${location.isPrimary ? 'border-teal-500 dark:border-teal-400' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4 relative`}
                      >
                        {location.isPrimary && (
                          <span className="absolute top-0 right-0 -mt-2 -mr-2 px-2 py-0.5 bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100 text-xs font-medium rounded-full">
                            Headquarters
                          </span>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              City*
                            </label>
                            <input
                              type="text"
                              value={location.city}
                              onChange={(e) => updateLocation(location.id, 'city', e.target.value)}
                              placeholder="e.g., San Francisco"
                              required
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
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
                              placeholder="e.g., United States"
                              required
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-between mt-4">
                          {!location.isPrimary ? (
                            <button 
                              type="button" 
                              onClick={() => setPrimaryLocation(location.id)}
                              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                            >
                              Set as Headquarters
                            </button>
                          ) : (
                            <div></div> // Empty div to maintain layout
                          )}
                          
                          <button 
                            type="button" 
                            onClick={() => removeLocation(location.id)}
                            className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 focus:outline-none flex items-center"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Social Links */}
                <div>
                  <div className="flex items-center mb-4">
                    <Globe className="text-teal-500 mr-2 h-5 w-5" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Social Media Links</h2>
                  </div>
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
                        placeholder="https://linkedin.com/company/..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Twitter / X
                      </label>
                      <input
                        type="url"
                        id="twitter"
                        name="twitter"
                        value={socialLinks.twitter}
                        onChange={handleSocialLinkChange}
                        placeholder="https://twitter.com/..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
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
                        placeholder="https://facebook.com/..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
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
                        placeholder="https://instagram.com/..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Submit Section */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      * Required fields
                    </p>
                    <div className="flex gap-3">
                      <button 
                        type="button" 
                        onClick={() => router.back()}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Creating Profile...' : 'Create Company Profile'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
  

