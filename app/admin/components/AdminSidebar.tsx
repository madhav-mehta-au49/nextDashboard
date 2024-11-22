"use client"
import { Box, Text, VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import { FiBox, FiChevronDown, FiChevronUp, FiFileText, FiHome, FiSettings, FiUsers } from "react-icons/fi";
import { useSidebar } from "../contexts/SidebarContext";

interface MenuItem {
  name: string;
  icon: React.ElementType;
  path: string;
  subItems?: MenuItem[];
}

const AdminSidebar = () => {
  const { isSidebarOpen } = useSidebar();
  console.log('Sidebar: Current state:', isSidebarOpen);
  const [menuItems] = useState<MenuItem[]>([
    { name: "Dashboard", icon: FiHome, path: "/admin" },
    { 
      name: "Users", 
      icon: FiUsers, 
      path: "/admin/users",
      subItems: [
        { name: "All Users", icon: FiUsers, path: "/admin/users/all" },
        { name: "Add User", icon: FiUsers, path: "/admin/users/add" }
      ]
    },
    { 
      name: "Products", 
      icon: FiBox, 
      path: "/admin/products",
      subItems: [
        { name: "All Products", icon: FiBox, path: "/admin/products/all" },
        { name: "Add Product", icon: FiBox, path: "/admin/products/add" }
      ]
    },
    { name: "Orders", icon: FiFileText, path: "/admin/orders" },
    { name: "Settings", icon: FiSettings, path: "/admin/settings" },
  ]);

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleSubmenu = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  return (
    <Box
      as="nav"
      pos="fixed"
      left="0"
      h="100vh"
      w={isSidebarOpen ? "240px" : "0"}
      transition="width 0.2s"
      overflow="hidden"
      bg="white"
      borderRight="1px"
      borderColor="gray.200"
      py={8}
      top="0"
    >
      <VStack gap={4} align="stretch">
        <Box px={4}>
          <Box as={FiSettings} boxSize="2rem" color="gray.600" mx="auto" />
        </Box>
        <Box p={4} bg="gray.100" borderRadius="md">
        {menuItems.map((item: MenuItem) => (
          <Box key={item.path}>
            <Box
              onClick={() => item.subItems && toggleSubmenu(item.name)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.75rem 1.5rem",
                cursor: item.subItems ? "pointer" : "default",
                transition: "background-color 0.2s",
              }}
              _hover={{
                bg: "gray.200",
                borderRadius: "md",
              }}
            >
              <NextLink
                href={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "inherit",
                  flex: 1,
                }}
                passHref
              >
                <Box as={item.icon} mr={2} />
                <Box>
                  <Text fontWeight="bold">{item.name}</Text>
                </Box>
              </NextLink>
              {item.subItems && (
                <Box as={expandedItems.includes(item.name) ? FiChevronUp : FiChevronDown} ml={2} />
              )}
            </Box>
            
            {item.subItems && expandedItems.includes(item.name) && (
              <Box pl={6}>
                {item.subItems.map((subItem) => (
                  <NextLink
                    key={subItem.path}
                    href={subItem.path}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "0.5rem 1.5rem",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "background-color 0.2s",
                    }}
                    passHref
                  >
                    <Box 
                      display="flex" 
                      alignItems="center" 
                      width="100%"
                      _hover={{
                        bg: "gray.200",
                        borderRadius: "md",
                      }}
                    >
                      <Box as={subItem.icon} mr={2} />
                      <Box>
                        <Text fontSize="sm">{subItem.name}</Text>
                      </Box>
                    </Box>
                  </NextLink>
                ))}
              </Box>
            )}
          </Box>
        ))}
        </Box>
      </VStack>
    </Box>
  );
};

export default AdminSidebar;
