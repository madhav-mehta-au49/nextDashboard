// types/candidate.ts (optional file)

// A single job experience item
export interface ExperienceItem {
    title: string;
    company: string;
    duration: string;
    location: string;
    details: string[];
  }
  
  // A single education item
  export interface EducationItem {
    institution: string;
    degree: string;
    duration: string;
  }
  
  // A single featured project/link
  export interface FeaturedItem {
    title: string;
    url: string;
    description: string;
  }
  
  // A single skill with endorsement count
  export interface SkillItem {
    skill: string;
    endorsements: number;
  }
  
  // A single recommendation
  export interface RecommendationItem {
    name: string;
    relation: string;
    text: string;
  }
  
  // The overall structure of the candidate data
  export interface CandidateData {
    name: string;
    headline: string;
    location: string;
    profilePicture: string;
    coverImage: string;
    about: string;
    featured: FeaturedItem[];
    experience: ExperienceItem[];
    education: EducationItem[];
    skills: SkillItem[];
    recommendations: RecommendationItem[];
    connections: number;
  }
  