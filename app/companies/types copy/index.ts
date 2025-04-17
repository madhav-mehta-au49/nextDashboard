// Import any necessary dependencies
export interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  location: string;
  description: string;
  logoUrl: string;
  coverImageUrl: string;
  jobCount: number;
  followers: number;
  rating: number;
  employees: number;
  headquarters: string;
  founded: string;
  specialties: string[];
  locations: {
    id: string;
    city: string;
    country: string;
    isPrimary: boolean;
  }[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
}

export interface CompanyJob {
  id: string;
  title: string;
  type: string;
  location: string;
  isRemote: boolean;
  description: string;
  postedDate: string;
  applicantsCount: number;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  applicationDeadline?: string;
}

export interface CompanyFilter {
  industry: string;
  size: string;
  location: string;
  searchTerm: string;
}
