"use client";

import { Box, Container, Heading, HStack, Spacer, VStack } from "@chakra-ui/react";
import Footer from '@/app/user/components/footer';
import Header from '@/app/user/components/header';
import SubHeader from '@/app/user/components/subheader';
import JobListingCard from "../components/jobs/jobCard";
import { JobFilterMenu } from "../components/jobs/JobFilterMenu";
import { JobSort } from "../components/jobs/JobSort";
import { RightSidebarCard } from '../components/jobs/SideCards';

export default function JobsPage() {
  const jobs = [
    {
      id: "1",
      title: "Software Engineer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      logoUrl: "/images/tech-corp-logo.png",
      jobUrl: "https://example.com/job/1",
      description: "We are looking for a skilled Software Engineer with 5+ years of experience in JavaScript and React."
    },
    {
      id: "2",
      title: "Product Manager",
      company: "Health Solutions",
      location: "Boston, MA",
      logoUrl: "/images/health-solutions-logo.png",
      jobUrl: "https://example.com/job/2",
      description: "Join our team as a Product Manager to lead the development of innovative healthcare solutions."
    },
    {
      id: "3",
      title: "UX/UI Designer",
      company: "FinTech Pro",
      location: "New York, NY",
      logoUrl: "/images/fintech-pro-logo.png",
      jobUrl: "https://example.com/job/3",
      description: "We are seeking a creative UX/UI Designer with a strong portfolio in mobile application design."
    },
  ];

  // Mock data for RightSidebarCard
  const featuredJobs = [
    { id: "1", title: "Data Scientist", company: "Data Corp", skills: ["Python", "Machine Learning"] },
    { id: "2", title: "DevOps Engineer", company: "Cloud Solutions", skills: ["AWS", "Kubernetes"] },
  ];

  const upcomingEvents = [
    { id: "1", title: "Tech Networking Mixer", date: "2023-11-20", link: "https://techmixer.com" },
    { id: "2", title: "Career Fair 2023", date: "2023-12-10", link: "https://careerfair.com" },
  ];

  const careerResources = [
    { id: "1", title: "Resume Writing Tips", description: "Learn how to craft the perfect resume", link: "https://example.com/resume-tips" },
    { id: "2", title: "Interview Preparation", description: "Ace your next interview with these strategies", link: "https://example.com/interview-prep" },
  ];

  const trendingSkills = [
    { id: "1", title: "Machine Learning", link: "https://example.com/machine-learning" },
    { id: "2", title: "React Native", link: "https://example.com/react-native" },
  ];

  return (
    <>
      <Header />
      <SubHeader />
      <Container maxW="container.xl" py={8}>
        <HStack mb={8} px={4}>
          <Heading size="xl" textAlign="center" color="blue.700" fontWeight="bold">Jobs</Heading>
          <Spacer />
          <HStack gap={4}>
            <JobFilterMenu />
            <JobSort />
          </HStack>
        </HStack>
        <HStack align="start" gap={8}>
          <VStack gap={6} align="stretch" width="75%">
            {jobs.map((job) => (
              <HStack key={job.id} align="start" width="full">
                <Box flex={1}>
                  <JobListingCard
                    id={job.id}
                    title={job.title}
                    company={job.company}
                    location={job.location}
                    logoUrl={job.logoUrl}
                    jobUrl={job.jobUrl}
                    description={job.description}
                  />
                </Box>
              </HStack>
            ))}
          </VStack>
          <Box width="25%">
            <RightSidebarCard 
              featuredJobs={featuredJobs} 
              upcomingEvents={upcomingEvents} 
              careerResources={careerResources} 
              trendingSkills={trendingSkills} 
            />
          </Box>
        </HStack>
      </Container>
      <Footer />
    </>
  );
}