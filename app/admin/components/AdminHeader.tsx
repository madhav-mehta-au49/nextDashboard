"use client";

import { Box, Flex, IconButton, Input } from "@chakra-ui/react";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";
import { CgProfile } from 'react-icons/cg';
import { FiBell, FiFileText, FiHome, FiLogOut, FiMenu, FiSearch, FiSettings, FiUser, FiUsers } from 'react-icons/fi';

import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@/components/ui/menu";
import { useSidebar } from "../contexts/SidebarContext";

export const AdminHeader: React.FC = () => {
    const router = useRouter();
    const { isSidebarOpen, toggleSidebar } = useSidebar();

    useEffect(() => {
        // Example of using router
        // console.log('Current route:', router.pathname);
    }, [router]);

    return (
        <Box as="header" bg="white" borderBottom="1px" borderColor="gray.200" px={6} py={4} ml={isSidebarOpen ? "240px" : "0"} transition="margin-left 0.2s"  position="fixed" top={0} right={0} left={0}  zIndex={10}>
            <Flex alignItems="center" justifyContent="space-between">
                <Flex alignItems="center" gap={4} flex={1}>
                    <IconButton
                        aria-label="Toggle Sidebar"
                        variant="ghost"
                        onClick={() => {
                            console.log('Header: Toggling sidebar');
                            toggleSidebar();
                        }}
                    >
                        <FiMenu size={20} />
                    </IconButton>
                    <Field width="100%" maxW="600px">
                        <IconButton
                            aria-label="Search"
                            variant="ghost"
                            position="absolute"
                            left={3}
                            top="50%"
                            transform="translateY(-50%)"
                            zIndex={2}
                        >
                            <FiSearch size={20} />
                        </IconButton>
                        <InputGroup>
                            <Input
                                placeholder="Search..."
                                borderRadius="full"
                                variant="outline"
                                pl={12}
                                fontSize="md"
                                _hover={{ borderColor: 'gray.400' }}
                                _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                            />
                        </InputGroup>
                    </Field>
                    <Flex alignItems="center" gap={2}>
                        <IconButton
                            aria-label="Home"
                            variant="ghost"
                            onClick={() => router.push('/admin')}
                            title="Home"
                        >
                            <FiHome size={20} />
                        </IconButton>
                        <IconButton
                            aria-label="Documents"
                            variant="ghost"
                            onClick={() => router.push('/admin/documents')}
                            title="Documents"
                        >
                            <FiFileText size={20} />
                        </IconButton>
                        <IconButton
                            aria-label="Users"
                            variant="ghost"
                            onClick={() => router.push('/admin/users')}
                            title="Users"
                        >
                            <FiUsers size={20} />
                        </IconButton>
                    </Flex>
                </Flex>
                <Flex alignItems="center" gap={4}>
                    <MenuRoot>
                        <MenuTrigger asChild>
                            <IconButton aria-label="Notifications" variant="ghost" size="md">
                                <FiBell size={20} />
                            </IconButton>
                        </MenuTrigger>
                        <MenuContent>
                            <MenuItem value="notification-1">No new notifications</MenuItem>
                        </MenuContent>
                    </MenuRoot>

                    <MenuRoot>
                        <MenuTrigger asChild>
                            <IconButton aria-label="User menu" variant="ghost" size="md">
                                <FiUser size={20} />
                            </IconButton>
                        </MenuTrigger>
                        <MenuContent>
                            <MenuItem value="profile">
                                <Flex align="center" gap={2}>
                                    <CgProfile size={16} />
                                    Profile
                                </Flex>
                            </MenuItem>
                            <MenuItem value="settings">
                                <Flex align="center" gap={2}>
                                    <FiSettings size={16} />
                                    Settings
                                </Flex>
                            </MenuItem>
                            <MenuItem value="logout" onClick={() => console.log("logout")}>
                                <Flex align="center" gap={2}>
                                    <FiLogOut size={16} />
                                    Logout
                                </Flex>
                            </MenuItem>
                        </MenuContent>
                    </MenuRoot>
                </Flex>
            </Flex>
        </Box>
    );
};