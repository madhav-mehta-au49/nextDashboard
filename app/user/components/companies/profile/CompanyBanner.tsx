import { Box, Container, Image } from '@chakra-ui/react';
import { Avatar } from '@/components/ui/avatar';

interface CompanyBannerProps {
  bannerImageUrl: string;
  logoUrl: string;
  name: string;
}

const CompanyBanner: React.FC<CompanyBannerProps> = ({ bannerImageUrl, logoUrl, name }) => (
  <Box position="relative" width="100%" backgroundColor="gray.50">
    <Container maxW="container.xl" px={{ base: 4, md: 6 }} position="relative">
      <Box position="relative" width="100%" overflow="hidden" borderRadius="lg">
        <Image
          src={bannerImageUrl}
          alt={`${name} banner`}
          width="100%"
          height={{ base: '150px', md: '200px' }}
          objectFit="cover"
        />
        <Avatar
          src={logoUrl}
          name={name}
          size="2xl" // Changed from xl to 2xl for larger size
          position="absolute"
          bottom="-40px" // Adjusted to accommodate larger size
          left="40px"
          borderWidth="6px" // Increased border width
          borderColor="white"
          borderStyle="solid"
          bg="white"
          boxShadow="lg" // Added shadow for prominence
          borderRadius="full" // Ensure perfect circle
        />
      </Box>
    </Container>
  </Box>
);

export default CompanyBanner;
