'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import {
  FaEdit,
  FaExternalLinkAlt,
  FaChevronDown,
  FaChevronUp,
  FaBriefcase,
  FaSchool,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaUserFriends,
  FaEnvelope,
  FaLink,
  FaStar,
  FaCertificate
} from 'react-icons/fa';
import Header from '@/app/web/components/header';
import SubHeader from '@/components/subheader';
import Footer from '@/components/footer';

// This would typically come from an API call
const getMockCandidateData = (id: string) => {
  return {
    name: 'Jane Doe',
    headline: 'Senior UX/UI Designer at Creative Studio',
    location: 'San Francisco Bay Area',
    profilePicture: '/images/avatar.jpg',
    coverImage: '/images/cover.jpg',
    about:
      "Passionate UX/UI designer with 8+ years of experience in creating intuitive user experiences and visually appealing interfaces. Skilled in Next.js, React, Chakra UI, design systems, and rapid prototyping. A firm believer in user-centered design and continuous improvement, with a background in marketing and user research.",
    experience: [
      {
        title: 'Senior UX/UI Designer',
        company: 'Creative Studio',
        duration: 'Jan 2021 - Present',
        location: 'San Francisco, CA',
        details: [
          'Led the design of a new suite of enterprise design systems',
          'Collaborated cross-functionally to implement feedback loops and design reviews',
          'Mentored junior designers in best UI/UX practices',
        ],
      },
      {
        title: 'UI Designer',
        company: 'Tech Innovations Inc.',
        duration: 'Jun 2017 - Dec 2020',
        location: 'Remote',
        details: [
          'Built prototypes and wireframes for a variety of web applications',
          'Conducted user research to inform design decisions',
          'Optimized design workflows and processes',
        ],
      },
    ],
    education: [
      {
        institution: 'University of Design',
        degree: 'B.A. in Graphic Design',
        duration: '2013 - 2017',
      },
    ],
    featured: [
      {
        title: 'Personal Portfolio',
        url: 'https://portfolio.example.com',
        description: 'My recent design portfolio showcasing top projects.',
      },
      {
        title: 'Dribbble Shots',
        url: 'https://dribbble.com/janedoe',
        description: 'A collection of UI concepts and visual explorations.',
      },
    ],
    skills: [
      { skill: 'UX Research', endorsements: 10 },
      { skill: 'Wireframing', endorsements: 25 },
      { skill: 'Prototyping', endorsements: 15 },
      { skill: 'Chakra UI', endorsements: 5 },
      { skill: 'Next.js', endorsements: 8 },
    ],
    certifications: [
      {
        name: "UX Design Professional Certificate",
        issuer: "Google",
        issueDate: "May 2022",
        expirationDate: "No Expiration",
        credentialId: "GOOG-UX-2022-05",
        credentialURL: "https://example.com/cert/ux-design"
      },
      {
        name: "Advanced React Development",
        issuer: "Meta",
        issueDate: "January 2023",
        expirationDate: "January 2026",
        credentialId: "META-REACT-2023-01",
        credentialURL: "https://example.com/cert/react-dev"
      }
    ],
    recommendations: [
      {
        name: 'John Smith',
        relation: 'Former Manager at Tech Innovations Inc.',
        text: "Jane is an exceptional designer who's able to combine creativity with user-centric thinking. She was a valuable asset to our team, consistently delivering top-notch design solutions.",
      },
      {
        name: 'Laura Johnson',
        relation: 'Project Lead at Creative Studio',
        text: "Working with Jane has been a pleasure. Her attention to detail and her ability to iterate quickly based on feedback helped us launch our product on time and with great user satisfaction.",
      },
    ],
    connections: 500,
  };
};

export default function CandidateProfile() {
  const params = useParams();
  const profileId = params.profile as string;

  const [isLoading, setIsLoading] = useState(true);
  const [candidateData, setCandidateData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        // In a real app, you would fetch data from an API
        // const response = await fetch(`/api/candidates/${profileId}`);
        // const data = await response.json();

        // For now, use mock data
        const data = getMockCandidateData(profileId);

        // Simulate network delay
        setTimeout(() => {
          setCandidateData(data);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        console.error('Error fetching candidate data:', err);
        setError('Failed to load candidate profile');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [profileId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !candidateData) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="bg-red-50 p-6 rounded-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Profile</h2>
          <p>{error || 'Candidate profile not found'}</p>
          <button
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header />
      <SubHeader />
      {/* Cover Image */}
      <div className="relative h-[200px] md:h-[250px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${candidateData.coverImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Candidate Header */}
        <div className="mt-[-50px] md:mt-[-70px] relative z-10">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="border border-gray-200 dark:border-gray-700 rounded-full p-1 bg-white shadow-md">
                <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-full overflow-hidden">
                  <Image
                    src={candidateData.profilePicture}
                    alt={candidateData.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{candidateData.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-md">
                  {candidateData.headline}
                </p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>{candidateData.location}</span>
                  <span className="mx-2">•</span>
                  <FaUserFriends className="mr-1" />
                  <span>{candidateData.connections}+ connections</span>
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  <button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
                    Connect
                  </button>
                  <button className="px-4 py-2 border border-teal-600 text-teal-600 rounded-md hover:bg-teal-50 transition-colors">
                    Message
                  </button>
                  <button className="p-2 border border-teal-600 text-teal-600 rounded-md hover:bg-teal-50 transition-colors">
                    <FaEdit />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 my-6">
          <div>
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex">
                  <button
                    className={`px-6 py-3 text-sm font-medium ${activeTab === 'profile'
                      ? 'text-teal-600 border-b-2 border-teal-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    onClick={() => setActiveTab('profile')}
                  >
                    Profile
                  </button>
                  <button
                    className={`px-6 py-3 text-sm font-medium ${activeTab === 'activity'
                      ? 'text-teal-600 border-b-2 border-teal-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                    {/* About Section */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About</h3>
                      <div className={`text-gray-700 dark:text-gray-300 ${!isAboutOpen && 'line-clamp-3'}`}>
                        {candidateData.about}
                      </div>
                      <button
                        className="mt-2 text-teal-600 hover:text-teal-800 text-sm font-medium flex items-center"
                        onClick={() => setIsAboutOpen(!isAboutOpen)}
                      >
                        Show {isAboutOpen ? 'Less' : 'More'}
                        {isAboutOpen ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
                      </button>
                    </div>

                    {/* Featured Section */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Featured</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {candidateData.featured.map((item, idx) => (
                          <div
                            key={idx}
                            className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-gray-50 dark:bg-gray-700"
                          >
                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">{item.title}</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{item.description}</p>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-600 hover:text-teal-800 text-sm flex items-center"
                            >
                              View <FaExternalLinkAlt className="ml-1 text-xs" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Experience Section */}
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <FaBriefcase className="text-teal-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Experience</h3>
                      </div>
                      <hr className="mb-4 border-gray-200 dark:border-gray-700" />
                      <div className="space-y-6">
                        {candidateData.experience.map((exp, idx) => (
                          <div key={idx}>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">{exp.title}</h4>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              {exp.company}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {exp.duration} • {exp.location}
                            </p>
                            <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                              {exp.details.map((detail, index) => (
                                <li key={index}>{detail}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Education Section */}
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <FaSchool className="text-teal-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Education</h3>
                      </div>
                      <hr className="mb-4 border-gray-200 dark:border-gray-700" />
                      <div className="space-y-6">
                        {candidateData.education.map((edu, idx) => (
                          <div key={idx}>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">{edu.institution}</h4>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              {edu.degree}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {edu.duration}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Certifications Section */}
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <FaCertificate className="text-teal-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Certifications</h3>
                      </div>
                      <hr className="mb-4 border-gray-200 dark:border-gray-700" />
                      <div className="space-y-6">
                        {candidateData.certifications.map((cert, idx) => (
                          <div key={idx}>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">{cert.name}</h4>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              {cert.issuer}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Issued {cert.issueDate} {cert.expirationDate !== "No Expiration" && `• Expires ${cert.expirationDate}`}
                            </p>
                            {cert.credentialId && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Credential ID: {cert.credentialId}
                              </p>
                            )}
                            {cert.credentialURL && (
                              <a
                                href={cert.credentialURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-600 hover:text-teal-800 text-sm flex items-center mt-1"
                              >
                                Show credential <FaExternalLinkAlt className="ml-1 text-xs" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skills Section */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skills & Endorsements</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {candidateData.skills.map((skillItem, idx) => (
                          <div
                            key={idx}
                            className="border border-gray-200 dark:border-gray-700 rounded-md p-3 hover:border-blue-300 hover:shadow-sm transition-all"
                          >
                            <div className="flex justify-between items-center">
                              <p className="font-medium text-sm text-gray-900 dark:text-white">
                                {skillItem.skill}
                              </p>
                              <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-teal-900 dark:text-teal-300">
                                {skillItem.endorsements}
                              </span>
                            </div>
                            <div className="flex items-center mt-1">
                              <FaCheckCircle className="text-teal-500 text-xs mr-1" />
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {skillItem.endorsements} endorsements
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recommendations</h3>
                      <div className="space-y-4">
                        {candidateData.recommendations.map((rec, idx) => (
                          <div
                            key={idx}
                            className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-white dark:bg-gray-800"
                          >
                            <p className="font-bold text-gray-900 dark:text-white">
                              {rec.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {rec.relation}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                              "{rec.text}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-lg mb-4 text-gray-600 dark:text-gray-400">
                      No recent activity to display
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Activities such as posts, articles, and comments will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-[100px] space-y-6">
              {/* Candidate Actions */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden p-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                  Profile Actions
                </p>

                <div className="space-y-2">
                  <button className="w-full text-left text-sm px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center">
                    <FaEdit className="mr-2" />
                    Edit Profile
                  </button>

                  <button className="w-full text-left text-sm px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center">
                    <FaBriefcase className="mr-2" />
                    Add Experience
                  </button>

                  <button className="w-full text-left text-sm px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center">
                    <FaSchool className="mr-2" />
                    Add Education
                  </button>
                </div>

                <hr className="my-3 border-gray-200 dark:border-gray-700" />

                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Profile Visibility
                </p>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700 dark:text-gray-300">Public Profile</p>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      name="toggle"
                      id="toggle"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <label
                      htmlFor="toggle"
                      className="block h-6 rounded-full bg-gray-300 cursor-pointer peer-checked:bg-teal-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                    ></label>
                  </div>
                </div>
              </div>

              {/* Profile Completion */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden p-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                  Profile Completion
                </p>

                <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mb-2">
                  <div className="w-[85%] h-full bg-teal-500 rounded-full"></div>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                  Your profile is 85% complete
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-700 dark:text-gray-300">Add a profile photo</p>
                    <FaCheckCircle className="text-green-500 text-xs" />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-700 dark:text-gray-300">Add your experience</p>
                    <FaCheckCircle className="text-green-500 text-xs" />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-700 dark:text-gray-300">Add your education</p>
                    <FaCheckCircle className="text-green-500 text-xs" />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-700 dark:text-gray-300">Add your skills</p>
                    <FaCheckCircle className="text-green-500 text-xs" />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-700 dark:text-gray-300">Get recommendations</p>
                    <FaCheckCircle className="text-green-500 text-xs" />
                  </div>
                </div>
              </div>

              {/* People Also Viewed */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden p-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                  People Also Viewed
                </p>

                <div className="space-y-4">
                  {[
                    { name: "Alex Johnson", title: "Product Designer", image: "/images/avatar.jpg" },
                    { name: "Sarah Miller", title: "UX Researcher", image: "/images/avatar.jpg" },
                    { name: "David Chen", title: "UI Developer", image: "/images/avatar.jpg" }
                  ].map((person, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="relative h-8 w-8 rounded-full overflow-hidden">
                        <Image
                          src={person.image}
                          alt={person.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{person.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{person.title}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full text-teal-600 hover:text-teal-800 text-sm font-medium mt-4">
                  View More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

