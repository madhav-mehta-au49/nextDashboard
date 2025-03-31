import React from 'react';
import Link from 'next/link';
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Flex, 
  Badge, 
  Button, 
  Icon
} from '@chakra-ui/react';
import { FiMapPin, FiClock, FiUsers, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import { CompanyJob } from '../../types';
import { useColorModeValue } from '@/components/ui/color-mode';

interface CompanyJobsListProps {
  jobs: CompanyJob[];
  companyName: string;
}

export const CompanyJobsList: React.FC<CompanyJobsListProps> = ({ jobs, companyName }) => {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  if (jobs.length === 0) {
    return (
      <Box 
        p={6} 
        borderWidth="1px" 
        borderColor={borderColor} 
        borderRadius="md" 
        bg={bgColor}
        textAlign="center"
      >
        <Text fontSize="lg" mb={4}>
          {companyName} doesn't have any active job postings at the moment.
        </Text>
        <Text color="gray.500">
          Check back later for new opportunities or follow the company to get updates.
        </Text>
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      <Heading as="h3" size="md" mb={2}>
        {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'} at {companyName}
      </Heading>
      
      {jobs.map(job => (
        <Box 
          key={job.id}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          overflow="hidden"
          bg={bgColor}
          transition="all 0.2s"
          _hover={{ 
            transform: 'translateY(-2px)', 
            shadow: 'md', 
            borderColor: 'blue.300',
            bg: hoverBg
          }}
        >
          <Box p={5}>
            <Flex justify="space-between" align="flex-start" mb={3}>
              <VStack align="flex-start" spacing={1}>
                <Heading as="h4" size="md">
                  {job.title}
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  {companyName}
                </Text>
              </VStack>
              <Badge 
                colorScheme={
                  job.type === 'Full-time' ? 'green' : 
                  job.type === 'Part-time' ? 'purple' : 
                  job.type === 'Contract' ? 'orange' : 
                  job.type === 'Internship' ? 'blue' : 
                  'teal'
                }
                px={2}
                py={1}
                borderRadius="full"
              >
                {job.type}
              </Badge>
            </Flex>
            
            <Text noOfLines={2} mb={4} color="gray.600">
              {job.description}
            </Text>
            
            <HStack spacing={4} mb={4} flexWrap="wrap">
              <Flex align="center" minW="120px">
                <Icon as={FiMapPin} color="gray.500" mr={1} />
                <Text fontSize="sm" color="gray.600">
                  {job.isRemote ? 'Remote' : job.location}
                </Text>
              </Flex>
              
              <Flex align="center" minW="120px">
                <Icon as={FiClock} color="gray.500" mr={1} />
                <Text fontSize="sm" color="gray.600">
                  Posted {formatDate(job.postedDate)}
                </Text>
              </Flex>
              
              <Flex align="center" minW="120px">
                <Icon as={FiUsers} color="gray.500" mr={1} />
                <Text fontSize="sm" color="gray.600">
                  {job.applicantsCount} applicants
                </Text>
              </Flex>
              
              {job.salary && (
                <Flex align="center" minW="120px">
                  <Icon as={FiDollarSign} color="gray.500" mr={1} />
                  <Text fontSize="sm" color="gray.600">
                    {formatSalary(job.salary)}
                  </Text>
                </Flex>
              )}
            </HStack>
            
            <hr className="my-4" />
            
            <Flex justify="space-between" align="center">
              <HStack>
                {job.isRemote && (
                  <Badge colorScheme="teal" variant="subtle">
                    Remote
                  </Badge>
                )}
                {job.applicationDeadline && (
                  <Badge colorScheme={isDeadlineSoon(job.applicationDeadline) ? "red" : "gray"} variant="subtle">
                    {isDeadlineSoon(job.applicationDeadline) ? "Closing soon" : `Closes ${formatDate(job.applicationDeadline)}`}
                  </Badge>
                )}
              </HStack>
              
              <Link href={`/jobs/${job.id}`} passHref>
                <Button 
                  rightIcon={<FiArrowRight />} 
                  colorScheme="blue" 
                  size="sm" 
                  variant="outline"
                >
                  View Job
                </Button>
              </Link>
            </Flex>
          </Box>
        </Box>
      ))}
    </VStack>
  );
};

// Helper functions
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

function formatSalary(salary: { min: number; max: number; currency: string }): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: salary.currency,
    maximumFractionDigits: 0,
  });
  
  return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
}

function isDeadlineSoon(dateString: string): boolean {
  const deadline = new Date(dateString);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays <= 3 && diffDays >= 0;
}
