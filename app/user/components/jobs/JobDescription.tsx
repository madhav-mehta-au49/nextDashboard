"use client";   

import { Box, Heading, HStack, List, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { FiBookmark, FiCheck, FiShare2, FiThumbsUp } from "react-icons/fi";
import { ButtonCustom } from "@/components/ui/button-custom";
import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";

const JobDescription = ({ 
  title, 
  company,
  location,
  description,
  requirements,
  benefits,
  postedDate,
  salary,
  employmentType,
  jobUrl
}: {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  salary: string;
  employmentType: string;
  jobUrl: string;
}) => {
  const [likes, setLikes] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  const handleLike = () => {
    setLikes(prev => prev + 1);
    toaster.create({
      title: "Liked!",
      description: "You have liked this job listing.",
      type: "success",
      duration: 2000,
      meta: { closable: true }
    });
  };

  const handleBookmark = () => {
    setBookmarked(prev => !prev);
    toaster.create({
      title: bookmarked ? "Bookmark Removed" : "Bookmarked!",
      description: bookmarked ? "Job removed from bookmarks." : "Job added to bookmarks.",
      type: bookmarked ? "info" : "success",
      duration: 2000,
      meta: { closable: true }
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(jobUrl);
    toaster.create({
      title: "Link Copied!",
      description: "Job link copied to clipboard.",
      type: "success",
      duration: 2000,
      meta: { closable: true }
    });
  };

  return (
    <Box bg="white" p={8} borderRadius="lg" shadow="md">
      <VStack align="stretch" gap={6}>
        <Box>
          <Heading size="lg" mb={2}>{title}</Heading>
          <Text color="gray.600">{company} • {location}</Text>
          <Text color="teal.500" fontWeight="bold" mt={2}>{salary}</Text>
          <Text color="gray.500" fontSize="sm">{employmentType} • Posted {postedDate}</Text>
        </Box>

        <HStack>
          <ButtonCustom
            intent="solid"
            size="lg"
            text="Apply Now"
            className="flex-1"
          />
          <Tooltip content="Like">
            <ButtonCustom
              intent="outline"
              size="sm"
              text={likes.toString()}
              icon={<FiThumbsUp className="size-3" />}
              onClick={handleLike}
              className="size-8 hover:scale-110 hover:bg-gray-100 hover:opacity-90 transition-all duration-200"
            />
          </Tooltip>
          <Tooltip content="Bookmark">
            <ButtonCustom
              intent={bookmarked ? "solid" : "outline"}
              size="sm"
              text=""
              icon={<FiBookmark className="size-3" />}
              onClick={handleBookmark}
              className="size-8 hover:scale-110 hover:bg-gray-100 hover:opacity-90 transition-all duration-200"
            />
          </Tooltip>
          <Tooltip content="Copy Link">
            <ButtonCustom
              intent="outline"
              size="sm"
              text=""
              icon={<FiShare2 className="size-3" />}
              onClick={handleCopyLink}
              className="size-8 hover:scale-110 hover:bg-gray-100 hover:opacity-90 transition-all duration-200"
            />
          </Tooltip>
        </HStack>

        <Box>
          <Heading size="md" mb={4}>Job Description</Heading>
          <Text whiteSpace="pre-line">{description}</Text>
        </Box>

        <Box>
          <Heading size="md" mb={4}>Requirements</Heading>
          <List.Root gap={3}>
            {requirements.map((req, index) => (
              <List.Item key={index} display="flex">
                <FiCheck color="teal.500" style={{ marginTop: '4px', marginRight: '8px' }} />
                <Text>{req}</Text>
              </List.Item>
            ))}
          </List.Root>
        </Box>

        <Box>
          <Heading size="md" mb={4}>Benefits</Heading>
          <List.Root gap={3}>
            {benefits.map((benefit, index) => (
              <List.Item key={index} display="flex">
                <FiCheck color="teal.500" style={{ marginTop: '4px', marginRight: '8px' }} />
                <Text>{benefit}</Text>
              </List.Item>
            ))}
          </List.Root>
        </Box>
      </VStack>
    </Box>
  );
};

export default JobDescription;