'use client'

import { Box, HStack } from '@chakra-ui/react'
import { Tabs } from '@chakra-ui/react'
import { FiBell, FiKey, FiLock, FiUser } from 'react-icons/fi'
import { StatHelpText, StatLabel, StatRoot, StatValueText } from '@/components/ui/stat'
import { ChangePasswordForm } from './components'
import { UpdateEmailForm } from './components/updateemail'
import { useSettings } from '../contexts/SettingsContext'

const SettingsPage = () => {
    const { activeSettingsTab, setActiveSettingsTab } = useSettings()

    return (
        <Box maxW="container.xl" mx="auto" py={8}>
            <h1 className="text-2xl font-bold mb-4">Admin Settings</h1>
            <Tabs.Root defaultValue={activeSettingsTab} onValueChange={setActiveSettingsTab}>
                <Tabs.List className="flex space-x-2 border-b border-gray-200 mb-6">
                    <Tabs.Trigger value="account" className="group">
                        <Box p={4} display="flex" alignItems="center" gap={2} _hover={{ bg: 'gray.50' }} borderRadius="md">
                            <FiUser />
                            <span>Account</span>
                        </Box>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="security" className="group">
                        <Box p={4} display="flex" alignItems="center" gap={2} _hover={{ bg: 'gray.50' }} borderRadius="md">
                            <FiLock />
                            <span>Security</span>
                        </Box>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="notifications" className="group">
                        <Box p={4} display="flex" alignItems="center" gap={2} _hover={{ bg: 'gray.50' }} borderRadius="md">
                            <FiBell />
                            <span>Notifications</span>
                        </Box>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="api" className="group">
                        <Box p={4} display="flex" alignItems="center" gap={2} _hover={{ bg: 'gray.50' }} borderRadius="md">
                            <FiKey />
                            <span>API Keys</span>
                        </Box>
                    </Tabs.Trigger>
                </Tabs.List>

                <Box mt={6}>
                    <Tabs.Content value="account">
                        <Box bg="white" p={6} borderRadius="md" shadow="sm">
                            <StatRoot>
                                <StatLabel>Email Settings</StatLabel>
                                <StatHelpText>Manage your email preferences</StatHelpText>
                            </StatRoot>
                            <UpdateEmailForm />
                        </Box>
                    </Tabs.Content>

                    <Tabs.Content value="security">
                        <Box bg="white" p={6} borderRadius="md" shadow="sm">
                            <StatRoot>
                                <StatLabel>Security Settings</StatLabel>
                                <StatHelpText>Manage your security preferences</StatHelpText>
                            </StatRoot>
                            <HStack gap={8} align="start">
                                <Box flex="1">
                                    <StatRoot>
                                        <StatLabel>Two-Factor Authentication</StatLabel>
                                        <StatValueText>Disabled</StatValueText>
                                        <StatHelpText>Enable for additional security</StatHelpText>
                                    </StatRoot>
                                    <Box mt={4}>
                                        <StatRoot>
                                            <StatLabel>Login Notifications</StatLabel>
                                            <StatValueText>Enabled</StatValueText>
                                            <StatHelpText>Receive alerts for new logins</StatHelpText>
                                        </StatRoot>
                                    </Box>
                                    <Box mt={4}>
                                        <StatRoot>
                                            <StatLabel>Security Questions</StatLabel>
                                            <StatValueText>Not Set</StatValueText>
                                            <StatHelpText>Set up account recovery options</StatHelpText>
                                        </StatRoot>
                                    </Box>
                                </Box>
                                <Box flex="1" borderLeft="1px" borderColor="gray.200" pl={8}>
                                    <ChangePasswordForm />
                                </Box>
                            </HStack>
                        </Box>
                    </Tabs.Content>

                    <Tabs.Content value="notifications">
                        <Box bg="white" p={6} borderRadius="md" shadow="sm">
                            <StatRoot>
                                <StatLabel>Notification Preferences</StatLabel>
                                <StatHelpText>Manage your notification settings</StatHelpText>
                            </StatRoot>
                            {/* NotificationForm component will go here */}
                        </Box>
                    </Tabs.Content>

                    <Tabs.Content value="api">
                        <Box bg="white" p={6} borderRadius="md" shadow="sm">
                            <StatRoot>
                                <StatLabel>API Key Management</StatLabel>
                                <StatHelpText>Manage your API keys and access</StatHelpText>
                            </StatRoot>
                            {/* ApiKeyForm component will go here */}
                        </Box>
                    </Tabs.Content>
                </Box>
            </Tabs.Root>
        </Box>
    )
}
export default SettingsPage
