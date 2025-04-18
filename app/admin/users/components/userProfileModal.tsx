"use client"
import { useEffect, useRef } from "react"

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export function UserProfileModal({ isOpen, onClose, userId }: UserProfileModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-[625px] max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">User Profile</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">User ID</td>
                  <td className="py-2 text-gray-500">{userId}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Full Name</td>
                  <td className="py-2 text-gray-500">John Doe</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Email</td>
                  <td className="py-2 text-gray-500">john.doe@example.com</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Role</td>
                  <td className="py-2 text-gray-500">Administrator</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Account Status</td>
                  <td className="py-2 text-gray-500">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-500">
                        Active
                      </span>
                    </label>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Join Date</td>
                  <td className="py-2 text-gray-500">January 1, 2023</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Last Login</td>
                  <td className="py-2 text-gray-500">2 hours ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
