import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';

interface CompanyInfoProps {
  name: string;
  industry: string;
  size: string;
  location: string;
  website: string;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ name, industry, size, location, website }) => (
  <Flex justify="space-between" align="center" flexWrap="wrap">
    <Box>
      <Heading as="h2" size="lg">
        {name}
      </Heading>
      <Text color="gray.500">
        {industry} • {size} • {location}
      </Text>
    </Box>
    <Button colorScheme="teal" onClick={() => window.open(website, '_blank')} mt={{ base: 4, md: 0 }}>
      Visit Website
    </Button>
  </Flex>
);

export default CompanyInfo;
