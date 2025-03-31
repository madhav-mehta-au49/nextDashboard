import { Box, Heading, VStack, Text, Link } from "@chakra-ui/react";

export const RightSidebarCard = ({ featuredJobs, upcomingEvents, careerResources, trendingSkills }) => {
  return (
    <VStack align="stretch" gap={6}>
      <Box p={4} borderWidth="1px" borderRadius="lg" shadow="md">
        <Heading size="md" mb={4}>Featured Jobs</Heading>
        {featuredJobs.map((job) => (
          <Box key={job.id} mb={2}>
            <Text fontWeight="bold">{job.title}</Text>
            <Text>{job.company}</Text>
            <Text fontSize="sm" color="gray.500">{job.skills.join(", ")}</Text>
          </Box>
        ))}
      </Box>
      <Box p={4} borderWidth="1px" borderRadius="lg" shadow="md">
        <Heading size="md" mb={4}>Upcoming Events</Heading>
        {upcomingEvents.map((event) => (
          <Box key={event.id} mb={2}>
            <Text fontWeight="bold">{event.title}</Text>
            <Text fontSize="sm" color="gray.500">{event.date}</Text>
            <Link href={event.link} color="teal.500" fontSize="sm">Learn more</Link>
          </Box>
        ))}
      </Box>
      <Box p={4} borderWidth="1px" borderRadius="lg" shadow="md">
        <Heading size="md" mb={4}>Career Resources</Heading>
        {careerResources.map((resource) => (
          <Box key={resource.id} mb={2}>
            <Text fontWeight="bold">{resource.title}</Text>
            <Text fontSize="sm" color="gray.500">{resource.description}</Text>
            <Link href={resource.link} color="teal.500" fontSize="sm">Learn more</Link>
          </Box>
        ))}
      </Box>
      <Box p={4} borderWidth="1px" borderRadius="lg" shadow="md">
        <Heading size="md" mb={4}>Trending Skills</Heading>
        {trendingSkills.map((skill) => (
          <Box key={skill.id} mb={2}>
            <Link href={skill.link} color="teal.500" fontSize="sm">{skill.title}</Link>
          </Box>
        ))}
      </Box>
    </VStack>
  );
};