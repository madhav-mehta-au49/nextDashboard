import { Box, Container, SimpleGrid, Text } from "@chakra-ui/react"
import { SingleJobCards } from "./singlejobcards"

interface JobDetail {
  title: string;
  description: string;
  id: string;
}

export const JobCardsGrid = ({ jobs, title = "Available Jobs" }: { jobs: JobDetail[], title?: string }) => {
  return (
    <Container maxW="7xl" py={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">{title}</Text>
      <SimpleGrid 
        columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 4 }} 
        gap={6}
        justifyItems="center"
        alignItems="stretch"
      >
        {jobs.map((job, index) => (
          <Box key={index} w="100%">
            <SingleJobCards
              title={job.title}
              description={job.description}
              jobId={job.id}
            />
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  )
}