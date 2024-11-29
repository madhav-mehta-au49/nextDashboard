"use client"
import { ColumnDef } from "@tanstack/react-table"
import { formatDistance } from "date-fns"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/dataTable"
import { UserProfileModal } from "./userProfileModal"

type User = {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

export default function ListUsers() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        return formatDistance(new Date(row.original.createdAt), new Date(), { addSuffix: true })
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log("Edit user:", row.original.id)}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedUserId(row.original.id)
                setIsModalOpen(true)
              }}
            >
              Profile
            </Button>
          </div>
        )
      },
    },
  ]

  const fetchData = async ({
    pageIndex,
    pageSize,
    search,
  }: {
    pageIndex: number
    pageSize: number
    search: string
  }) => {
    // In a real application, this would be an API call
    const dummyData: User[] = Array.from({ length: pageSize }).map((_, i) => ({
      id: `${pageIndex * pageSize + i + 1}`,
      name: search 
        ? `${search} User ${pageIndex * pageSize + i + 1}`
        : `User ${pageIndex * pageSize + i + 1}`,
      email: `user${pageIndex * pageSize + i + 1}@example.com`,
      role: i % 2 === 0 ? "Admin" : "User",
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    }))

    return {
      data: dummyData,
      totalPages: 5,
      totalRows: 50,
    }
  }

  return (
    <>
      <DataTable 
        columns={columns} 
        fetchData={fetchData}
        initialPageSize={10}
      />
      {selectedUserId && (
        <UserProfileModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedUserId(null)
          }}
          userId={selectedUserId}
        />
      )}
    </>
  )
}
