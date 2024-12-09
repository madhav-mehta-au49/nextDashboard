import { Box, Heading, Text } from '@chakra-ui/react';

interface CompanyDescriptionProps {
  description: string;
}

const CompanyDescription: React.FC<CompanyDescriptionProps> = ({ description }) => (
  <Box mt={6}>
    <Heading as="h3" size="md">
      About Us
    </Heading>
    <Text mt={2}>{description}</Text>
  </Box>
);

export default CompanyDescription;
