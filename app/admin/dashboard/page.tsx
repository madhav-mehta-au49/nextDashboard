"use client"

import { Grid } from "@chakra-ui/react"
import { Bar, Line, Pie } from 'react-chartjs-2'
import DashboardCard from "./components/DashboardCard"
import AdminDashboard from "./components/DashboardGraph"

export default function DashboardPage() {
  const chartData = [
    {
      title: "Monthly Sales",
      component: Bar,
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Sales',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        }]
      }
    },
    {
      title: "User Growth",
      component: Line,
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Users',
          data: [100, 120, 150, 170, 180, 200],
          borderColor: 'rgb(75, 192, 192)',
        }]
      }
    },
    {
      title: "Revenue Distribution",
      component: Pie,
      data: {
        labels: ['Product A', 'Product B', 'Product C'],
        datasets: [{
          data: [300, 200, 100],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
          ],
        }]
      }
    }
  ]

  return (
    <>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <DashboardCard
          label="Total Users"
          value={1234}
          helpText="Active users in the system"
        />
        <DashboardCard
          label="Revenue"
          value="$50,000"
          helpText="Total revenue this month"
        />
        <DashboardCard
          label="Orders"
          value={789}
          helpText="Orders processed this month"
        />
      </Grid>
      <AdminDashboard cardData={chartData} />
    </>
  )
}