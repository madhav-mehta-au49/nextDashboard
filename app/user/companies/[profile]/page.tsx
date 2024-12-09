"use client"

import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import Footer from '@/app/user/components/footer';
import Header from '@/app/user/components/header';
import SubHeader from '@/app/user/components/subheader';
import Announcements from '../../../user/components/companies/profile/Announcements';
import CompanyBanner from '../../../user/components/companies/profile/CompanyBanner';
import CompanyDescription from '../../../user/components/companies/profile/CompanyDescription';
import CompanyDetailsCard from '../../../user/components/companies/profile/CompanyDetailsCard';
import CompanyInfo from '../../../user/components/companies/profile/CompanyInfo';
import JobListings from '../../../user/components/companies/profile/JobListings';


// Sample data for demonstration
const sampleData = {
  company: {
    id: '1',
    name: 'Tech Corp International',
    bannerImageUrl: 'https://example.com/banner.jpg',
    logoUrl: 'https://example.com/logo.png',
    description: 'Tech Corp International is a leading technology company specializing in innovative solutions for enterprise clients. With over 20 years of experience, we deliver cutting-edge software and services to businesses worldwide.',
    website: 'https://techcorp.example.com',
    industry: 'Technology',
    size: '1000-5000 employees',
    location: 'San Francisco, CA',
    jobs: [
      {
        id: '1',
        title: 'Senior Software Engineer',
        company: 'Tech Corp International',
        location: 'San Francisco, CA',
        logoUrl: 'https://example.com/logo.png',
        jobUrl: 'https://example.com/jobs/1',
        description: 'We are looking for a Senior Software Engineer to join our team.'
      },
      {
        id: '2',
        title: 'Product Manager',
        company: 'Tech Corp International',
        location: 'New York, NY',
        logoUrl: 'https://example.com/logo.png',
        jobUrl: 'https://example.com/jobs/2',
        description: 'Experienced Product Manager needed for our expanding product line.'
      }
    ],
    announcements: [
      {
        id: '1',
        title: 'Q4 Financial Results',
        content: 'We are pleased to announce record growth in Q4 2023.',
        date: '2024-01-15'
      },
      {
        id: '2',
        title: 'New Office Opening',
        content: 'We are expanding our presence with a new office in Austin, TX.',
        date: '2024-01-10'
      }
    ],
    contactEmail: 'contact@techcorp.example.com',
    contactPhone: '+1 (555) 123-4567'
  },
  isLoggedIn: true,
  companyId: '1'
};

const CompanyDetailsPage = () => {
  const { company, isLoggedIn } = sampleData;

  return (








    <>
      <Header />
      <SubHeader />
      <Box>
        <CompanyBanner
          bannerImageUrl={company.bannerImageUrl}
          logoUrl={company.logoUrl}
          name={company.name}




        />




        <Box mt="40px" px={6}>
          <CompanyInfo
            name={company.name}
            industry={company.industry}
            size={company.size}
            location={company.location}



            website={company.website}
          />


          <CompanyDescription description={company.description} />
          <Flex mt={6} gap={6} flexDirection={{ base: 'column', lg: 'row' }}>
            <JobListings jobs={company.jobs} companyName={company.name} />
            <CompanyDetailsCard
              industry={company.industry}
              size={company.size}
              location={company.location}
              contactEmail={company.contactEmail}
              contactPhone={company.contactPhone}
              isLoggedIn={isLoggedIn}
            />
          </Flex>
          <Announcements announcements={company.announcements} />
        </Box>
      </Box>

      <Footer />
    </>
  );
};

export default CompanyDetailsPage;
