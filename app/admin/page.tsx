"use client"
import { useAdminContext } from "./contexts/AdminContext"
import DashboardPage from "./dashboard/page"

const AdminDashboard = () => {
  const { settings } = useAdminContext()
  
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Dashboard
      </h1>
      <DashboardPage />
    </div>
  )
}

export default AdminDashboard
