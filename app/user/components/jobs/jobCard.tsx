// components/JobListingCard.tsx

import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FiBookmark, FiShare2, FiThumbsUp } from "react-icons/fi";
import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";

interface JobListingCardProps {
  title: string;
  company: string;
  location: string;
  logoUrl: string;
  jobUrl: string;
  description: string;
}

const JobListingCard: React.FC<JobListingCardProps> = ({
  title,
  company,
  location,
  logoUrl,
  jobUrl,
  description,
}) => {
  const [upvotes, setUpvotes] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  const handleUpvote = () => {
    setUpvotes((prev) => prev + 1);
    toaster.toast({
      title: "Upvoted!",
      description: "You have upvoted this job listing.",
      type: "success",
      duration: 2000,
      meta: { closable: true },
    });
  };

  const handleBookmark = () => {
    setBookmarked((prev) => !prev);
    toaster.toast({
      title: bookmarked ? "Bookmark Removed" : "Bookmarked!",
      description: bookmarked
        ? "You have removed this job from bookmarks."
        : "You have added this job to bookmarks.",
      type: bookmarked ? "info" : "success",
      duration: 2000,
      meta: { closable: true },
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(jobUrl);
    toaster.toast({
      title: "Link Copied!",
      description: "The job link has been copied to your clipboard.",
      type: "success",
      duration: 2000,
      meta: { closable: true },
    });
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={6}
      boxShadow="lg"
      _hover={{ boxShadow: "xl" }}
      position="relative"
      bg="white"
    >
      <Link href={jobUrl} isExternal position="absolute" inset={0} zIndex={0} aria-label="Job link" />
      <Flex alignItems="center" mb={4}>
        <Image
          src={logoUrl}
          alt={`${company} logo`}
          boxSize="50px"
          borderRadius="full"
          objectFit="cover"
          mr={4}
        />
        <VStack align="start" gap={1}>
          <Text fontSize="lg" fontWeight="bold">
            {title}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {company}
          </Text>
        </VStack>
      </Flex>
      <Text fontSize="sm" color="gray.700" noOfLines={3} mb={4}>
        {description}
      </Text>
      <HStack justify="space-between" mb={4}>
        <Text fontSize="xs" color="gray.500">
          {location}
        </Text>
        <Button as={Link} href={jobUrl} isExternal size="sm" colorScheme="blue">
          Apply Now
        </Button>
      </HStack>
      <HStack gap={4}>
        <Tooltip content="Upvote">
          <IconButton
            icon={<FiThumbsUp />}
            aria-label="Upvote"
            onClick={handleUpvote}
            colorScheme="green"
            variant="outline"
          />
        </Tooltip>
        <Text fontSize="sm" color="gray.700">
          {upvotes} Upvotes
        </Text>
        <Tooltip content="Bookmark">
          <IconButton
            icon={<FiBookmark />}
            aria-label="Bookmark"
            onClick={handleBookmark}
            colorScheme="yellow"
            variant={bookmarked ? "solid" : "outline"}
          />
        </Tooltip>
        <Tooltip content="Copy Link">
          <IconButton
            icon={<FiShare2 />}
            aria-label="Copy Link"
            onClick={handleCopyLink}
            colorScheme="blue"
            variant="outline"
          />
        </Tooltip>
      </HStack>
    </Box>
  );
};

export default JobListingCard;