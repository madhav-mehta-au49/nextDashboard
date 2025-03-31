export interface Company {
  id: string;
  name: string;
  logoUrl: string;
  coverImageUrl: string;
  industry: string;
  size: string;
  founded: number;
  headquarters: string;
  website: string;
  description: string;
  specialties: string[];
  followers: number;
  employees: number;
  locations: CompanyLocation[];
  socialLinks: SocialLinks;
}

export interface CompanyLocation {
  id: string;
  city: string;
  country: string;
  isPrimary: boolean;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
}

export interface CompanyJob {
  id: string;
  companyId: string;
  title: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote';
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  postedDate: string;
  applicationDeadline?: string;
  isRemote: boolean;
  applicantsCount: number;
}

export interface CompanyFilter {
  industry?: string;
  size?: string;
  location?: string;
  searchTerm?: string;
}
