import { Box, Heading, Stack, Text } from '@chakra-ui/react';

interface CompanyDetailsCardProps {
  industry: string;
  size: string;
  location: string;
  contactEmail: string;
  contactPhone: string;
  isLoggedIn: boolean;
}

const CompanyDetailsCard: React.FC<CompanyDetailsCardProps> = ({
  industry,
  size,
  location,
  contactEmail,
  contactPhone,
  isLoggedIn,
}) => (
  <Box flex="1" borderWidth="1px" borderRadius="md" p={4} boxShadow="sm">
    <Heading as="h3" size="md" mb={4}>
      Company Details
    </Heading>
    <Stack gap={2}>
      <Text>
        <strong>Industry:</strong> {industry}
      </Text>
      <Text>
        <strong>Company Size:</strong> {size}
      </Text>
      <Text>
        <strong>Headquarters:</strong> {location}
      </Text>
      {isLoggedIn ? (
        <>
          <Text>
            <strong>Contact Email:</strong> {contactEmail}
          </Text>
          <Text>
            <strong>Contact Phone:</strong> {contactPhone}
          </Text>
        </>
      ) : (
        <Text color="gray.500">Log in to see contact information</Text>
      )}
    </Stack>
  </Box>
);

export default CompanyDetailsCard;
