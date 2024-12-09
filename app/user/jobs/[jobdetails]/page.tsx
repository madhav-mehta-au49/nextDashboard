"use client";
import { Box, Container, Grid, GridItem } from "@chakra-ui/react";
import { Metadata } from "next";
import Footer from "../../../user/components/footer";
import EmployeeHeader from "../../../user/components/header";
import CompanyDetails from "../../../user/components/jobs/CompanyDetails";
import JobDescription from "../../../user/components/jobs/JobDescription";
import { JobSchema } from "../../../user/components/jobs/JobSchema";
import SimilarJobs from "../../../user/components/jobs/SimilarJobs";
import SubHeader from "../../../user/components/subheader";



interface JobPageProps {
  params: {
    jobdetails: string;
  };
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    logoUrl: string;
    jobUrl: string;
    description: string;
    salary: string;
    employmentType: string;
    requirements: string[];
    benefits: string[];
    companyDetails: {
      about: string;
      size: string;
      industry: string;
      website: string;
    };
    postedDate: string;
  };
  similarJobs: {
    id: string;
    title: string;
    company: string;
    location: string;
    logoUrl: string;
    jobUrl: string;
    salary: string;
    postedDate: string;
  }[];
}

const dummyJob = {
  id: "1",
  title: "Senior Software Engineer",
  company: "Tech Corp",
  location: "San Francisco, CA",
  logoUrl: "https://example.com/logo.png",
  jobUrl: "https://example.com/job/1",
  description: "We are looking for a talented Senior Software Engineer to join our team. You will be responsible for developing high-quality software solutions.",
  salary: "$120,000 - $180,000",
  employmentType: "Full-time",
  requirements: [
    "5+ years of experience in software development",
    "Strong knowledge of JavaScript and TypeScript",
    "Experience with React and Node.js",
    "Bachelor's degree in Computer Science or related field"
  ],
  benefits: [
    "Health, dental, and vision insurance",
    "401(k) matching",
    "Flexible work hours",
    "Remote work options"
  ],
  companyDetails: {
    about: "Tech Corp is a leading software company specializing in cloud solutions.",
    size: "1000-5000 employees",
    industry: "Information Technology",
    website: "https://techcorp.example.com"
  },
  postedDate: "2024-01-15"
};

const dummySimilarJobs = [
  {
    id: "2",
    title: "Full Stack Developer",
    company: "StartUp Inc",
    location: "New York, NY",
    logoUrl: "https://example.com/startup-logo.png",
    jobUrl: "https://example.com/job/2",
    salary: "$100,000 - $150,000",
    postedDate: "2024-01-14"
  },
  {
    id: "3",
    title: "Frontend Engineer",
    company: "Web Solutions",
    location: "Remote",
    logoUrl: "https://example.com/websolutions-logo.png",
    jobUrl: "https://example.com/job/3",
    salary: "$90,000 - $140,000",
    postedDate: "2024-01-13"
  }
];

const JobPage = ({ params, job = dummyJob, similarJobs = dummySimilarJobs }: JobPageProps) => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JobSchema(job)) }}
      />
      
      <EmployeeHeader />
      <SubHeader />
      
      <Box flex="1">
        <Container maxW="7xl" py={8}>
          <h1>{params.jobdetails}</h1>
          <Grid templateColumns={{ base: "1fr", lg: "1fr 350px" }} gap={8}>
            <GridItem>
              <JobDescription
                title={params.jobdetails}
                company={job.company}
                location={job.location}
                description={job.description}
                requirements={job.requirements}
                benefits={job.benefits}
                postedDate={job.postedDate}
                salary={job.salary}
                employmentType={job.employmentType}
              />
            </GridItem>

            <GridItem>
              <Box position="sticky" top={4}>
                <CompanyDetails
                  company={job.company}
                  logoUrl={job.logoUrl}
                  about={job.companyDetails.about}
                  size={job.companyDetails.size}
                  industry={job.companyDetails.industry}
                  website={job.companyDetails.website}
                />
              </Box>
            </GridItem>
          </Grid>

          <Box mt={12}>
            <SimilarJobs jobs={similarJobs} />
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default JobPage;
