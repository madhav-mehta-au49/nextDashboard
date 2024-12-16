import { Box, Container, Heading, Text } from '@chakra-ui/react';

interface CompanyDescriptionProps {
  description: string;
}

const CompanyDescription: React.FC<CompanyDescriptionProps> = ({ description }) => (
  <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
    <Box mt={6}>
      <Heading as="h3" size="md">
        About Us
      </Heading>
      <Text mt={2} color="gray.700">{description}</Text>
    </Box>
  </Container>
);

export default CompanyDescription;
