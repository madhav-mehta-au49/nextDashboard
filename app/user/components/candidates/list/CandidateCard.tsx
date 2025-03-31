"use client"

import React from 'react';
import { Box, Flex, Text, Badge, HStack, VStack } from '@chakra-ui/react';
import { FiMapPin, FiUsers, FiBriefcase, FiBook } from 'react-icons/fi';
import { Avatar } from '@/components/ui/avatar';
import { useColorModeValue } from '@/components/ui/color-mode';

interface CandidateCardProps {
  name: string;
  headline: string;
  location: string;
  connections: number;
  skills: string[];
  experience: string;
  education: string;
  profilePicture: string;
  availability: string;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  name,
  headline,
  location,
  connections,
  skills,
  experience,
  education,
  profilePicture,
  availability
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconColor = useColorModeValue('blue.500', 'blue.300');
  const textColor = useColorModeValue('gray.700', 'white');

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'Actively looking':
        return 'green';
      case 'Open to opportunities':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      overflow="hidden"
      p={5}
      shadow="sm"
      _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
    >
      <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
        <HStack gap="3">
          <Avatar size="xl" name={name} src={profilePicture} />
        </HStack>

        <Box flex="1">
          <Flex justify="space-between" align="start" mb={2}>
            <Box>
              <Text fontSize="xl" fontWeight="bold" color={textColor}>
                {name}
              </Text>
              <Text fontSize="md" color="gray.600" mb={2}>
                {headline}
              </Text>
            </Box>
            <Badge colorScheme={getAvailabilityColor(availability)} px={2} py={1} borderRadius="full">
              {availability}
            </Badge>
          </Flex>

          <VStack align="start" gap={2} mb="4">
            <HStack>
              <FiMapPin color={iconColor} />
              <Text fontSize="sm" color="gray.600">{location}</Text>
            </HStack>
            <HStack>
              <FiUsers color={iconColor} />
              <Text fontSize="sm" color="gray.600">{connections}+ connections</Text>
            </HStack>
            <HStack>
              <FiBriefcase color={iconColor} />
              <Text fontSize="sm" color="gray.600">{experience}</Text>
            </HStack>
            <HStack>
              <FiBook color={iconColor} />
              <Text fontSize="sm" color="gray.600">{education}</Text>
            </HStack>
          </VStack>

          <HStack flexWrap="wrap" gap={2}>
            {skills.map((skill, index) => (
              <Badge key={index} colorScheme="blue" variant="subtle" px={2} py={1}>
                {skill}
              </Badge>
            ))}
          </HStack>
        </Box>
      </Flex>
    </Box>
  );
};
