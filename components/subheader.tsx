import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface SubMenuItem {
  label: string;
  href?: string;
  subItems?: {
    label: string;
    href: string;
    description?: string;
  }[];
}

const SubHeader: React.FC = () => {
  const pathname = usePathname();
  const [appliedJobs, setAppliedJobs] = useState(0);
  const [jobStatus, setJobStatus] = useState("Pending"); // Default status
  const [isMenuOpen, setIsMenuOpen] = useState<Record<string, boolean>>({});

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (!pathname) return [];
    
    const segments = pathname.split('/').filter(Boolean);
    
    if (segments.length === 0) {
      return [{ label: 'Home', href: '/' }];
    }
    
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];
    
    let currentPath = '';
    segments.forEach((segment) => {
      currentPath += `/${segment}`;
      
      // Format the segment for display (capitalize, replace hyphens with spaces)
      const formattedLabel = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
      
      breadcrumbs.push({
        label: formattedLabel,
        href: currentPath,
      });
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  useEffect(() => {
    // Fetch job application data (mock API call or replace with real API)
    const fetchJobApplications = async () => {
      try {
        // const response = await fetch("/api/job-applications"); // Replace with actual API endpoint
        // const data = await response.json();
        // Mock data for now
        setAppliedJobs(3);
        setJobStatus("Pending");
      } catch (error) {
        console.error("Error fetching job applications", error);
      }
    };
    fetchJobApplications();
  }, []);

  const toggleMenu = (label: string) => {
    setIsMenuOpen(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const subHeaderLinks: SubMenuItem[] = [
    { label: "All Jobs", href: "/jobs" },
    {
      label: "Remote Jobs",
      href: "/jobs/remote",
      subItems: [
        {
          label: "Tech Remote Jobs",
          href: "/jobs/remote/tech",
          description: "Software, IT, and Tech positions"
        },
        {
          label: "Marketing Remote Jobs",
          href: "/jobs/remote/marketing",
          description: "Marketing and PR positions"
        }
      ]
    },
    {
      label: "Job Types",
      href: "/jobs/types",
      subItems: [
        { label: "Full-Time", href: "/jobs/full-time" },
        { label: "Part-Time", href: "/jobs/part-time" },
        { label: "Contract", href: "/jobs/contract" }
      ]
    },
    { label: "Companies", href: "/companies" },
    {
      label: "Resources",
      href: "/resources",
      subItems: [
        { label: "About Us", href: "/about" },
        { label: "Career Advice", href: "/career-advice" },
        { label: "Resume Tips", href: "/resources/resume-tips" },
        { label: "Interview Prep", href: "/resources/interview-prep" }
      ]
    }
  ];

  return (
    <nav className="border-b border-gray-200 bg-white py-2 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navigation */}
        <div className="flex justify-between items-center gap-6 text-sm">
          {subHeaderLinks.map((link) => (
            <div key={link.label} className="relative group">
              {link.subItems ? (
                <div>
                  <div 
                    className="flex items-center cursor-pointer text-gray-600 font-medium hover:text-teal-500"
                    onMouseEnter={() => toggleMenu(link.label)}
                    onMouseLeave={() => toggleMenu(link.label)}
                  >
                    <Link href={link.href || "#"} className="mr-1">
                      {link.label}
                    </Link>
                    <FiChevronDown size={16} />
                  </div>
                  
                  {isMenuOpen[link.label] && (
                    <div 
                      className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                      onMouseEnter={() => toggleMenu(link.label)}
                      onMouseLeave={() => toggleMenu(link.label)}
                    >
                      <div className="py-1">
                        {link.subItems.map((subItem) => (
                          <Link 
                            key={subItem.label} 
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-500"
                          >
                            <div>
                              <div className="font-medium">{subItem.label}</div>
                              {subItem.description && (
                                <div className="text-xs text-gray-500">
                                  {subItem.description}
                                </div>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={link.href || "#"}
                  className="text-gray-600 font-medium hover:text-teal-500"
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
          
          {/* Job Application Status Section */}
          <div className="flex items-center ml-6 text-gray-700 font-medium">
            <span className="mr-2">Applied Jobs:</span>
            <span className="text-teal-500 font-bold">{appliedJobs}</span>
            <span className="mx-2">| Latest Status:</span>
            <span className={`font-bold ${jobStatus === "Accepted" ? "text-green-500" : "text-orange-500"}`}>
              {jobStatus}
            </span>
            <Link href="/user/jobs/applicationStatus" className="ml-3 text-teal-500 font-medium hover:underline">
              View All
            </Link>
          </div>
        </div>
        
        {/* Breadcrumbs */}
        {breadcrumbs.length > 1 && (
          <div className="py-2 text-sm border-t border-gray-100 mt-2">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-1">
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;
                  
                  return (
                    <li key={crumb.href}>
                      <div className="flex items-center">
                        {index > 0 && (
                          <FiChevronRight className="h-4 w-4 text-gray-400 mx-1" />
                        )}
                        <Link
                          href={crumb.href}
                          className={`${
                            isLast
                              ? 'text-gray-700 font-medium'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                          aria-current={isLast ? 'page' : undefined}
                        >
                          {crumb.label}
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>
        )}
      </div>
    </nav>
  );
};

export default SubHeader;
