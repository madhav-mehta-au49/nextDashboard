import { Box, Container, Flex, Link, Text, useDisclosure } from "@chakra-ui/react"
import React from "react"
import { FiChevronDown } from "react-icons/fi"
import { MenuContent, MenuItem, MenuRoot, MenuTrigger, MenuTriggerItem } from "@/components/ui/menu"

interface SubMenuItem {
  label: string
  href?: string
  subItems?: {
    label: string
    href: string
    description?: string
  }[]
}

const SubHeader: React.FC = () => {
  const subHeaderLinks: SubMenuItem[] = [
    { label: "All Jobs", href: "/jobs" },
    { 
      label: "Remote Jobs",
      href: "/jobs/remote",
      subItems: [
        { 
          label: "Tech Remote Jobs",
          href: "/jobs/remote/tech",
          description: "Software, IT, and Tech positions"
        },
        { 
          label: "Marketing Remote Jobs",
          href: "/jobs/remote/marketing",
          description: "Marketing and PR positions"
        }
      ]
    },
    { 
      label: "Job Types",
      href: "/jobs/types",
      subItems: [
        { label: "Full-Time", href: "/jobs/full-time" },
        { label: "Part-Time", href: "/jobs/part-time" },
        { label: "Contract", href: "/jobs/contract" }
      ]
    },
    { label: "Companies", href: "/companies" },
    { 
      label: "Resources",
      href: "/resources",
      subItems: [
        { label: "About Us", href: "/about" },
        { label: "Career Advice", href: "/career-advice" },
        { label: "Resume Tips", href: "/resources/resume-tips" },
        { label: "Interview Prep", href: "/resources/interview-prep" }
      ]
    }
  ]

  return (
    <Box 
      as="nav" 
      borderBottom="1px" 
      borderColor="gray.200" 
      bg="white" 
      py={2}
      shadow="sm"
    >
      <Container maxW="1200px">
        <Flex 
          justify="space-between" 
          align="center" 
          gap={6}
          fontSize="sm"
        >
          {subHeaderLinks.map((link) => (
            link.subItems ? (
              <MenuRoot key={link.label} trigger="hover">
                <MenuTrigger>
                  <Flex 
                    cursor="pointer" 
                    color="gray.600" 
                    fontWeight="medium"
                    align="center"
                    gap={1}
                    _hover={{ color: "teal.500" }}
                  >
                    <Link href={link.href}>{link.label}</Link>
                    <FiChevronDown size={16} />
                  </Flex>
                </MenuTrigger>
                <MenuContent>
                  {link.subItems.map((subItem) => (
                    <MenuItem 
                      key={subItem.label}
                      as={Link}
                      href={subItem.href}
                      _hover={{
                        bg: "gray.50",
                        color: "teal.500"
                      }}
                    >
                      <Box>
                        <Text fontWeight="medium">{subItem.label}</Text>
                        {subItem.description && (
                          <Text fontSize="xs" color="gray.500">
                            {subItem.description}
                          </Text>
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                </MenuContent>
              </MenuRoot>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                _hover={{
                  color: "teal.500",
                  textDecoration: "none",
                }}
                color="gray.600"
                fontWeight="medium"
              >
                <Text>{link.label}</Text>
              </Link>
            )
          ))}
        </Flex>
      </Container>
    </Box>
  )
}

export default SubHeader
