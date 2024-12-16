import { Box, Heading, VStack } from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { AnnouncementCard } from './AnnouncementCard';

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface AnnouncementsProps {
  announcements: Announcement[];
}

const Announcements: React.FC<AnnouncementsProps> = ({ announcements }) => {
  const headingColor = useColorModeValue('gray.700', 'white');
  const sectionBg = useColorModeValue('gray.50', 'gray.800');
  
  return (
    <Box
      p={6}
      borderRadius="xl"
      bg={sectionBg}
      transition="all 0.2s"
    >
      <Heading 
        as="h2" 
        size="md" 
        mb={6}
        color={headingColor}
        fontWeight="bold"
      >
        Announcements
      </Heading>
      
      <VStack 
        gap={6} 
        align="stretch"
        width="100%"
      >
        {announcements.map((announcement) => (
          <AnnouncementCard 
            key={announcement.id} 
            announcement={announcement} 
          />
        ))}
      </VStack>
    </Box>
  );
};

export default Announcements;
