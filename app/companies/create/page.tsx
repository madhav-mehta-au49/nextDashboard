'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {
  Building,
  Upload,
  X,
  Plus,
  MapPin,
  Globe,
  Briefcase,
  Users,
  Calendar,
  Link as LinkIcon,
  Trash2
} from 'lucide-react';
import Image from 'next/image';

export default function CreateCompanyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Store actual files for upload
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [specialties, setSpecialties] = useState<string[]>([]);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [locations, setLocations] = useState<{ id: string, city: string, country: string, isPrimary: boolean }[]>([]);
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
    employees: '', // integer as string
    size: '', // dropdown value (e.g., '1-10')
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'size') {
      let employeesInt = '';
      if (value) {
        const match = value.match(/(\d+)(?:-(\d+)|\+)?/);
        if (match) {
          employeesInt = match[2] ? match[2] : match[1];
        }
      }
      setFormData(prev => ({
        ...prev,
        size: value,
        employees: employeesInt
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file); // Store the actual file
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
      setCoverFile(file); // Store the actual file
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties(prev => [...prev, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const handleRemoveSpecialty = (specialty: string) => {
    setSpecialties(prev => prev.filter(s => s !== specialty));
  };

  const handleAddLocation = () => {
    setLocations(prev => [
      ...prev,
      {
        id: uuidv4(),
        city: '',
        country: '',
        isPrimary: prev.length === 0 // First location is primary by default
      }
    ]);
  };

  const handleLocationChange = (id: string, field: string, value: string | boolean) => {
    setLocations(prev =>
      prev.map(location =>
        location.id === id ? { ...location, [field]: value } : location
      )
    );
  };

  const handleRemoveLocation = (id: string) => {
    setLocations(prev => {
      const filtered = prev.filter(location => location.id !== id);

      // If we removed the primary location and there are still locations left,
      // make the first one primary
      if (prev.find(loc => loc.id === id)?.isPrimary && filtered.length > 0) {
        return filtered.map((loc, index) =>
          index === 0 ? { ...loc, isPrimary: true } : loc
        );
      }

      return filtered;
    });
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setSocialLinks(prev => ({ ...prev, [platform]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // const token = localStorage.getItem('token');
      // if (!token) {
      //   setErrorMessage('You must be logged in to create a company profile');
      //   setIsSubmitting(false);
      //   return;
      // }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

      // Create FormData for file uploads
      const formDataToSend = new FormData();

      // Add basic company data
      (Object.entries(formData) as [keyof typeof formData, string][]).forEach(([key, value]) => {
        if (value !== '') {
          formDataToSend.append(key, value);
        }
      });

      // Add specialties
      specialties.forEach((specialty, index) => {
        formDataToSend.append(`specialties[${index}]`, specialty);
      });

      // Add locations
      locations.forEach((location, index) => {
        formDataToSend.append(`locations[${index}][city]`, location.city);
        formDataToSend.append(`locations[${index}][country]`, location.country);
        formDataToSend.append(`locations[${index}][is_primary]`, location.isPrimary ? '1' : '0');
      });

      // Add social links
      (Object.entries(socialLinks) as [keyof typeof socialLinks, string][]).forEach(([platform, value]) => {
        if (value) {
          formDataToSend.append(`social_links[${platform}]`, value);
        }
      });

      // Add files if they exist
      if (logoFile) {
        formDataToSend.append('logo_file', logoFile);
      }

      if (coverFile) {
        formDataToSend.append('cover_file', coverFile);
      }

      const response = await axios.post(`${API_URL}/companies`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });


      if (response.data.status === 'success') {
        setSuccessMessage('Company profile created successfully!');
        // Redirect to the new company profile page after a delay
        setTimeout(() => {
          router.push(`/companies/${response.data.data.slug}`);
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Failed to create company profile');
      }
    } catch (error) {
      console.error('Error creating company profile:', error);
      setErrorMessage('Failed to create company profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Company Profile</h1>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Building className="mr-2 h-5 w-5 text-teal-500" />
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                    Industry*
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="">Select Industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Retail">Retail</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Media">Media</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Energy">Energy</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Description*
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Describe your company, mission, values, and what makes it unique..."
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                    Website*
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label htmlFor="headquarters" className="block text-sm font-medium text-gray-700 mb-1">
                    Headquarters*
                  </label>
                  <input
                    type="text"
                    id="headquarters"
                    name="headquarters"
                    value={formData.headquarters}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <label htmlFor="founded" className="block text-sm font-medium text-gray-700 mb-1">
                    Founded Year*
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Size*
                  </label>
                  <select
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="">Select Company Size</option>
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

            {/* Company Images */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Upload className="mr-2 h-5 w-5 text-teal-500" />
                Company Images
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Logo
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {logoPreview ? (
                        <div className="relative">
                          <Image
                            src={logoPreview}
                            alt="Logo preview"
                            width={100}
                            height={100}
                            className="mx-auto object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setLogoPreview(null);
                              setLogoFile(null);
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="logo-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500"
                            >
                              <span>Upload a logo</span>
                              <input
                                id="logo-upload"
                                name="logo-upload"
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleLogoUpload}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Image
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {coverPreview ? (
                        <div className="relative">
                          <Image
                            src={coverPreview}
                            alt="Cover preview"
                            width={200}
                            height={100}
                            className="mx-auto object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setCoverPreview(null);
                              setCoverFile(null);
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="cover-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500"
                            >
                              <span>Upload a cover</span>
                              <input
                                id="cover-upload"
                                name="cover-upload"
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleCoverUpload}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Briefcase className="mr-2 h-5 w-5 text-teal-500" />
                Company Specialties
              </h2>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Add a specialty (e.g., Machine Learning, Cloud Computing)"
                  />
                  <button
                    type="button"
                    onClick={handleAddSpecialty}
                    className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {specialties.map((specialty, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 rounded-full"
                    >
                      <span>{specialty}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecialty(specialty)}
                        className="text-teal-500 hover:text-teal-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {specialties.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No specialties added yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Locations */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-teal-500" />
                  Company Locations
                </h2>
                <button
                  type="button"
                  onClick={handleAddLocation}
                  className="px-3 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center gap-1 text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Location
                </button>
              </div>

              <div className="space-y-4">
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className="p-4 border border-gray-200 rounded-md bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id={`primary-${location.id}`}
                          name="primary-location"
                          checked={location.isPrimary}
                          onChange={() => {
                            // Update all locations to set only this one as primary
                            setLocations(prev =>
                              prev.map(loc => ({
                                ...loc,
                                isPrimary: loc.id === location.id
                              }))
                            );
                          }}
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                        />
                        <label
                          htmlFor={`primary-${location.id}`}
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Primary Location / Headquarters
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveLocation(location.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City*
                        </label>
                        <input
                          type="text"
                          value={location.city}
                          onChange={(e) => handleLocationChange(location.id, 'city', e.target.value)}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country*
                        </label>
                        <input
                          type="text"
                          value={location.country}
                          onChange={(e) => handleLocationChange(location.id, 'country', e.target.value)}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {locations.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No locations added yet</p>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Globe className="mr-2 h-5 w-5 text-teal-500" />
                Social Media Links
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      <LinkIcon className="h-5 w-5" />
                    </span>
                    <input
                      type="url"
                      value={socialLinks.linkedin}
                      onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-r-md focus:ring-teal-500 focus:border-teal-500"
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      <LinkIcon className="h-5 w-5" />
                    </span>
                    <input
                      type="url"
                      value={socialLinks.twitter}
                      onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-r-md focus:ring-teal-500 focus:border-teal-500"
                      placeholder="https://twitter.com/yourcompany"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      <LinkIcon className="h-5 w-5" />
                    </span>
                    <input
                      type="url"
                      value={socialLinks.facebook}
                      onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-r-md focus:ring-teal-500 focus:border-teal-500"
                      placeholder="https://facebook.com/yourcompany"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      <LinkIcon className="h-5 w-5" />
                    </span>
                    <input
                      type="url"
                      value={socialLinks.instagram}
                      onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-r-md focus:ring-teal-500 focus:border-teal-500"
                      placeholder="https://instagram.com/yourcompany"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => router.push('/companies')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 mr-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create Company Profile'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


