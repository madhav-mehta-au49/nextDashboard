// components/HeroSection.tsx
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { FiEdit, FiMapPin, FiUsers } from 'react-icons/fi';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useColorModeValue } from '@/components/ui/color-mode';

interface HeroSectionProps {
  data: {
    name: string;
    headline: string;
    location: string;
    connections: number;
    coverImage: string;
    profilePicture: string;
  };
}

const HeroSection: FC<HeroSectionProps> = ({ data }) => {
  const iconColor = useColorModeValue('blue.500', 'blue.300');

  return (
    <>
      {/* Cover Photo */}
      <Box
        position="relative"
        bgImage={`url(${data.coverImage})`}
        bgSize="cover"
        bgPos="center"
        height="200px"
      >
        <Box
          position="absolute"
          bottom="-50px"
          left="50px"
          bg="white"
          p={1}
          borderRadius="full"
          boxShadow="lg"
        >
          <Avatar size="2xl" name={data.name} src={data.profilePicture} />
        </Box>
      </Box>

      {/* Header with name & headline */}
      <Box pt={16} px={8}>
        <Flex
          justify="space-between"
          align="start"
          flexDir={['column', null, 'row']}
        >
          <Box>
            <Heading fontSize="2xl" mb={1}>
              {data.name}
            </Heading>
            <Text fontSize="md" color="gray.600">
              {data.headline}
            </Text>
            <Flex alignItems="center" gap={1} color="gray.500" fontSize="sm">
              <FiMapPin color={iconColor} />
              <Text>{data.location}</Text>
              <Text>•</Text>
              <FiUsers color={iconColor} />
              <Text>{data.connections}+ connections</Text>
            </Flex>
          </Box>
          <Stack direction="row" gap={3} mt={[4, null, 0]}>
            <Button colorScheme="blue">Connect</Button>
            <Button variant="outline" colorScheme="blue">
              Message
            </Button>
            <IconButton
              aria-label="More options"              
              variant="outline"
              colorScheme="blue"
            >
                <FiEdit /></IconButton>
          </Stack>
        </Flex>
      </Box>
    </>
  );
};
export default HeroSection;