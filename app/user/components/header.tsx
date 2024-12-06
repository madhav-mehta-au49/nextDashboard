import { Box, Flex, Input, Link } from "@chakra-ui/react"
import { Avatar, AvatarGroup } from "@/components/ui/avatar"

import { Field } from "@/components/ui/field"
import { InputGroup } from "@/components/ui/input-group"
import {
    MenuContent,
    MenuItem,
    MenuItemText,
    MenuRoot,
    MenuTrigger
} from "@/components/ui/menu"


const EmployeeHeader: React.FC = () => {
    return (
        <Box as="header" bg="white" borderBottom="1px" borderColor="gray.200" px={6} py={4}>
            <Flex align="center" justify="space-between" gap={4}>
                {/* Logo/Brand */}
                <Link href="/employee/dashboard">
                    <Box as="span" fontWeight="bold" fontSize="xl">
                        Employee Portal
                    </Box>
                </Link>

                {/* Search Bar */}
                <InputGroup maxW="2xl" w="full">
                    <Field>
                        <Input
                            placeholder="Search tasks, projects, teams..."
                            size="md"
                            bg="gray.50"
                        />
                    </Field>
                </InputGroup>

                {/* User Menu */}
                <MenuRoot>
                    <MenuTrigger>
                        <AvatarGroup>
                            <Avatar
                                size="sm"
                                name="User Name"  // Optional: Add user's name for fallback initials
                                src="/path-to-avatar.jpg"  // Optional: Add user's image path
                                cursor="pointer"
                                _hover={{ opacity: 0.8 }}
                            />
                        </AvatarGroup>
                    </MenuTrigger>
                    <MenuContent>
                        <MenuItem>
                            <MenuItemText>My Profile</MenuItemText>
                        </MenuItem>
                        <MenuItem>
                            <MenuItemText>Settings</MenuItemText>
                        </MenuItem>
                        <MenuItem>
                            <MenuItemText>Time Sheets</MenuItemText>
                        </MenuItem>
                        <MenuItem>
                            <MenuItemText>Help Center</MenuItemText>
                        </MenuItem>
                        <MenuItem>
                            <MenuItemText>Sign Out</MenuItemText>
                        </MenuItem>
                    </MenuContent>
                </MenuRoot>
            </Flex>
        </Box>
    )
}

export default EmployeeHeader
