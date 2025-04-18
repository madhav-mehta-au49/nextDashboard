"use client";
import { useState } from "react";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

const roles: Role[] = [
  {
    id: "admin",
    name: "Administrator",
    description: "Full access to all resources",
    permissions: [
      "Create users",
      "Edit users",
      "Delete users",
      "Manage roles",
      "Manage settings",
      "View reports",
      "Export data",
    ],
  },
  {
    id: "manager",
    name: "Manager",
    description: "Can manage users and view reports",
    permissions: [
      "Create users",
      "Edit users",
      "View reports",
      "Export data",
    ],
  },
  {
    id: "editor",
    name: "Editor",
    description: "Can edit content but cannot manage users",
    permissions: [
      "Edit content",
      "View reports",
    ],
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Read-only access to content",
    permissions: [
      "View content",
      "View reports",
    ],
  },
];

export function RoleAssignment() {
  const [selectedRole, setSelectedRole] = useState<string>("viewer");

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((role) => (
            <div 
              key={role.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedRole === role.id 
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                  : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <div className="flex items-start">
                <div className="flex-1">
                  <h3 className="font-medium">{role.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {role.description}
                  </p>
                </div>
                <div className="ml-3 flex h-5 items-center">
                  <input
                    type="radio"
                    name="role"
                    value={role.id}
                    checked={selectedRole === role.id}
                    onChange={() => setSelectedRole(role.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Permissions</h3>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {roles.find(r => r.id === selectedRole)?.permissions.map((permission, index) => (
              <div key={index} className="flex items-center">
                <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 text-sm">{permission}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Assign Role
        </button>
      </div>
    </div>
  );
}

export default RoleAssignment;
