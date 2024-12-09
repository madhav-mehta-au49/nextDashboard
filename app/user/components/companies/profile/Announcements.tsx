import { Box, Heading, VStack } from '@chakra-ui/react';
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

const Announcements: React.FC<AnnouncementsProps> = ({ announcements }) => (
  <Box>
    <Heading as="h3" size="md" mt={6} mb={4}>
      Announcements
    </Heading>
    <VStack gap={4} align="stretch">
      {announcements.map((announcement) => (
        <AnnouncementCard key={announcement.id} announcement={announcement} />
      ))}
    </VStack>
  </Box>
);

export default Announcements;
