"use client"
import { Box, Text } from "@chakra-ui/react"
import { useAdminContext } from "./contexts/AdminContext"
import DashboardPage from "./dashboard/page"

const AdminDashboard = () => {
  const { settings } = useAdminContext()
  
  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Dashboard
      </Text>
      <DashboardPage />
    </Box>
  )
}

export default AdminDashboard