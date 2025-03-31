import React from 'react';
import { 
  VStack, 
  HStack,
  Box,
  Text,
  Flex,
  Icon
} from '@chakra-ui/react';
import { Button } from "@/components/ui/button";
import { 
  FiStar, 
  FiMessageSquare, 
  FiShare2, 
  FiBookmark, 
  FiBriefcase, 
  FiBell, 
  FiFlag 
} from 'react-icons/fi';
import { useColorModeValue } from '@/components/ui/color-mode';

interface CompanyActionsProps {
  companyId: string;
}

export const CompanyActions: React.FC<CompanyActionsProps> = ({ companyId }) => {
  const iconColor = useColorModeValue('gray.600', 'gray.400');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box 
      borderWidth="1px" 
      borderColor={borderColor} 
      borderRadius="lg" 
      overflow="hidden"
      bg={bgColor}
      p={4}
    >
      <VStack spacing={3} align="stretch">
        <Text fontSize="sm" fontWeight="medium" color="gray.500" mb={1}>
          Company Actions
        </Text>
        
        <VStack spacing={2} align="stretch">
          <Button 
            variant="ghost"
            className="justify-start text-gray-600 hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            size="sm"
          >
            <FiStar className="mr-2" />
            Add to favorites
          </Button>
          
          <Button 
            variant="ghost"
            className="justify-start text-gray-600 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            size="sm"
          >
            <FiMessageSquare className="mr-2" />
            Message company
          </Button>
          
          <Button 
            variant="ghost"
            className="justify-start text-gray-600 hover:text-green-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            size="sm"
          >
            <FiShare2 className="mr-2" />
            Share profile
          </Button>
          
          <Button 
            variant="ghost"
            className="justify-start text-gray-600 hover:text-purple-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            size="sm"
          >
            <FiBookmark className="mr-2" />
            Save profile
          </Button>
        </VStack>
        
        <hr className="my-2" />
        
        <VStack spacing={2} align="stretch">
          <Button 
            variant="ghost"
            className="justify-start text-gray-600 hover:text-cyan-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            size="sm"
          >
            <FiBriefcase className="mr-2" />
            View all jobs
          </Button>
          
          <Button 
            variant="ghost"
            className="justify-start text-gray-600 hover:text-orange-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            size="sm"
          >
            <FiBell className="mr-2" />
            Get job alerts
          </Button>
        </VStack>
        
        <hr className="my-2" />
        
        <Button 
          variant="ghost"
          className="justify-start text-gray-600 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          size="sm"
        >
          <FiFlag className="mr-2" />
          Report company
        </Button>
        
        <Box mt={4}>
          <HStack justifyContent="center">
            <Text fontSize="xs" color="gray.500">
              ID: {companyId}
            </Text>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};
