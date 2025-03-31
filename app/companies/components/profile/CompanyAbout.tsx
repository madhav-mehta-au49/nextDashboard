"use client"

import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Flex, 
  Link, 
  Icon
} from '@chakra-ui/react';
import { FiGlobe, FiMapPin, FiCalendar, FiUsers } from 'react-icons/fi';
import { Company } from '../../types';
import { useColorModeValue } from '@/components/ui/color-mode';
import { Button } from "@/components/ui/button";

interface CompanyAboutProps {
  company: Company;
}

export const CompanyAbout: React.FC<CompanyAboutProps> = ({ company }) => {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgColor = useColorModeValue('white', 'gray.800');
  const sectionBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <VStack spacing={6} align="stretch">
      {/* Overview Section */}
      <Box>
        <Heading as="h3" size="md" mb={4}>About {company.name}</Heading>
        <Text>{company.description}</Text>
      </Box>

      <hr className="my-4" />

      {/* Company Details */}
      <Box>
        <Heading as="h3" size="md" mb={4}>Company Details</Heading>
        <Flex 
          direction={{ base: "column", md: "row" }} 
          gap={6}
          flexWrap="wrap"
        >
          <VStack align="flex-start" minW="200px" flex={1}>
            <HStack>
              <Icon as={FiGlobe} color="blue.500" />
              <Text fontWeight="medium">Website</Text>
            </HStack>
            <Link href={company.website} color="blue.500" isExternal>
              {company.website.replace(/^https?:\/\//, '')}
            </Link>
          </VStack>

          <VStack align="flex-start" minW="200px" flex={1}>
            <HStack>
              <Icon as={FiMapPin} color="blue.500" />
              <Text fontWeight="medium">Headquarters</Text>
            </HStack>
            <Text>{company.headquarters}</Text>
          </VStack>

          <VStack align="flex-start" minW="200px" flex={1}>
            <HStack>
              <Icon as={FiCalendar} color="blue.500" />
              <Text fontWeight="medium">Founded</Text>
            </HStack>
            <Text>{company.founded}</Text>
          </VStack>

          <VStack align="flex-start" minW="200px" flex={1}>
            <HStack>
              <Icon as={FiUsers} color="blue.500" />
              <Text fontWeight="medium">Company Size</Text>
            </HStack>
            <Text>{company.employees.toLocaleString()} employees</Text>
          </VStack>
        </Flex>
      </Box>

      <hr className="my-4" />

      {/* Specialties */}
      <Box>
        <Heading as="h3" size="md" mb={4}>Specialties</Heading>
        <Flex gap={2} flexWrap="wrap">
          {company.specialties.map((specialty, index) => (
            <Button 
              key={index}
              size="sm"
              variant="outline"
              className="rounded-full"
            >
              {specialty}
            </Button>
          ))}
        </Flex>
      </Box>

      <hr className="my-4" />

      {/* Locations */}
      <Box>
        <Heading as="h3" size="md" mb={4}>Locations</Heading>
        <Flex gap={4} flexWrap="wrap">
          {company.locations.map(location => (
            <Box 
              key={location.id} 
              borderWidth="1px" 
              borderColor={borderColor} 
              borderRadius="md" 
              p={4}
              bg={bgColor}
              minW="200px"
              flex="1"
            >
              <HStack mb={2}>
                <Icon as={FiMapPin} color={location.isPrimary ? "green.500" : "gray.500"} />
                <Text fontWeight="medium">
                  {location.city}
                  {location.isPrimary && (
                    <Button 
                      size="xs"
                      variant="outline"
                      className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      HQ
                    </Button>
                  )}
                </Text>
              </HStack>
              <Text color="gray.600" fontSize="sm">{location.country}</Text>
            </Box>
          ))}
        </Flex>
      </Box>

      {/* Social Media */}
      {(company.socialLinks.linkedin || company.socialLinks.twitter || 
        company.socialLinks.facebook || company.socialLinks.instagram) && (
        <>
          <hr className="my-4" />
          <Box>
            <Heading as="h3" size="md" mb={4}>Connect with {company.name}</Heading>
            <HStack spacing={4}>
              {company.socialLinks.linkedin && (
                <Link href={company.socialLinks.linkedin} isExternal>
                  <Box 
                    as="span" 
                    p={2} 
                    bg={sectionBg} 
                    borderRadius="md"
                    _hover={{ bg: 'blue.100' }}
                  >
                    <Icon as={FiGlobe} boxSize={5} />
                  </Box>
                </Link>
              )}
              {company.socialLinks.twitter && (
                <Link href={company.socialLinks.twitter} isExternal>
                  <Box 
                    as="span" 
                    p={2} 
                    bg={sectionBg} 
                    borderRadius="md"
                    _hover={{ bg: 'blue.100' }}
                  >
                    <Icon as={FiGlobe} boxSize={5} />
                  </Box>
                </Link>
              )}
              {company.socialLinks.facebook && (
                <Link href={company.socialLinks.facebook} isExternal>
                  <Box 
                    as="span" 
                    p={2} 
                    bg={sectionBg} 
                    borderRadius="md"
                    _hover={{ bg: 'blue.100' }}
                  >
                    <Icon as={FiGlobe} boxSize={5} />
                  </Box>
                </Link>
              )}
              {company.socialLinks.instagram && (
                <Link href={company.socialLinks.instagram} isExternal>
                  <Box 
                    as="span" 
                    p={2} 
                    bg={sectionBg} 
                    borderRadius="md"
                    _hover={{ bg: 'blue.100' }}
                  >
                    <Icon as={FiGlobe} boxSize={5} />
                  </Box>
                </Link>
              )}
            </HStack>
          </Box>
        </>
      )}
    </VStack>
  );
};
