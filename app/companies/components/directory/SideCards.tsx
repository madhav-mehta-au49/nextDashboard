import React from 'react';
import Link from 'next/link';
import { 
  MessageCircleIcon, 
  CalendarIcon, 
  RssIcon, 
  TrendingUpIcon,
  ExternalLinkIcon,
  UserIcon,
  ArrowRightIcon
} from 'lucide-react';

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
}

interface FeedItem {
  id: string;
  title: string;
  content: string;
  time: string;
}

interface BlogPost {
  id: string;
  title: string;
  href: string;
}

interface RightSidebarCardProps {
  testimonials: Testimonial[];
  events: Event[];
  feedItems: FeedItem[];
  trendingBlogs: BlogPost[];
}

export const RightSidebarCard: React.FC<RightSidebarCardProps> = ({
  testimonials,
  events,
  feedItems,
  trendingBlogs
}) => {
  return (
    <div className="space-y-6">
      {/* Testimonials Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">What People Say</h3>
          <MessageCircleIcon className="w-5 h-5 text-teal-500" />
        </div>
        
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <p className="text-sm text-gray-600 italic mb-2">"{testimonial.feedback}"</p>
              <p className="text-sm font-medium text-gray-800">— {testimonial.user}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Upcoming Events */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Upcoming Events</h3>
          <CalendarIcon className="w-5 h-5 text-teal-500" />
        </div>
        
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <h4 className="font-medium text-gray-800 mb-1">{event.title}</h4>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {new Date(event.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
                <span className="text-teal-600">{event.location}</span>
              </div>
            </div>
          ))}
        </div>
        
        <Link 
          href="/events" 
          className="mt-4 inline-flex items-center text-sm text-teal-600 hover:text-teal-800 font-medium"
        >
          View all events
          <ArrowRightIcon className="ml-1 w-4 h-4" />
        </Link>
      </div>
      
      {/* Company Feed */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Company Feed</h3>
          <RssIcon className="w-5 h-5 text-teal-500" />
        </div>
        
        <div className="space-y-4">
          {feedItems.map((item) => (
            <div key={item.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <h4 className="font-medium text-gray-800 mb-1">{item.title}</h4>
              <p className="text-sm text-gray-600 mb-1">{item.content}</p>
              <span className="text-xs text-gray-500">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Trending Blogs */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Trending Articles</h3>
          <TrendingUpIcon className="w-5 h-5 text-teal-500" />
        </div>
        
        <div className="space-y-3">
          {trendingBlogs.map((blog) => (
            <Link 
              key={blog.id} 
              href={blog.href}
              className="block py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-800 hover:text-teal-600 transition-colors">{blog.title}</span>
                <ExternalLinkIcon className="w-4 h-4 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
        
        <Link 
          href="/blog" 
          className="mt-4 inline-flex items-center text-sm text-teal-600 hover:text-teal-800 font-medium"
        >
          Read more articles
          <ArrowRightIcon className="ml-1 w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
