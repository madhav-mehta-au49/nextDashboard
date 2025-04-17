"use client"

import React from "react"
import Link from "next/link"
import { FiSearch, FiBriefcase, FiMapPin, FiTrendingUp, FiUser, FiFilter, FiArrowRight, FiStar } from "react-icons/fi"
import Header from "./web/components/header"
import SubHeader from "../components/subheader"
import Footer from "@/components/footer"



const dummyJobs = [
  {
    id: "1",
    title: "Software Engineer",
    description: "Develop and maintain web applications",
    company: "TechCorp",
    location: "San Francisco, CA",
    featured: true
  },
  {
    id: "2",
    title: "Product Manager",
    description: "Lead product strategy and development",
    company: "InnovateCo",
    location: "New York, NY"
  },
  {
    id: "3",
    title: "UX Designer",
    description: "Create user-centered design solutions",
    company: "DesignHub",
    location: "Remote"
  },
  {
    id: "4",
    title: "Data Scientist",
    description: "Analyze and interpret complex data sets",
    company: "DataWorks",
    location: "Boston, MA"
  }
]

export default function Web() {
  const [searchType, setSearchType] = React.useState("jobs")

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <SubHeader />
      {/* Hero Section with Gradient - Updated Color Scheme */}
      <div className="bg-gradient-to-r from-teal-700 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-16 relative">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/3 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-1/3 -translate-x-1/3"></div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Find Your Dream Job Today
            </h1>
            <p className="text-lg md:text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
              Discover thousands of job opportunities with all the information you need to advance your career.
            </p>

            {/* Search Type Tabs */}
            <div className="inline-flex bg-blue-700/30 rounded-t-lg mb-0 overflow-hidden">
              <button
                className={`px-6 py-3 font-medium text-sm flex items-center gap-2 transition-colors ${searchType === 'jobs' ? 'bg-white text-blue-700' : 'text-white hover:bg-blue-700/50'}`}
                onClick={() => setSearchType('jobs')}
              >
                <FiBriefcase />
                Jobs
              </button>
              <button
                className={`px-6 py-3 font-medium text-sm flex items-center gap-2 transition-colors ${searchType === 'candidates' ? 'bg-white text-blue-700' : 'text-white hover:bg-blue-700/50'}`}
                onClick={() => setSearchType('candidates')}
              >
                <FiUser />
                Candidates
              </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-5 rounded-lg shadow-xl rounded-tl-none">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder={searchType === 'jobs' ? "Job title, keywords, or company" : "Candidate name, skills, or title"}
                    className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex-1 relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Location"
                    className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:w-auto flex gap-2">
                  <button className="flex items-center justify-center px-4 py-3 border border-gray-200 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                    <FiFilter size={20} className="text-gray-500" />
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 whitespace-nowrap shadow-sm">
                    Search
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <span>Popular {searchType === 'jobs' ? 'jobs' : 'skills'}:</span>
                {searchType === 'jobs' ? (
                  <>
                    <Link href="/jobs/remote" className="text-blue-600 hover:text-blue-800 transition-colors">
                      Remote
                    </Link>
                    <Link href="/jobs/tech" className="text-blue-600 hover:text-blue-800 transition-colors">
                      Technology
                    </Link>
                    <Link href="/jobs/marketing" className="text-blue-600 hover:text-blue-800 transition-colors">
                      Marketing
                    </Link>
                    <Link href="/jobs/design" className="text-blue-600 hover:text-blue-800 transition-colors">
                      Design
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/candidates/react" className="text-blue-600 hover:text-blue-800 transition-colors">
                      React
                    </Link>
                    <Link href="/candidates/javascript" className="text-blue-600 hover:text-blue-800 transition-colors">
                      JavaScript
                    </Link>
                    <Link href="/candidates/product-management" className="text-blue-600 hover:text-blue-800 transition-colors">
                      Product Management
                    </Link>
                    <Link href="/candidates/ui-ux" className="text-blue-600 hover:text-blue-800 transition-colors">
                      UI/UX
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-teal-600 mb-1">10k+</p>
              <p className="text-gray-600">Job Listings</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-teal-600 mb-1">5k+</p>
              <p className="text-gray-600">Companies</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-teal-600 mb-1">20k+</p>
              <p className="text-gray-600">Candidates</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-teal-600 mb-1">95%</p>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Jobs Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Jobs</h2>
          <Link
            href="/jobs"
            className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 group"
          >
            View all jobs
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Featured Job Card */}
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-100 shadow-md p-6 md:p-8 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-teal-100/50 rounded-full -translate-y-1/2 translate-x-1/2 z-0"></div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-block p-2 bg-teal-100 text-teal-600 rounded-md">
                    <FiStar size={18} />
                  </span>
                  <span className="text-teal-700 font-medium">Featured Opportunity</span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  Senior Software Engineer
                </h3>
                <p className="text-gray-600 mb-4 max-w-2xl">
                  Join our innovative team to build cutting-edge solutions. We offer competitive salary, comprehensive benefits, and a flexible work environment.
                </p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center text-gray-700">
                    <FiBriefcase className="mr-1" />
                    <span>TechInnovate Inc.</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FiMapPin className="mr-1" />
                    <span>Remote (US)</span>
                  </div>
                  <div className="font-medium text-gray-900">
                    $140K - $180K
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 shadow-sm">
                  Apply Now
                </button>
                <button className="bg-white text-teal-600 border border-teal-200 px-6 py-3 rounded-md font-medium hover:bg-teal-50 transition-colors duration-200">
                  Save Job
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dummyJobs.map((job) => (
            <div
              key={job.id}
              className={`${job.featured ? 'ring-2 ring-teal-500 ring-offset-2' : 'border border-gray-200'} bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-5 group`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 ${job.featured ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-600'} rounded-md flex items-center justify-center group-hover:bg-teal-100 group-hover:text-teal-600 transition-colors`}>
                  <FiBriefcase size={24} />
                </div>
                {job.featured && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                    Featured
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">{job.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{job.company}</p>

              <div className="flex items-center text-gray-500 text-sm mb-3">
                <FiMapPin size={14} className="mr-1" />
                <span>{job.location}</span>
              </div>

              <p className="text-sm text-gray-700 mb-4 line-clamp-2">{job.description}</p>

              <div className="pt-3 border-t border-gray-100">
                <button className="w-full text-center py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Section with Alternating Background */}
      <div className="bg-slate-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Explore Job Categories
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Browse jobs by category to find the perfect role for your skills and experience
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {[
              { name: 'Technology', icon: '💻', count: 1245 },
              { name: 'Healthcare', icon: '🏥', count: 873 },
              { name: 'Finance', icon: '💰', count: 642 },
              { name: 'Marketing', icon: '📊', count: 518 },
              { name: 'Design', icon: '🎨', count: 392 },
              { name: 'Education', icon: '🎓', count: 287 }
            ].map((category) => (
              <Link
                href={`/jobs/category/${category.name.toLowerCase()}`}
                key={category.name}
                className="bg-white rounded-lg border border-gray-200 p-5 text-center hover:shadow-md transition-shadow group"
              >
                <div className="text-3xl mb-3">{category.icon}</div>
                <h3 className="font-medium text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {category.count.toLocaleString()} jobs
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* For Employers Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">For Employers</h2>
              <p className="text-indigo-100 mb-6 text-lg">
                Find the perfect candidates for your open positions. Post jobs, review applications, and build your team with our powerful recruiting tools.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-md font-medium transition-colors duration-200 shadow-sm">
                  Post a Job
                </button>
                <button className="bg-transparent text-white border border-white hover:bg-indigo-700 px-6 py-3 rounded-md font-medium transition-colors duration-200">
                  Learn More
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 max-w-md">
                <h3 className="text-xl font-semibold mb-4">Employer Benefits</h3>
                <ul className="space-y-3">
                  {[
                    'Access to thousands of qualified candidates',
                    'Advanced filtering and matching algorithms',
                    'Branded company profile and job listings',
                    'Applicant tracking and management tools',
                    'Analytics and reporting features'
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-300 mt-1">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Success Stories
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Hear from job seekers and employers who found success with our platform
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'UX Designer at DesignHub',
                image: 'https://randomuser.me/api/portraits/women/32.jpg',
                quote: 'I found my dream job within two weeks of creating my profile. The matching algorithm really works!'
              },
              {
                name: 'Michael Chen',
                role: 'HR Director at TechCorp',
                image: 'https://randomuser.me/api/portraits/men/44.jpg',
                quote: 'As an employer, I\'ve been able to find qualified candidates quickly and efficiently. The quality of applicants is outstanding.'
              },
              {
                name: 'Jessica Williams',
                role: 'Marketing Manager at GrowthCo',
                image: 'https://randomuser.me/api/portraits/women/68.jpg',
                quote: 'The platform made it easy to showcase my skills and connect with companies that aligned with my career goals.'
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-teal-500"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-teal-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Take the Next Step in Your Career?
          </h2>
          <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have found their dream jobs through our platform. It's free and only takes a few minutes to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-teal-600 hover:bg-teal-50 px-8 py-3 rounded-md font-medium transition-colors duration-200 shadow-md">
              Create an Account
            </button>
            <button className="bg-transparent text-white border border-white hover:bg-teal-700 px-8 py-3 rounded-md font-medium transition-colors duration-200">
              Browse Jobs
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

