export type ProfileData = {
    name: string;
    headline: string;
    location: string;
    about: string;
    email: string;
    phone: string;
    website: string;
  };
  
  export type Experience = {
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  };
  
  export type Education = {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  };
  
  export type Skill = {
    id: string;
    name: string;
  };
  
  export type Certification = {
    id: string;
    name: string;
    issuer: string;
    issueDate: string;
    expirationDate: string;
    noExpiration: boolean;
    credentialId: string;
    credentialURL: string;
  };
  