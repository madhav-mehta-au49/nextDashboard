"use client"

import React from 'react';
import Link from 'next/link';
import { 
  Globe, 
  MapPin, 
  Calendar, 
  Users, 
  Tag
} from 'lucide-react';

import { Company } from '../../types';

interface CompanyAboutProps {
  company: Company;
}

export const CompanyAbout: React.FC<CompanyAboutProps> = ({ company }) => {
  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          About {company.name}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
          {company.description}
        </p>
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Company Details */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Company Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Globe className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-medium">Website</span>
            </div>
            <a 
              href={company.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              {company.website.replace(/^https?:\/\//, '')}
            </a>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <MapPin className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-medium">Headquarters</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{company.headquarters}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Calendar className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-medium">Founded</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{company.founded}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Users className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-medium">Company Size</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{company.employees.toLocaleString()} employees</p>
          </div>
        </div>
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Specialties */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Specialties
        </h3>
        <div className="flex flex-wrap gap-2">
          {company.specialties.map((specialty, index) => (
            <span 
              key={index} 
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              <Tag className="h-3.5 w-3.5 mr-1.5" />
              {specialty}
            </span>
          ))}
        </div>
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Locations */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Locations
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {company.locations.map(location => (
            <div 
              key={location.id} 
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-2">
                <MapPin className={`h-5 w-5 ${location.isPrimary ? 'text-green-500' : 'text-gray-400'} mr-2`} />
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {location.city}
                  </span>
                  {location.isPrimary && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      HQ
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 ml-7">{location.country}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Social Media */}
      {(company.socialLinks.linkedin || company.socialLinks.twitter || 
        company.socialLinks.facebook || company.socialLinks.instagram) && (
        <>
          <hr className="border-gray-200 dark:border-gray-700" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Connect with {company.name}
            </h3>
            <div className="flex space-x-4">
              {company.socialLinks.linkedin && (
                <a 
                  href={company.socialLinks.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              )}
              
              {company.socialLinks.twitter && (
                <a 
                  href={company.socialLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              )}
              
              {company.socialLinks.facebook && (
                <a 
                  href={company.socialLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.738-.9 10.126-5.864 10.126-11.854z"/>
                  </svg>
                </a>
              )}
              
              {company.socialLinks.instagram && (
                <a 
                  href={company.socialLinks.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
