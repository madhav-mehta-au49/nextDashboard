import { Box, Image } from '@chakra-ui/react';
import { Avatar } from '@/components/ui/avatar';

interface CompanyBannerProps {
  bannerImageUrl: string;
  logoUrl: string;
  name: string;
}

const CompanyBanner: React.FC<CompanyBannerProps> = ({ bannerImageUrl, logoUrl, name }) => (
  <Box position="relative">
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
      size="xl"
      position="absolute"
      bottom="-30px"
      left="30px"
      borderWidth="4px"
      borderColor="white"
      bg="white"
    />
  </Box>
);

export default CompanyBanner;
