import { 
  Card, 
  HStack, 
  Text, 
  VStack 
} from '@chakra-ui/react';
import React from 'react';
import { 
  FiInfo} from 'react-icons/fi';
import { useColorModeValue } from '@/components/ui/color-mode';

interface AnnouncementCardProps {
  announcement: {
    id: string;
    title: string;
    content: string;
    date: string;
  };
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconColor = useColorModeValue('blue.500', 'blue.300');
  const textColor = useColorModeValue('gray.700', 'white');
  const vStackBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <Card.Root
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      overflow="hidden"
      width={{ base: "100%", md: "400px" }}
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
              {announcement.title}
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
              <Text>{announcement.date}</Text>
            </HStack>

            <HStack justify="space-between">
              <Text>{announcement.content}</Text>
            </HStack>
          </VStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};