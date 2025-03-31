import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Link,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { FiCalendar, FiTrendingUp, FiBookOpen, FiUser } from 'react-icons/fi';
import { useColorModeValue } from '@/components/ui/color-mode';
import { Avatar } from '@/components/ui/avatar';

interface FeaturedCandidate {
  id: string;
  name: string;
  title: string;
  skills: string[];
}

interface Event {
  id: string;
  title: string;
  date: string;
  link: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  link: string;
}

interface TrendingSkill {
  id: string;
  title: string;
  link: string;
}

interface RightSidebarCardProps {
  featuredCandidates: FeaturedCandidate[];
  upcomingEvents: Event[];
  careerResources: Resource[];
  trendingSkills: TrendingSkill[];
}

export const RightSidebarCard: React.FC<RightSidebarCardProps> = ({
  featuredCandidates,
  upcomingEvents,
  careerResources,
  trendingSkills
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('blue.600', 'blue.300');
  const iconColor = useColorModeValue('blue.500', 'blue.300');

  return (
    <VStack gap={6} align="stretch" position="sticky" top="20px">
      {/* Featured Candidates Section */}
      <Box
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        overflow="hidden"
        p={4}
      >
        <HStack mb={4}>
          <FiUser color={iconColor} />
          <Heading size="sm" color={headingColor}>
            Featured Candidates
          </Heading>
        </HStack>
        
        <VStack gap={4} align="stretch">
          {featuredCandidates.map((candidate) => (
            <Box key={candidate.id} p={2} _hover={{ bg: 'gray.50' }} borderRadius="md">
              <HStack>
                <Avatar size="sm" name={candidate.name} />
                <Box>
                  <Text fontWeight="bold" fontSize="sm">{candidate.name}</Text>
                  <Text fontSize="xs" color="gray.600">{candidate.title}</Text>
                  <HStack mt={1} gap={1}>
                    {candidate.skills.map((skill, index) => (
                      <Badge key={index} colorScheme="blue" variant="subtle" fontSize="2xs">
                        {skill}
                      </Badge>
                    ))}
                  </HStack>
                </Box>
              </HStack>
            </Box>
          ))}
        </VStack>
        
        <Link color="blue.500" fontSize="sm" display="block" textAlign="center" mt={2}>
          View all featured candidates
        </Link>
      </Box>

      {/* Upcoming Events Section */}
      <Box
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        overflow="hidden"
        p={4}
      >
        <HStack mb={4}>
          <FiCalendar color={iconColor} />
          <Heading size="sm" color={headingColor}>
            Upcoming Events
          </Heading>
        </HStack>
        
        <VStack gap={3} align="stretch">
          {upcomingEvents.map((event) => (
            <Box key={event.id}>
              <Link href={event.link}>
                <Text fontWeight="medium" fontSize="sm">{event.title}</Text>
              </Link>
              <Text fontSize="xs" color="gray.500">{event.date}</Text>
            </Box>
          ))}
        </VStack>
        
        <Link color="blue.500" fontSize="sm" display="block" textAlign="center" mt={2}>
          View all events
        </Link>
      </Box>

      {/* Career Resources Section */}
      <Box
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        overflow="hidden"
        p={4}
      >
        <HStack mb={4}>
          <FiBookOpen color={iconColor} />
          <Heading size="sm" color={headingColor}>
            Career Resources
          </Heading>
        </HStack>
        
        <VStack gap={4} align="stretch">
          {careerResources.map((resource) => (
            <Box key={resource.id}>
              <Link href={resource.link} >
                <Text fontWeight="medium" fontSize="sm">{resource.title}</Text>
              </Link>
              <Text fontSize="xs" color="gray.600">{resource.description}</Text>
            </Box>
          ))}
        </VStack>
        
        <Link color="blue.500" fontSize="sm" display="block" textAlign="center" mt={2}>
          View all resources
        </Link>
      </Box>

      {/* Trending Skills Section */}
      <Box
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        overflow="hidden"
        p={4}
      >
        <HStack mb={4}>
          <FiTrendingUp color={iconColor} />
          <Heading size="sm" color={headingColor}>
            Trending Skills
          </Heading>
        </HStack>
        
        <VStack gap={2} align="stretch">
          {trendingSkills.map((skill) => (
            <Link key={skill.id} href={skill.link} >
              <HStack>
                <Text fontSize="sm">{skill.title}</Text>
              </HStack>
            </Link>
          ))}
        </VStack>
        
        <Link color="blue.500" fontSize="sm" display="block" textAlign="center" mt={2}>
          View all trending skills
        </Link>
      </Box>
    </VStack>
  );
};
