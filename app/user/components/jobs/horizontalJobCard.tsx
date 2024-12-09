
"use client";

import {
  Box, Flex, HStack, 
  Image, Link, Text} from "@chakra-ui/react";
import { useState } from "react";
import { FiBookmark, FiShare2, FiThumbsUp } from "react-icons/fi";
import { ButtonCustom } from "@/components/ui/button-custom";
import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";

interface Job {
  title: string;
  company: string;
  location: string;
  logoUrl: string;
  jobUrl: string;
  description: string;
}

const HorizontalJobCard = ({ title, company, location, logoUrl, jobUrl, description }: Job) => {
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
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={6}
      width="100%"
      height="auto"
      minHeight="160px"
      _hover={{
        transform: "translateY(-4px)",
        shadow: "2xl",
        boxShadow: "0 25px 50px -12px #14B8A6"
      }}
      transition="all 0.2s"
      position="relative"
      bg="white"
    >
      <Link href={jobUrl} position="absolute" inset={0} zIndex={0} aria-label="Job link" />
      
      <Flex gap={6} height="100%">
        <Image
          src={logoUrl}
          alt={`${company} logo`}
          boxSize="100px"
          borderRadius="lg"
          objectFit="cover"
        />
        
        <Flex flex={1} direction="column" justify="space-between">
          <Box>
            <Text fontSize="2xl" fontWeight="bold" mb={2} lineHeight="1.4">{title}</Text>
            <HStack gap={4} mb={3}>
              <Text fontSize="md" color="gray.600">{company}</Text>
              <Text fontSize="md" color="gray.500">•</Text>
              <Text fontSize="md" color="gray.600">{location}</Text>
            </HStack>
            <Text fontSize="md" color="gray.600" lineHeight="1.6" lineClamp={2} mb={4}>
              {description}
            </Text>
          </Box>

          <Flex justify="space-between" align="center">
            <HStack gap={2}>
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
            
            <ButtonCustom
              intent="solid"
              size="md"
              text="Apply Now"
            />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default HorizontalJobCard;
