// components/AboutSection.tsx
import { Box, Heading, Text, useDisclosure } from '@chakra-ui/react';
import React, { FC } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Button } from '@/components/ui/button';

interface AboutSectionProps {
  aboutText: string;
}

const AboutSection: FC<AboutSectionProps> = ({ aboutText }) => {
  const { open, onToggle } = useDisclosure();

  return (
    <Box mt={8} px={8} py={4} bg="white" boxShadow="sm" borderRadius="md">
      <Heading fontSize="lg" mb={2}>
        About
      </Heading>
      <Box height={open ? 'auto' : '40px'} overflow="hidden">
        <Text fontSize="sm" color="gray.700">
          {aboutText}
        </Text>
      </Box>
      <Button
        size="sm"
        variant="ghost"
        colorScheme="blue"
        onClick={onToggle}
        mt={2}
      >
        Show {open ? 'Less' : 'More'} {open ? <FiChevronUp /> : <FiChevronDown />}
      </Button>
    </Box>
  );
};

export default AboutSection;