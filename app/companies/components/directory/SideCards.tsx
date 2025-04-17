import React from "react";
import Link from "next/link";
import { FaQuoteLeft, FaCalendarAlt, FaRss, FaBookmark } from "react-icons/fa";

interface Testimonial {
  id: string;
  user: string;
  feedback: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  link?: string; // Make link optional
}

interface FeedItem {
  id: string;
  title: string;
  content: string;
  time: string;
  link?: string; // Make link optional
}

interface TrendingBlog {
  id: string;
  title: string;
  link?: string; // Make link optional
}

interface RightSidebarCardProps {
  testimonials: Testimonial[];
  events: Event[];
  feedItems: FeedItem[];
  trendingBlogs: TrendingBlog[];
}

export const RightSidebarCard: React.FC<RightSidebarCardProps> = ({
  testimonials,
  events,
  feedItems,
  trendingBlogs,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Testimonials Section */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-teal-700 mb-4">What People Say</h3>
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-blue-50 p-3 rounded-md relative">
              <FaQuoteLeft className="text-blue-200 absolute top-2 left-2" size={12} />
              <p className="text-sm text-gray-700 italic pl-5">"{testimonial.feedback}"</p>
              <p className="text-xs text-gray-500 mt-2 text-right">- {testimonial.user}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-teal-700 mb-4">Upcoming Events</h3>
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="border border-gray-200 rounded-md p-3 hover:border-blue-300 transition-colors">
              <h4 className="font-medium text-gray-900">{event.title}</h4>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <FaCalendarAlt className="mr-1 text-teal-500" size={12} />
                <span>{event.date}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{event.location}</p>
              {/* Fix: Add conditional rendering for the Link component */}
              {event.link ? (
                <Link 
                  href={event.link} 
                  className="text-teal-600 hover:text-teal-700 text-sm font-medium mt-2 inline-block"
                >
                  View Event
                </Link>
              ) : (
                <span className="text-teal-600 text-sm font-medium mt-2 inline-block">
                  View Event
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Company Feed Section */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-teal-700 mb-4">Company Feed</h3>
        <div className="space-y-3">
          {feedItems.map((item) => (
            <div key={item.id} className="flex items-start">
              <div className="mt-1 mr-3">
                <FaRss className="text-teal-500" size={14} />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.content}</p>
                <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                {/* Fix: Add conditional rendering for the Link component */}
                {item.link ? (
                  <Link 
                    href={item.link} 
                    className="text-teal-600 hover:text-teal-700 text-sm font-medium mt-1 inline-block"
                  >
                    Read More
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Blogs Section */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-teal-700 mb-4">Trending Blogs</h3>
        <div className="space-y-3">
          {trendingBlogs.map((blog) => (
            <div key={blog.id} className="flex items-start">
              <div className="mt-1 mr-3">
                <FaBookmark className="text-teal-500" size={14} />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{blog.title}</h4>
                {/* Fix: Add conditional rendering for the Link component */}
                {blog.link ? (
                  <Link 
                    href={blog.link} 
                    className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                  >
                    Read More
                  </Link>
                ) : (
                  <span className="text-teal-600 text-sm font-medium">
                    Read More
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
