

'use client';
import {
  Box,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { AnnouncementCard } from './AnnouncementCard';
import HorizontalJobCard from '../jobs/horizontalJobCard';

interface CompanyProfileProps {
  company: {
    id: string;
    name: string;
    bannerImageUrl: string;
    logoUrl: string;
    description: string;
    website: string;
    industry: string;
    size: string;
    location: string;
    jobs: Job[];
    announcements: Announcement[];
    contactEmail: string;
    contactPhone: string;
  };
  isLoggedIn: boolean;
  companyId: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  logoUrl: string;
  jobUrl: string;
  description: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}

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

const CompanyDescription = () => {
//   const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box>
      {/* Banner Image */}
      <Box position="relative">
        <Image
          src={sampleData.company.bannerImageUrl}
          alt={`${sampleData.company.name} banner`}
          width="100%"
          height={{ base: '150px', md: '200px' }}
          objectFit="cover"
        />
        {/* Logo */}
        <Avatar
          src={sampleData.company.logoUrl}
          name={sampleData.company.name}
          size="xl"
          position="absolute"
          bottom="-30px"
          left="30px"
          borderWidth="4px"
          borderColor="white"
          bg="white"
        />
      </Box>

      <Box mt="40px" px={6}>
        {/* Company Name and Action Button */}
        <Flex justify="space-between" align="center" flexWrap="wrap">
          <Box>
            <Heading as="h2" size="lg">
              {sampleData.company.name}
            </Heading>
            <Text color="gray.500">
              {sampleData.company.industry} • {sampleData.company.size} • {sampleData.company.location}
            </Text>
          </Box>
          <Button
            colorScheme="teal"
            onClick={() => window.open(sampleData.company.website, '_blank')}
            mt={{ base: 4, md: 0 }}
          >
            Visit Website
          </Button>
        </Flex>

        {/* Company Description */}
        <Box mt={6}>
          <Heading as="h3" size="md">
            About Us
          </Heading>
          <Text mt={2}>{sampleData.company.description}</Text>
        </Box>

        <Flex mt={6} gap={6} flexDirection={{ base: 'column', lg: 'row' }}>
          {/* Main Feed - Job Listings */}
          <Box flex="2">
            <Heading as="h3" size="md" mb={4}>
              Jobs at {sampleData.company.name}
            </Heading>
            <VStack gap={4} align="stretch">
              {sampleData.company.jobs.map((job) => (
                <HorizontalJobCard key={job.id} {...job} />
              ))}
            </VStack>
          </Box>

          {/* Right Column - Company Details */}
          <Box flex="1">
            <Heading as="h3" size="md" mb={4}>
              Company Details
            </Heading>
            <Stack gap={2}>
              <Text>
                <strong>Industry:</strong> {sampleData.company.industry}
              </Text>
              <Text>
                <strong>Company Size:</strong> {sampleData.company.size}
              </Text>
              <Text>
                <strong>Headquarters:</strong> {sampleData.company.location}
              </Text>
              {sampleData.isLoggedIn ? (
                <>
                  <Text>
                    <strong>Contact Email:</strong> {sampleData.company.contactEmail}
                  </Text>
                  <Text>
                    <strong>Contact Phone:</strong> {sampleData.company.contactPhone}
                  </Text>
                </>
              ) : (
                <Text color="gray.500">Log in to see contact information</Text>
              )}
            </Stack>

            {/* Announcements */}
            <Heading as="h3" size="md" mt={6} mb={4}>
              Announcements
            </Heading>
            <VStack gap={4} align="stretch">
              {sampleData.company.announcements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </VStack>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default CompanyDescription;