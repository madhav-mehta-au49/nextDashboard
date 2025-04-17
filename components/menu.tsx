import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  BriefcaseIcon, 
  BuildingIcon, 
  UsersIcon, 
  MessageSquareIcon, 
  FileTextIcon, 
  SettingsIcon, 
  HelpCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from 'lucide-react';

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <HomeIcon className="h-5 w-5" />,
  },
  {
    label: 'Jobs',
    href: '/jobs',
    icon: <BriefcaseIcon className="h-5 w-5" />,
    children: [
      { label: 'Browse Jobs', href: '/jobs/browse', icon: <ChevronRightIcon className="h-4 w-4" /> },
      { label: 'Saved Jobs', href: '/jobs/saved', icon: <ChevronRightIcon className="h-4 w-4" /> },
      { label: 'Applied Jobs', href: '/jobs/applied', icon: <ChevronRightIcon className="h-4 w-4" /> },
    ],
  },
  {
    label: 'Companies',
    href: '/companies',
    icon: <BuildingIcon className="h-5 w-5" />,
    children: [
      { label: 'Browse Companies', href: '/companies/browse', icon: <ChevronRightIcon className="h-4 w-4" /> },
      { label: 'Followed Companies', href: '/companies/followed', icon: <ChevronRightIcon className="h-4 w-4" /> },
    ],
  },
  {
    label: 'Candidates',
    href: '/candidates',
    icon: <UsersIcon className="h-5 w-5" />,
  },
  {
    label: 'Messages',
    href: '/messages',
    icon: <MessageSquareIcon className="h-5 w-5" />,
  },
  {
    label: 'Resources',
    href: '/resources',
    icon: <FileTextIcon className="h-5 w-5" />,
    children: [
      { label: 'Resume Builder', href: '/resources/resume', icon: <ChevronRightIcon className="h-4 w-4" /> },
      { label: 'Career Advice', href: '/resources/career-advice', icon: <ChevronRightIcon className="h-4 w-4" /> },
      { label: 'Salary Guide', href: '/resources/salary-guide', icon: <ChevronRightIcon className="h-4 w-4" /> },
    ],
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <SettingsIcon className="h-5 w-5" />,
  },
  {
    label: 'Help & Support',
    href: '/help',
    icon: <HelpCircleIcon className="h-5 w-5" />,
  },
];

const Menu: React.FC = () => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <nav className="bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="py-6 px-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.label}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpand(item.label)}
                    className={`flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3 text-gray-500">{item.icon}</span>
                      {item.label}
                    </div>
                    <ChevronDownIcon
                      className={`h-4 w-4 transition-transform ${
                        expandedItems[item.label] ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {expandedItems[item.label] && (
                    <ul className="mt-1 ml-6 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            href={child.href}
                            className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
                              isActive(child.href)
                                ? 'bg-teal-50 text-teal-700'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                                                        <span className="mr-3 text-gray-400">{child.icon}</span>
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3 text-gray-500">{item.icon}</span>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Menu;

