import { Box, Heading, Image, Link, Text, VStack } from "@chakra-ui/react";

const CompanyDetails = ({
  company,
  logoUrl,
  about,
  size,
  industry,
  website
}: {
  company: string;
  logoUrl: string;
  about: string;
  size: string;
  industry: string;
  website: string;
}) => {
  return (
    <Box bg="white" p={6} borderRadius="lg" shadow="md">
      <VStack align="stretch" gap={4}>
        <Image
          src={logoUrl}
          alt={`${company} logo`}
          height="80px"
          objectFit="contain"
        />
        
        <Box>
          <Heading size="md" mb={2}>{company}</Heading>
          <Text fontSize="sm" color="gray.600">{about}</Text>
        </Box>

        <Box>
          <Text fontSize="sm">
            <strong>Industry:</strong> {industry}
          </Text>
          <Text fontSize="sm">
            <strong>Company size:</strong> {size}
          </Text>
          <Link href={website} color="teal.500" fontSize="sm">
            Visit website
          </Link>
        </Box>
      </VStack>
    </Box>
  );
};
export default CompanyDetails;
