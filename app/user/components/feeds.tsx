import { Badge, Box, Flex, HStack, Text } from '@chakra-ui/react';
import React from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import { Button } from '@/components/ui/button';

interface FeedItem {
  id: string;
  title: string;
  description: string;
  date: string;
  link: string;
}

interface FeedCardProps {
  feedItems: FeedItem[];
}

const FeedCard: React.FC<FeedCardProps> = ({ feedItems }) => {
  return (
    <Box
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      width="full"
      bg="white"
      _hover={{
        transform: "translateY(-4px)",
        shadow: "2xl",
        boxShadow: "0 25px 50px -12px rgba(20, 184, 166, 0.5)"
      }}
      transition="all 0.2s"
    >
      <Flex direction="column" gap={6}>
        {feedItems.map((item) => (
          <Box key={item.id} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
            <HStack justify="space-between" mb={2}>
              <Text fontWeight="bold" fontSize="lg" color="blue.600">
                {item.title}
              </Text>
              <Badge colorScheme="green" variant="solid">
                New
              </Badge>
            </HStack>
            <Text color="gray.600" mt={2}>
              {item.description}
            </Text>
            <HStack justify="space-between" align="center" mt={4}>
              <Text fontSize="sm" color="gray.500">
                {item.date}
              </Text>
              <Button
                as="a"
                size="sm"
                colorScheme="teal"
                variant="ghost"
              >
                Read more
                <FiArrowUpRight />
              </Button>
            </HStack>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default FeedCard;