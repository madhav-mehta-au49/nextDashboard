"use client";

import {
  Box,
  Button,
  Flex,
  IconButton,
  HStack,
  Link,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
    const toggleMenu = () => setIsMenuOpen((prev) => !prev);
    const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
    <Box as="header" bg="teal.500" color="white" px={4} py={3}>
      <Flex align="center" justify="space-between">
        {/* Left Section: Logo */}
        <Box fontSize="xl" fontWeight="bold">
          JobSite
        </Box>

        {/* Center Section: Nav Links */}
        <HStack gap={8} display={{ base: "none", md: "flex" }} position="absolute" left="50%" transform="translateX(-50%)">
          <Link _hover={{ color: "gray.200" }} fontWeight="medium">Home</Link>
          <Link _hover={{ color: "gray.200" }} fontWeight="medium">Jobs</Link>
          <Link _hover={{ color: "gray.200" }} fontWeight="medium">Companies</Link>
          <Link _hover={{ color: "gray.200" }} fontWeight="medium">About Us</Link>
          <Link _hover={{ color: "gray.200" }} fontWeight="medium">Blogs</Link>
        </HStack>

        {/* Right Section: Auth Buttons and Menu */}
        <Flex align="center" gap={4}>
          <Flex display={{ base: "none", md: "flex" }} gap={3}>
            <Button 
              colorScheme="whiteAlpha" 
              variant="ghost"
              _hover={{ bg: "teal.600" }}
            >
              Sign In
            </Button>
            <Button 
              bg="white" 
              color="teal.500"
              _hover={{ bg: "gray.100" }}
              fontWeight="bold"
              px={6}
            >
              Sign Up
            </Button>
          </Flex>

          {/* Mobile Menu */}
          <MenuRoot>
            <MenuTrigger>
              <IconButton
                icon={<FiMenu />}
                variant="ghost"
                aria-label="Menu"
                display={{ base: "flex", md: "none" }}
                onClick={toggleMobileMenu}
              />
            </MenuTrigger>
            {isMobileMenuOpen && (
              <MenuContent>
                <MenuItem>Home</MenuItem>
                <MenuItem>Jobs</MenuItem>
                <MenuItem>Companies</MenuItem>
                <MenuItem>About Us</MenuItem>
                <MenuItem>Blogs</MenuItem>
                <MenuSeparator />
                <MenuItem>Sign Up</MenuItem>
                <MenuItem>Sign In</MenuItem>
              </MenuContent>
            )}
          </MenuRoot>
        </Flex>
      </Flex>
    </Box>
  );
}
