import React from 'react';
import { FiExternalLink, FiTrendingUp } from 'react-icons/fi';

interface FeaturedCandidate {
  id: string;
  name: string;
  title: string;
  skills: string[];
}

interface Event {
  id: string;
  title: string;
  date: string;
  link: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  link: string;
}

interface Skill {
  id: string;
  title: string;
  link: string;
}

interface RightSidebarCardProps {
  featuredCandidates: FeaturedCandidate[];
  upcomingEvents: Event[];
  careerResources: Resource[];
  trendingSkills: Skill[];
}

export const RightSidebarCard: React.FC<RightSidebarCardProps> = ({
  featuredCandidates,
  upcomingEvents,
  careerResources,
  trendingSkills
}) => {
  return (
    <div className="space-y-6">
      {/* Featured Candidates */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Featured Candidates</h3>
        <div className="space-y-4">
          {featuredCandidates.map((candidate) => (
            <div key={candidate.id} className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                {candidate.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-medium text-gray-800">{candidate.name}</h4>
                <p className="text-sm text-gray-600">{candidate.title}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {candidate.skills.map((skill, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
          View all featured candidates
        </button>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Events</h3>
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <h4 className="font-medium text-gray-800">{event.title}</h4>
              <p className="text-sm text-gray-600 mb-1">{formatDate(event.date)}</p>
              <a 
                href={event.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                Learn more <FiExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Career Resources */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Career Resources</h3>
        <div className="space-y-3">
          {careerResources.map((resource) => (
            <div key={resource.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <h4 className="font-medium text-gray-800">{resource.title}</h4>
              <p className="text-sm text-gray-600 mb-1">{resource.description}</p>
              <a 
                href={resource.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                Read more <FiExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Skills */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FiTrendingUp className="text-blue-500" />
          Trending Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {trendingSkills.map((skill) => (
            <a 
              key={skill.id} 
              href={skill.link}
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              {skill.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};
