// components/FeaturedSection.tsx
import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Link as ChakraLink,
  Heading,
  Link as NextLink,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import React, { FC } from 'react';

// If using the interface from a separate types file:
// import { FeaturedItem } from '@/types/candidate';

interface FeaturedItem {
  title: string;
  url: string;
  description: string;
}

interface FeaturedSectionProps {
  featured: FeaturedItem[];
}

const FeaturedSection: FC<FeaturedSectionProps> = ({ featured }) => {
  return (
    <Box mt={4} px={8} py={4} bg="white" boxShadow="sm" borderRadius="md">
      <Heading fontSize="lg" mb={4}>
        Featured
      </Heading>
      <SimpleGrid columns={[1, 2, 3]} gap={4}>
        {featured.map((item, idx) => (
          <Box
            key={idx}
            borderWidth="1px"
            borderRadius="md"
            overflow="hidden"
            p={4}
            bg="gray.50"
          >
            <Heading fontSize="md" mb={1}>
              {item.title}
            </Heading>
            <Text fontSize="sm" color="gray.700" mb={2}>
              {item.description}
            </Text>
            <NextLink href={item.url} >
              <ChakraLink color="blue.600" >
                View <ExternalLinkIcon mx="2px" />
              </ChakraLink>
            </NextLink>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default FeaturedSection;
