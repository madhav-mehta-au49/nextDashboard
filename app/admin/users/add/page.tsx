'use client'

import { Box } from '@chakra-ui/react'
import { Tabs } from '@chakra-ui/react'
import { FiShield, FiUser } from 'react-icons/fi'
import { AddUserPage, RoleAssignment } from '@/app/admin/users/components'
import { StatHelpText, StatLabel, StatRoot } from '@/components/ui/stat'

const AddUserPageWrapper = () => {
    return (
        <Box maxW="container.xl" mx="auto" py={8}>
            <h1 className="text-2xl font-bold mb-4">Add New User</h1>
            <Tabs.Root defaultValue="details">
                <Tabs.List className="flex space-x-2 border-b border-gray-200 mb-6">
                    <Tabs.Trigger value="details" className="group">
                        <Box p={4} display="flex" alignItems="center" gap={2} _hover={{ bg: 'gray.50' }} borderRadius="md">
                            <FiUser />
                            <span>User Details</span>
                        </Box>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="roles" className="group">
                        <Box p={4} display="flex" alignItems="center" gap={2} _hover={{ bg: 'gray.50' }} borderRadius="md">
                            <FiShield />
                            <span>Role Assignment</span>
                        </Box>
                    </Tabs.Trigger>
                </Tabs.List>

                <Box mt={6}>
                    <Tabs.Content value="details">
                        <Box bg="white" p={6} borderRadius="md" shadow="sm">
                            <StatRoot>
                                <StatLabel>User Information</StatLabel>
                                <StatHelpText>Enter the new user's details</StatHelpText>
                            </StatRoot>
                            <AddUserPage />
                        </Box>
                    </Tabs.Content>

                    <Tabs.Content value="roles">
                        <Box bg="white" p={6} borderRadius="md" shadow="sm">
                            <StatRoot>
                                <StatLabel>Role Assignment</StatLabel>
                                <StatHelpText>Assign roles and permissions to the new user</StatHelpText>
                            </StatRoot>
                            <RoleAssignment />
                        </Box>
                    </Tabs.Content>
                </Box>
            </Tabs.Root>
        </Box>
    )
}

export default AddUserPageWrapper
