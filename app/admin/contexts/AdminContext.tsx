import { createContext, useContext } from 'react'
import { z } from 'zod'

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

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  settings: {},
  permissions: [],
  theme: 'light',
  setAdminContext: () => null
})

export const useAdminContext = () => useContext(AdminContext)
export { AdminContext, AdminStateSchema }
