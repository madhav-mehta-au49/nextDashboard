import { 
  Badge, 
  Box, 
  HStack, 
  Link, 
  Text, 
  VStack 
} from '@chakra-ui/react';
import { Card } from "@chakra-ui/react";
import { 
  FiBriefcase, 
  FiInfo, 
  FiMail, 
  FiMapPin, 
  FiPhone,
  FiUsers 
} from 'react-icons/fi';
import { useColorModeValue } from '@/components/ui/color-mode';


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
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconColor = useColorModeValue('blue.500', 'blue.300');
  const textColor = useColorModeValue('gray.700', 'white');
  const vStackBg = useColorModeValue('gray.50', 'gray.700');
  const loginBoxBg = useColorModeValue('blue.50', 'blue.900');
  const loginTextColor = useColorModeValue('blue.600', 'blue.200');

  return (
    <Card.Root
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      overflow="hidden"
      width={{ base: "100%", md: "400px" }} // Increased width from 320px to 400px
      _hover={{ 
        shadow: "lg",
        transform: "translateY(-2px)"
      }}
      transition="all 0.2s"
    >
      <Card.Body>
        <VStack gap={4} align="stretch">
          <HStack>
            <FiInfo color={iconColor} />
            <Text fontSize="xl" fontWeight="bold" color={textColor}>
              Company Details
            </Text>
          </HStack>

          <VStack 
            gap={4} 
            align="stretch" 
            bg={vStackBg} 
            p={4} 
            borderRadius="md"
          >
            <HStack justify="space-between">
              <HStack>
                <FiBriefcase color={iconColor} />
                <Text fontWeight="medium">Industry</Text>
              </HStack>
              <Text>{industry}</Text>
            </HStack>

            <HStack justify="space-between">
              <HStack>
                <FiUsers color={iconColor} />
                <Text fontWeight="medium">Size</Text>
              </HStack>
              <Badge colorScheme="blue" variant="subtle">{size}</Badge>
            </HStack>

            <HStack justify="space-between">
              <HStack>
                <FiMapPin color={iconColor} />
                <Text fontWeight="medium">Location</Text>
              </HStack>
              <Text>{location}</Text>
            </HStack>

            {isLoggedIn ? (
              <>
                <HStack justify="space-between">
                  <HStack>
                    <FiMail color={iconColor} />
                    <Text fontWeight="medium">Email</Text>
                  </HStack>
                  <Link 
                    href={`mailto:${contactEmail}`} 
                    color="blue.500"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    {contactEmail}
                  </Link>
                </HStack>

                <HStack justify="space-between">
                  <HStack>
                    <FiPhone color={iconColor} />
                    <Text fontWeight="medium">Phone</Text>
                  </HStack>
                  <Link 
                    href={`tel:${contactPhone}`} 
                    color="blue.500"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    {contactPhone}
                  </Link>
                </HStack>
              </>
            ) : (
              <Box
                bg={loginBoxBg}
                p={3}
                borderRadius="md"
                textAlign="center"
              >
                <Text color={loginTextColor}>
                  Log in to see contact information
                </Text>
              </Box>
            )}
          </VStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
export default CompanyDetailsCard;
