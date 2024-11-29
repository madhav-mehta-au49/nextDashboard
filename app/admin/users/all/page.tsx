
"use client"
import { useState } from "react"
import { ListUsers, UserProfileModal } from "../components"

export default function UsersPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const handleCloseModal = () => {
    setIsProfileModalOpen(false)
    setSelectedUserId(null)
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Users</h1>
      </div>
      <ListUsers />
      {selectedUserId && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={handleCloseModal}
          userId={selectedUserId}
        />
      )}
    </div>
  )
}
