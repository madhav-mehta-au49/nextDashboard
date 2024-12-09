import { Box, Heading, VStack } from '@chakra-ui/react';
import HorizontalJobCard from '../../jobs/horizontalJobCard';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  logoUrl: string;
  jobUrl: string;
  description: string;
}

interface JobListingsProps {
  jobs: Job[];
  companyName: string;
}

const JobListings: React.FC<JobListingsProps> = ({ jobs, companyName }) => (
  <Box flex="2">
    <Heading as="h3" size="md" mb={4}>
      Jobs at {companyName}
    </Heading>
    <VStack gap={4} align="stretch">
      {jobs.map((job) => (
        <HorizontalJobCard key={job.id} {...job} />
      ))}
    </VStack>
  </Box>
);

export default JobListings;
