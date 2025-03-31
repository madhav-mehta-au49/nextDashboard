import React from 'react';
import { VStack, IconButton } from '@chakra-ui/react';
import { FiStar, FiMessageSquare, FiShare2, FiBookmark } from 'react-icons/fi';
import { useColorModeValue } from '@/components/ui/color-mode';
import { Tooltip } from '@/components/ui/tooltip';

export const CandidateActions: React.FC = () => {
  const iconColor = useColorModeValue('gray.600', 'gray.400');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <VStack gap={2}>
      <Tooltip label="Add to favorites" placement="left">
        <IconButton
          aria-label="Add to favorites"
          variant="ghost"
          color={iconColor}
          _hover={{ bg: hoverBg, color: 'yellow.500' }}
        >
          <FiStar />
        </IconButton>
      </Tooltip>
      
      <Tooltip label="Message" placement="left">
        <IconButton
          aria-label="Message"
          variant="ghost"
          color={iconColor}
          _hover={{ bg: hoverBg, color: 'blue.500' }}
        >
          <FiMessageSquare />
        </IconButton>
      </Tooltip>
      
      <Tooltip label="Share profile" placement="left">
        <IconButton
          aria-label="Share profile"
          variant="ghost"
          color={iconColor}
          _hover={{ bg: hoverBg, color: 'green.500' }}
        >
          <FiShare2 />
        </IconButton>
      </Tooltip>
      
      <Tooltip label="Save profile" placement="left">
        <IconButton
          aria-label="Save profile"
          variant="ghost"
          color={iconColor}
          _hover={{ bg: hoverBg, color: 'purple.500' }}
        >
          <FiBookmark />
        </IconButton>
      </Tooltip>
    </VStack>
  );
};