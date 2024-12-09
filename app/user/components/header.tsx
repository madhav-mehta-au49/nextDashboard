"use client";
import { Box, Flex, Input, Link } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { FaCog, FaQuestionCircle, FaSignOutAlt, FaUser, FaWallet } from "react-icons/fa"
import { Avatar, AvatarGroup } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { InputGroup } from "@/components/ui/input-group"
import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger
} from "@/components/ui/menu"
import { Notification, NotificationMenu } from "./notification"

export const EmployeeHeader: React.FC = () => {
      const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: "1",
            title: "New Job Match",
            message: "A new job matching your skills has been posted",
            timestamp: "2 hours ago",
            isRead: false,
            type: "info"
        },
        {
            id: "2",
            title: "Payment Received",
            message: "Your latest payment of $1,450 has been processed",
            timestamp: "1 day ago",
            isRead: false,
            type: "success"
        },
        {
            id: "3",
            title: "Timesheet Due",
            message: "Remember to submit your timesheet for this week",
            timestamp: "2 days ago",
            isRead: true,
            type: "warning"
        }
    ]);

    useEffect(() => {
        const safeNotifications = notifications.map(({ id, title, message, timestamp, isRead, type }) => ({
            id,
            title,
            message,
            timestamp,
            isRead,
            type
        }));
        console.log('Notifications:', safeNotifications);
    }, [notifications]);

    const handleMarkAsRead = (id: string) => {
        setNotifications(prevNotifications =>
            prevNotifications.map(notification =>
                notification.id === id
                    ? { ...notification, isRead: true }
                    : notification
            )
        );
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prevNotifications =>
            prevNotifications.map(notification => ({
                ...notification,
                isRead: true
            }))
        );
    };




    return (
        <Box as="header" bg="teal.500" color="white" px={6} py={4}>
            <Flex align="center" justify="space-between" gap={4}>
                <Link href="/employee/dashboard" _hover={{ color: "gray.200" }}>
                    <Box as="span" fontWeight="bold" fontSize="xl">
                        Employee Portal
                    </Box>
                </Link>

                <InputGroup maxW="2xl" w="full">
                    <Field>
                        <Input
                            placeholder="Search Jobs..."
                            size="md"
                            bg="white"
                            color="gray.800"
                            px={4}
                            py={2}
                            _placeholder={{ color: "gray.500" }}
                            _hover={{ bg: "gray.100" }}
                            _focus={{
                                borderColor: "teal.400",
                                boxShadow: "0 0 0 1px var(--chakra-colors-teal-400)",
                                bg: "white"
                            }}
                        />
                    </Field>
                </InputGroup>

                <Flex align="center" gap={4}>
                    <Button
                        size="sm"
                        variant="ghost"
                        _hover={{ bg: "teal.600" }}
                        display="flex"
                        alignItems="center"
                        gap={2}
                    >
                        <FaWallet size={20} />
                        <Box fontSize="sm" fontWeight="medium">
                            $1,234.56
                        </Box>
                    </Button>

                    <NotificationMenu 
                        notifications={notifications}
                        onMarkAsRead={handleMarkAsRead}
                        onMarkAllAsRead={handleMarkAllAsRead}
                    />

                    <MenuRoot>
                        <MenuTrigger>
                            <Button 
                                size="sm" 
                                variant="ghost" 
                                p={0}
                                _hover={{ bg: "teal.600" }}
                            >
                                <AvatarGroup>
                                    <Avatar
                                        size="sm"
                                        name="User Name"
                                        src="/path-to-avatar.jpg"
                                        cursor="pointer"
                                        _hover={{ opacity: 0.8 }}
                                    />
                                </AvatarGroup>
                            </Button>
                        </MenuTrigger>
                        <MenuContent>
                            <MenuItem>
                                <FaUser size={18} />
                                <Link href="/profile">My Profile</Link>
                            </MenuItem>
                            <MenuItem>
                                <FaCog size={18} />
                                <Link href="/settings">Settings</Link>
                            </MenuItem>
                            <MenuItem>
                                <FaQuestionCircle size={18} />
                                <Link href="/help">Help Center</Link>
                            </MenuItem>
                            <MenuItem>
                                <FaSignOutAlt size={18} />
                                <Link href="/signout">Sign Out</Link>
                            </MenuItem>
                        </MenuContent>
                    </MenuRoot>
                </Flex>
            </Flex>
        </Box>
    )
}

export default EmployeeHeader