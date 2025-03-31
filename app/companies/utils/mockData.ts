import { Company, CompanyJob } from '../types';

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'TechNova',
    logoUrl: 'https://via.placeholder.com/150',
    coverImageUrl: 'https://via.placeholder.com/800x200',
    industry: 'Technology',
    size: '501-1000',
    founded: 2010,
    headquarters: 'San Francisco, CA',
    website: 'https://technova.example.com',
    description: 'Leading provider of cloud-based solutions for enterprise businesses.',
    specialties: ['Cloud Computing', 'AI', 'Machine Learning', 'Data Analytics'],
    followers: 15420,
    employees: 750,
    locations: [
      { id: '1', city: 'San Francisco', country: 'USA', isPrimary: true },
      { id: '2', city: 'New York', country: 'USA', isPrimary: false },
      { id: '3', city: 'London', country: 'UK', isPrimary: false }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/technova',
      twitter: 'https://twitter.com/technova',
      facebook: 'https://facebook.com/technova'
    }
  },
  {
    id: '2',
    name: 'HealthPlus',
    logoUrl: 'https://via.placeholder.com/150',
    coverImageUrl: 'https://via.placeholder.com/800x200',
    industry: 'Healthcare',
    size: '1001+',
    founded: 2005,
    headquarters: 'Boston, MA',
    website: 'https://healthplus.example.com',
    description: 'Innovative healthcare solutions improving patient outcomes worldwide.',
    specialties: ['Telemedicine', 'Healthcare IT', 'Medical Devices', 'Patient Care'],
    followers: 28750,
    employees: 1200,
    locations: [
      { id: '1', city: 'Boston', country: 'USA', isPrimary: true },
      { id: '2', city: 'Chicago', country: 'USA', isPrimary: false }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/healthplus',
      twitter: 'https://twitter.com/healthplus'
    }
  },
  {
    id: '3',
    name: 'GreenEarth',
    logoUrl: 'https://via.placeholder.com/150',
    coverImageUrl: 'https://via.placeholder.com/800x200',
    industry: 'Environmental',
    size: '51-200',
    founded: 2015,
    headquarters: 'Portland, OR',
    website: 'https://greenearth.example.com',
    description: 'Sustainable solutions for a greener planet. Focused on renewable energy and conservation.',
    specialties: ['Renewable Energy', 'Sustainability', 'Green Technology', 'Conservation'],
    followers: 8900,
    employees: 120,
    locations: [
      { id: '1', city: 'Portland', country: 'USA', isPrimary: true },
      { id: '2', city: 'Seattle', country: 'USA', isPrimary: false }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/greenearth',
      twitter: 'https://twitter.com/greenearth',
      instagram: 'https://instagram.com/greenearth'
    }
  },
  {
    id: '4',
    name: 'FinanceWorks',
    logoUrl: 'https://via.placeholder.com/150',
    coverImageUrl: 'https://via.placeholder.com/800x200',
    industry: 'Finance',
    size: '201-500',
    founded: 2008,
    headquarters: 'New York, NY',
    website: 'https://financeworks.example.com',
    description: 'Modern financial solutions for businesses and individuals.',
    specialties: ['Financial Technology', 'Banking', 'Investment', 'Financial Planning'],
    followers: 12300,
    employees: 350,
    locations: [
      { id: '1', city: 'New York', country: 'USA', isPrimary: true },
      { id: '2', city: 'London', country: 'UK', isPrimary: false },
      { id: '3', city: 'Singapore', country: 'Singapore', isPrimary: false }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/financeworks',
      twitter: 'https://twitter.com/financeworks'
    }
  },
  {
    id: '5',
    name: 'EduLearn',
    logoUrl: 'https://via.placeholder.com/150',
    coverImageUrl: 'https://via.placeholder.com/800x200',
    industry: 'Education',
    size: '11-50',
    founded: 2018,
    headquarters: 'Austin, TX',
    website: 'https://edulearn.example.com',
    description: 'Transforming education through innovative learning platforms and technologies.',
    specialties: ['EdTech', 'Online Learning', 'Educational Content', 'Learning Management'],
    followers: 5600,
    employees: 45,
    locations: [
      { id: '1', city: 'Austin', country: 'USA', isPrimary: true }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/edulearn',
      twitter: 'https://twitter.com/edulearn',
      facebook: 'https://facebook.com/edulearn'
    }
  },
  {
    id: '6',
    name: 'RetailNow',
    logoUrl: 'https://via.placeholder.com/150',
    coverImageUrl: 'https://via.placeholder.com/800x200',
    industry: 'Retail',
    size: '1001+',
    founded: 2000,
    headquarters: 'Chicago, IL',
    website: 'https://retailnow.example.com',
    description: 'Omnichannel retail solutions for the modern shopping experience.',
    specialties: ['E-commerce', 'Retail Technology', 'Supply Chain', 'Customer Experience'],
    followers: 19800,
    employees: 1500,
    locations: [
      { id: '1', city: 'Chicago', country: 'USA', isPrimary: true },
      { id: '2', city: 'Dallas', country: 'USA', isPrimary: false },
      { id: '3', city: 'Toronto', country: 'Canada', isPrimary: false }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/retailnow',
      facebook: 'https://facebook.com/retailnow',
      instagram: 'https://instagram.com/retailnow'
    }
  }
];

export const mockCompanyJobs: Record<string, CompanyJob[]> = {
  '1': [
    {
      id: '101',
      companyId: '1',
      title: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      type: 'Full-time',
      description: 'Join our engineering team to build cutting-edge cloud solutions.',
      requirements: [
        '5+ years of experience in software development',
        'Proficiency in JavaScript, TypeScript, and React',
        'Experience with cloud platforms (AWS, Azure, or GCP)',
        'Strong problem-solving skills'
      ],
      responsibilities: [
        'Design and implement new features for our cloud platform',
        'Collaborate with cross-functional teams',
        'Mentor junior developers',
        'Participate in code reviews and technical discussions'
      ],
      salary: {
        min: 120000,
        max: 160000,
        currency: 'USD'
      },
      postedDate: '2023-05-15',
      applicationDeadline: '2023-06-15',
      isRemote: true,
      applicantsCount: 45
    },
    {
      id: '102',
      companyId: '1',
      title: 'Product Manager',
      location: 'San Francisco, CA',
      type: 'Full-time',
      description: 'Lead product development for our enterprise solutions.',
      requirements: [
        '3+ years of product management experience',
        'Experience with SaaS products',
        'Strong analytical and communication skills',
        'Technical background preferred'
      ],
      responsibilities: [
        'Define product vision and strategy',
        'Work with engineering to deliver features',
        'Gather and prioritize customer requirements',
        'Analyze market trends and competition'
      ],
      salary: {
        min: 110000,
        max: 150000,
        currency: 'USD'
      },
      postedDate: '2023-05-10',
      applicationDeadline: '2023-06-10',
      isRemote: false,
      applicantsCount: 32
    }
  ],
  '2': [
    {
      id: '201',
      companyId: '2',
      title: 'Healthcare Data Scientist',
      location: 'Boston, MA',
      type: 'Full-time',
      description: 'Analyze healthcare data to improve patient outcomes.',
      requirements: [
        'MS or PhD in Data Science, Statistics, or related field',
        'Experience with healthcare data',
        'Proficiency in Python, R, and SQL',
        'Knowledge of machine learning algorithms'
      ],
      responsibilities: [
        'Develop predictive models for patient outcomes',
        'Analyze large healthcare datasets',
        'Collaborate with medical professionals',
        'Present findings to stakeholders'
      ],
      salary: {
        min: 115000,
        max: 145000,
        currency: 'USD'
      },
      postedDate: '2023-05-05',
      applicationDeadline: '2023-06-05',
      isRemote: false,
      applicantsCount: 28
    }
  ]
};
