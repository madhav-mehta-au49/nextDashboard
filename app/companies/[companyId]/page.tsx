'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { 
  Box, 
  Container, 
  Flex, 
  Heading, 
  Text,
  HStack,
  VStack,
  Image,
  Badge,
  SimpleGrid,
  Icon,
  Tabs
} from '@chakra-ui/react';
import { FiInfo, FiBriefcase, FiMapPin, FiUsers, FiCalendar, FiExternalLink } from 'react-icons/fi';
import { useCompanyDetails } from '../hooks/useCompanyDetails';
import { CompanyHeader } from '../components/profile/CompanyHeader';
import { CompanyAbout } from '../components/profile/CompanyAbout';
import { CompanyJobsList } from '../components/profile/CompanyJobsList';
import { CompanyActions } from '../components/profile/CompanyActions';
import { Spinner } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { useColorModeValue } from '@/components/ui/color-mode';

export default function CompanyProfile() {
  const params = useParams();
  const companyId = params.companyId as string;
  
  const { 
    company, 
    jobs, 
    isLoading, 
    error, 
    isFollowing, 
    toggleFollow 
  } = useCompanyDetails(companyId);
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="500px" direction="column" gap={4}>
        <Spinner size="xl" />
        <Text color={mutedColor}>Loading company profile...</Text>
      </Flex>
    );
  }

  if (error || !company) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box 
          p={4} 
          bg="red.50" 
          color="red.600" 
          borderRadius="md" 
          borderLeft="4px" 
          borderColor="red.500"
        >
          <Heading size="md" mb={2}>Error</Heading>
          <Text>{error || 'Company not found'}</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Box as="main" bg={bgColor} minH="100vh" pb={12}>
      {/* Cover Image with Gradient Overlay */}
      <Box position="relative" h={{ base: "200px", md: "300px" }} overflow="hidden">
        <Box
          bgImage={`url(${company.coverImageUrl || 'https://via.placeholder.com/1200x300'})`}
          bgSize="cover"
          bgPosition="center"
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
        />
        <Box 
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))"
        />
        <Container maxW="container.xl" h="full" position="relative">
          <Flex 
            position="absolute" 
            bottom="0" 
            left="0" 
            right="0" 
            p={6} 
            color="white"
            alignItems="flex-end"
          >
            <Heading 
              as="h1" 
              size="2xl" 
              fontWeight="bold" 
              textShadow="0 2px 4px rgba(0,0,0,0.3)"
            >
              {company.name}
            </Heading>
          </Flex>
        </Container>
      </Box>
      
      <Container maxW="container.xl" position="relative">
        {/* Company Header Card */}
        <Box 
          mt={{ base: "-50px", md: "-70px" }} 
          position="relative" 
          zIndex={1}
          bg={cardBg}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={borderColor}
          overflow="hidden"
          boxShadow="lg"
          mb={8}
        >
          <Flex 
            direction={{ base: "column", md: "row" }} 
            p={{ base: 4, md: 6 }}
            gap={6}
          >
            <Box 
              borderWidth="1px" 
              borderColor={borderColor} 
              borderRadius="lg" 
              p={2}
              bg="white"
              alignSelf="flex-start"
              boxShadow="md"
            >
              <Image 
                src={company.logoUrl || '/placeholder-logo.png'} 
                alt={company.name} 
                boxSize={{ base: "80px", md: "120px" }}
                objectFit="contain"
                borderRadius="md"
              />
            </Box>
            
            <VStack align="flex-start" spacing={4} flex={1}>
              <Box>
                <HStack mb={1}>
                  <Heading as="h2" size="lg">{company.name}</Heading>
                  <Badge colorScheme="blue" fontSize="sm" px={2} py={1} borderRadius="full">
                    {company.industry}
                  </Badge>
                </HStack>
                <Text color={mutedColor} fontSize="md">
                  {company.description.length > 150 
                    ? `${company.description.substring(0, 150)}...` 
                    : company.description}
                </Text>
              </Box>
              
              <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4} w="full">
                <VStack align="flex-start" spacing={1}>
                  <HStack>
                    <Icon as={FiMapPin} color="blue.500" />
                    <Text fontWeight="medium" fontSize="sm">Headquarters</Text>
                  </HStack>
                  <Text fontSize="sm" color={mutedColor}>{company.headquarters}</Text>
                </VStack>
                
                <VStack align="flex-start" spacing={1}>
                  <HStack>
                    <Icon as={FiUsers} color="blue.500" />
                    <Text fontWeight="medium" fontSize="sm">Company Size</Text>
                  </HStack>
                  <Text fontSize="sm" color={mutedColor}>{company.employees.toLocaleString()} employees</Text>
                </VStack>
                
                <VStack align="flex-start" spacing={1}>
                  <HStack>
                    <Icon as={FiCalendar} color="blue.500" />
                    <Text fontWeight="medium" fontSize="sm">Founded</Text>
                  </HStack>
                  <Text fontSize="sm" color={mutedColor}>{company.founded}</Text>
                </VStack>
                
                <VStack align="flex-start" spacing={1}>
                  <HStack>
                    <Icon as={FiExternalLink} color="blue.500" />
                    <Text fontWeight="medium" fontSize="sm">Website</Text>
                  </HStack>
                  <Text 
                    fontSize="sm" 
                    color="blue.500" 
                    as="a" 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {company.website.replace(/^https?:\/\//, '')}
                  </Text>
                </VStack>
              </SimpleGrid>
              
              <HStack spacing={3} pt={2}>
                <Button
                  colorScheme={isFollowing ? "blue" : "gray"}
                  variant={isFollowing ? "solid" : "outline"}
                  size="sm"
                  onClick={toggleFollow}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                >
                  Share
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                >
                  Save
                </Button>
              </HStack>
            </VStack>
            
            <Box 
              display={{ base: "none", lg: "block" }} 
              borderRadius="lg" 
              bg={useColorModeValue('blue.50', 'blue.900')}
              p={4}
              minW="180px"
              alignSelf="center"
            >
              <VStack spacing={2} align="center">
                <Text fontSize="sm" color={mutedColor}>Followers</Text>
                <Heading size="xl" color="blue.500">{company.followers.toLocaleString()}</Heading>
                <Box 
                  w="full" 
                  h="4px" 
                  bg={useColorModeValue('blue.100', 'blue.700')} 
                  borderRadius="full"
                  mt={2}
                >
                  <Box 
                    w="70%" 
                    h="full" 
                    bg="blue.500" 
                    borderRadius="full"
                  />
                </Box>
                <Text fontSize="xs" color={mutedColor}>+12% growth this month</Text>
              </VStack>
            </Box>
          </Flex>
        </Box>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 mb-10">
          <div>
            <Tabs.Root defaultValue="about" variant="plain">
              <Tabs.List bg="bg.muted" rounded="l3" p="1">
                <Tabs.Trigger value="about">
                  <FiInfo />
                  About
                </Tabs.Trigger>
                <Tabs.Trigger value="jobs">
                  <FiBriefcase />
                  Jobs ({jobs.length})
                </Tabs.Trigger>
                <Tabs.Indicator rounded="l2" />
              </Tabs.List>
              
              <Tabs.Content value="about" p={6}>
                <CompanyAbout company={company} />
              </Tabs.Content>
              
              <Tabs.Content value="jobs" p={6}>
                <CompanyJobsList jobs={jobs} companyName={company.name} />
              </Tabs.Content>
            </Tabs.Root>
          </div>
          
          <div className="hidden lg:block">
            <div className="sticky top-[100px]">
              <CompanyActions companyId={company.id} />
              
              {/* Additional Company Insights Card */}
              <Box 
                mt={6}
                bg={cardBg}
                borderRadius="xl"
                borderWidth="1px"
                borderColor={borderColor}
                overflow="hidden"
                boxShadow="sm"
                p={4}
              >
                <Heading as="h3" size="sm" mb={4}>Company Insights</Heading>
                
                <VStack spacing={4} align="stretch">
                  <Flex justify="space-between">
                    <Text fontSize="sm" color={mutedColor}>Industry Rank</Text>
                    <Text fontSize="sm" fontWeight="bold">#12</Text>
                  </Flex>
                  
                  <Flex justify="space-between">
                    <Text fontSize="sm" color={mutedColor}>Growth Rate</Text>
                    <Text fontSize="sm" fontWeight="bold" color="green.500">+24%</Text>
                  </Flex>
                  
                  <Flex justify="space-between">
                    <Text fontSize="sm" color={mutedColor}>Job Openings</Text>
                    <Text fontSize="sm" fontWeight="bold">{jobs.length}</Text>
                  </Flex>
                  
                  <Flex justify="space-between">
                    <Text fontSize="sm" color={mutedColor}>Response Rate</Text>
                    <Text fontSize="sm" fontWeight="bold">87%</Text>
                  </Flex>
                  
                  <hr className="my-2" />
                  
                  <Button
                    variant="outline"
                    size="sm"
                    width="full"
                  >
                    View Full Report
                  </Button>
                </VStack>
              </Box>
            </div>
          </div>
        </div>
      </Container>
    </Box>
  );
}
