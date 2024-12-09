import { Box, Heading, Text } from '@chakra-ui/react';
import React from 'react';

interface AnnouncementCardProps {
  announcement: {
    id: string;
    title: string;
    content: string;
    date: string;
  };
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement }) => (
  <Box borderWidth="1px" borderRadius="md" p={4}>
    <Heading as="h4" size="sm">
      {announcement.title}
    </Heading>
    <Text color="gray.500" fontSize="sm">
      {announcement.date}
    </Text>
    <Text mt={2}>{announcement.content}</Text>
  </Box>
);
