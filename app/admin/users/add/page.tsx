'use client'

import { useState } from 'react'
import { FiShield, FiUser } from 'react-icons/fi'
import { AddUserPage, RoleAssignment } from '@/app/admin/users/components'

const AddUserPageWrapper = () => {
    const [activeTab, setActiveTab] = useState('details')

    return (
        <div className="max-w-7xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-4">Add New User</h1>
            <div>
                <div className="flex space-x-2 border-b border-gray-200 mb-6">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`group ${activeTab === 'details' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                        <div className="p-4 flex items-center gap-2 hover:bg-gray-50 rounded-md">
                            <FiUser />
                            <span>User Details</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('roles')}
                        className={`group ${activeTab === 'roles' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                        <div className="p-4 flex items-center gap-2 hover:bg-gray-50 rounded-md">
                            <FiShield />
                            <span>Role Assignment</span>
                        </div>
                    </button>
                </div>

                <div className="mt-6">
                    {activeTab === 'details' && (
                        <div className="bg-white p-6 rounded-md shadow-sm">
                            <div className="mb-4">
                                <h3 className="text-lg font-medium">User Information</h3>
                                <p className="text-sm text-gray-500">Enter the new user's details</p>
                            </div>
                            <AddUserPage />
                        </div>
                    )}

                    {activeTab === 'roles' && (
                        <div className="bg-white p-6 rounded-md shadow-sm">
                            <div className="mb-4">
                                <h3 className="text-lg font-medium">Role Assignment</h3>
                                <p className="text-sm text-gray-500">Assign roles and permissions to the new user</p>
                            </div>
                            <RoleAssignment />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AddUserPageWrapper
