"use client"
import { Button } from "@/components/ui/button"
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export function UserProfileModal({ isOpen, onClose, userId }: UserProfileModalProps) {
  return (
    <DialogRoot open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>
        <DialogBody>
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
                    <Switch defaultChecked trackLabel={{ on: "Active", off: "Inactive" }} />
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
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}
