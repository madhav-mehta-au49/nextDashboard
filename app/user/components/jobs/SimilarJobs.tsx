import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import JobListingCard from "./jobCard";

const SimilarJobs = ({ jobs }: { jobs: any[] }) => {
  return (
    <Box>
      <Heading size="md" mb={6}>Similar Jobs</Heading>
      <SimpleGrid columns={3} gap={6}>
        {jobs.map((job) => (
          <JobListingCard key={job.id} {...job} />
        ))}
      </SimpleGrid>
    </Box>
  );
};
export default SimilarJobs;
