"use client"
import "styles/tailwind.css"
import { Box } from "@chakra-ui/react"
import { createContext, useContext, useEffect, useState } from "react"
import { z } from "zod"
import { Provider } from "@/components/ui/provider"
import AdminBody from "./components/AdminBody"
import { AdminHeader } from "./components/AdminHeader"
import AdminSidebar from "./components/AdminSidebar"
import { SidebarProvider } from "./contexts/SidebarContext"

const AdminStateSchema = z.object({
  isAdmin: z.boolean(),
  settings: z.record(z.unknown()),
  permissions: z.array(z.string()),
  theme: z.enum(['light', 'dark']),
  lastAccess: z.string().datetime().optional()
})

type AdminContextType = z.infer<typeof AdminStateSchema> & {
  setAdminContext: (value: Partial<z.infer<typeof AdminStateSchema>>) => void
}

const defaultAdminState: z.infer<typeof AdminStateSchema> = {
  isAdmin: false,
  settings: {},
  permissions: [],
  theme: 'light'
}

const AdminContext = createContext<AdminContextType>({
  ...defaultAdminState,
  setAdminContext: () => null
})

export const useAdminContext = () => useContext(AdminContext)

function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminState, setAdminState] = useState(defaultAdminState)

  useEffect(() => {
    const stored = localStorage.getItem('adminContext')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const validated = AdminStateSchema.parse(parsed)
        setAdminState(validated)
      } catch (error) {
        console.error('Invalid admin context stored:', error)
        localStorage.removeItem('adminContext')
      }
    }
  }, [])

  const setAdminContext = (value: Partial<z.infer<typeof AdminStateSchema>>) => {
    const newState = { ...adminState, ...value }
    const validated = AdminStateSchema.parse(newState)
    setAdminState(validated)
    localStorage.setItem('adminContext', JSON.stringify(validated))
  }

  return (
    <AdminContext.Provider value={{ ...adminState, setAdminContext }}>
      {children}
    </AdminContext.Provider>
  )
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html suppressHydrationWarning>
      <body>
        <Provider>
          <AdminProvider>
            <SidebarProvider>
              <Box minH="100vh" bg="gray.50">
                <AdminHeader />
                <AdminSidebar />
                <AdminBody>{children}</AdminBody>
              </Box>
            </SidebarProvider>
          </AdminProvider>
        </Provider>
      </body>
    </html>
  )
}