import React from 'react';
import Link from 'next/link';
import { Box, Flex, Text, Image, Badge, HStack, VStack } from '@chakra-ui/react';
import { FiMapPin, FiUsers, FiBriefcase } from 'react-icons/fi';
import { Company } from '../../types';
import { useColorModeValue } from '@/components/ui/color-mode';

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <Link href={`/companies/${company.id}`} passHref>
      <Box 
        as="article"
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        overflow="hidden"
        transition="all 0.2s"
        _hover={{ 
          transform: 'translateY(-4px)', 
          shadow: 'md', 
          bg: hoverBg,
          borderColor: 'blue.300'
        }}
        className="group"
      >
        <Box h="80px" bg="gray.100" position="relative" overflow="hidden">
          {company.coverImageUrl && (
            <Image 
              src={company.coverImageUrl} 
              alt={`${company.name} cover`} 
              objectFit="cover"
              w="100%"
              h="100%"
            />
          )}
        </Box>
        
        <Flex p={4} direction="column" gap={3}>
          <Flex align="center" gap={3}>
            <Box 
              borderWidth="1px" 
              borderColor={borderColor} 
              borderRadius="md" 
              p={1}
              bg="white"
              mt="-40px"
              position="relative"
              zIndex={1}
            >
              <Image 
                src={company.logoUrl || '/placeholder-logo.png'} 
                alt={company.name} 
                boxSize="48px"
                objectFit="contain"
                borderRadius="md"
              />
            </Box>
            <VStack align="flex-start" gap={0}>
              <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
                {company.name}
              </Text>
              <Text color="gray.500" fontSize="sm" noOfLines={1}>
                {company.industry}
              </Text>
            </VStack>
          </Flex>
          
          <Text fontSize="sm" color="gray.600" noOfLines={2} minH="40px">
            {company.description}
          </Text>
          
          <HStack gap={4} mt={1}>
            <Flex align="center" gap={1}>
              <FiMapPin className="text-gray-400" size={14} />
              <Text fontSize="xs" color="gray.500">
                {company.headquarters}
              </Text>
            </Flex>
            <Flex align="center" gap={1}>
              <FiUsers className="text-gray-400" size={14} />
              <Text fontSize="xs" color="gray.500">
                {company.employees.toLocaleString()} employees
              </Text>
            </Flex>
          </HStack>
          
          <Flex justify="space-between" align="center" mt={2}>
            <Badge colorScheme="blue" fontSize="xs" px={2} py={1} borderRadius="full">
              {company.size}
            </Badge>
            <Flex align="center" gap={1}>
              <FiBriefcase className="text-blue-500" size={14} />
              <Text fontSize="xs" fontWeight="medium" color="blue.500">
                View jobs
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Link>
  );
};
