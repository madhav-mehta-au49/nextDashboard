import { 
  Badge, 
  Box, 
  Container, 
  Flex, 
  Heading, 
  Text,
} from '@chakra-ui/react';
import { FiBriefcase, FiGlobe, FiMapPin, FiUsers } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { useColorModeValue } from '@/components/ui/color-mode';


interface CompanyInfoProps {
  name: string;
  industry: string;
  size: string;
  location: string;
  website: string;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ name, industry, size, location, website }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconColor = useColorModeValue('blue.500', 'blue.300');
  
  return (
    <Container maxW="container.xl" p={0}>
      <Box
        bg={bgColor}
        borderRadius="xl"
        borderWidth="1px"
        borderColor={borderColor}
        p={6}
        shadow="sm"
        _hover={{ shadow: 'md' }}
        transition="all 0.2s"
      >
        <Flex 
          direction={{ base: 'column', md: 'row' }} 
          justify="space-between" 
          align={{ base: 'start', md: 'center' }}
          gap={4}
        >
          <Box>
            <Heading as="h2" size="lg" mb={3}>
              {name}
            </Heading>
            
            <Flex gap={4} flexWrap="wrap">
              <Flex align="center" gap={2}>
                <FiBriefcase color={iconColor} />
                <Badge colorPalette="blue" fontSize="sm" px={3} py={1}>
                  {industry}
                </Badge>
              </Flex>
              
              <Flex align="center" gap={2}>
                <FiUsers color={iconColor} />
                <Badge colorPalette="green" fontSize="sm" px={3} py={1}>
                  {size}
                </Badge>
              </Flex>
              
              <Flex align="center" gap={2}>
                <FiMapPin color={iconColor} />
                <Badge colorPalette="purple" fontSize="sm" px={3} py={1}>
                  {location}
                </Badge>
              </Flex>
            </Flex>
          </Box>

          <Button
            onClick={() => window.open(website, '_blank')}
            colorPalette="teal"  // Changed back to teal to match JobCard
            size="lg"
            _hover={{
              transform: 'translateY(-2px)',
              shadow: 'md',
            }}
            transition="all 0.2s"
          >
            <FiGlobe />
            <Text ml={2}>Visit Website</Text>
          </Button>
        </Flex>
      </Box>
    </Container>
  );
};

export default CompanyInfo;
