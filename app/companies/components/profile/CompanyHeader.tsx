import React from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  HStack, 
  VStack, 
  Image, 
  Badge,
} from '@chakra-ui/react';
import { FiMapPin, FiUsers, FiGlobe, FiHeart, FiShare2, FiBookmark } from 'react-icons/fi';
import { Company } from '../../types';
import { useColorModeValue } from '@/components/ui/color-mode';
import { Tooltip } from '@/components/Tooltip/Tooltip';

interface CompanyHeaderProps {
  company: Company;
  isFollowing: boolean;
  onToggleFollow: () => void;
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({ 
  company, 
  isFollowing, 
  onToggleFollow 
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box 
      bg={bgColor} 
      borderWidth="1px" 
      borderColor={borderColor} 
      borderRadius="lg" 
      overflow="hidden"
      shadow="sm"
      mb={6}
    >
      <Flex 
        direction={{ base: "column", md: "row" }} 
        p={6} 
        gap={6}
      >
        <VStack align="flex-start" gap={4} flex={1}>
          <Heading as="h1" size="xl">
            {company.name}
          </Heading>
          
          <Text color="gray.600" fontSize="lg">
            {company.industry}
          </Text>
          
          <HStack gap={6} flexWrap="wrap">
            <Flex align="center" gap={2}>
              <FiMapPin color="gray.500" />
              <Text color="gray.600">{company.headquarters}</Text>
            </Flex>
            
            <Flex align="center" gap={2}>
              <FiUsers color="gray.500" />
              <Text color="gray.600">{company.employees.toLocaleString()} employees</Text>
            </Flex>
            
            <Flex align="center" gap={2}>
              <FiGlobe color="gray.500" />
              <Text color="gray.600" as="a" href={company.website} target="_blank" rel="noopener noreferrer">
                {company.website.replace(/^https?:\/\//, '')}
              </Text>
            </Flex>
          </HStack>
          
          <HStack gap={3}>
            <Badge colorScheme="blue" px={2} py={1} borderRadius="full">
              {company.size}
            </Badge>
            <Badge colorScheme="green" px={2} py={1} borderRadius="full">
              Founded {company.founded}
            </Badge>
          </HStack>
          
          <HStack gap={3} pt={2}>
            <Button
              leftIcon={<FiHeart fill={isFollowing ? "currentColor" : "none"} />}
              colorScheme={isFollowing ? "red" : "gray"}
              variant={isFollowing ? "solid" : "outline"}
              onClick={onToggleFollow}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
            
            <Tooltip label="Share company profile">
              <Button leftIcon={<FiShare2 />} variant="outline">
                Share
              </Button>
            </Tooltip>
            
            <Tooltip label="Save to your list">
              <Button leftIcon={<FiBookmark />} variant="outline">
                Save
              </Button>
            </Tooltip>
          </HStack>
        </VStack>
        
        <Box>
          <Flex 
            direction="column" 
            align="center" 
            bg={useColorModeValue('gray.50', 'gray.700')} 
            p={4} 
            borderRadius="md"
            minW="180px"
          >
            <Text fontSize="sm" color="gray.500" mb={1}>Followers</Text>
            <Text fontSize="2xl" fontWeight="bold" mb={3}>
              {company.followers.toLocaleString()}
            </Text>
            
            <Box 
              position="relative" 
              width="100%" 
              height="60px" 
              mb={2}
            >
              {/* This would be a follower growth chart in a real app */}
              <Box 
                position="absolute" 
                bottom={0} 
                left={0} 
                right={0} 
                height="40px" 
                bg="blue.100" 
                borderRadius="md"
              >
                <Box 
                  position="absolute" 
                  bottom={0} 
                  left={0} 
                  width="70%" 
                  height="60%" 
                  bg="blue.400" 
                  borderRadius="md"
                />
                <Box 
                  position="absolute" 
                  bottom={0} 
                  left="70%" 
                  width="30%" 
                  height="40%" 
                  bg="blue.300" 
                  borderRadius="md"
                />
              </Box>
            </Box>
            
            <Text fontSize="xs" color="gray.500">
              +12% growth this month
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};
