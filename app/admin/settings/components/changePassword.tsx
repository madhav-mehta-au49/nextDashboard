'use client'

import { useState } from 'react'

export function ChangePasswordForm() {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch('/api/admin/settings/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
        credentials: 'include',
      })

      if (response.ok) {
        // Show success toast notification
        alert('Password updated successfully')
        setPasswords({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      } else {
        throw new Error('Failed to update password')
      }
    } catch (error) {
      // Show error toast notification
      alert('Failed to update password')
    } finally {
      setLoading(false)
      setError('')
    }
  }

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    setError('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Change Password</h2>
        <p className="text-sm text-gray-500">
          Please enter your current password and choose a new password.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Current Password
        </label>
        <input
          type="password"
          value={passwords.currentPassword}
          onChange={handleChange('currentPassword')}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <p className="text-xs text-gray-500">Enter your current password</p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          New Password
        </label>
        <input
          type="password"
          value={passwords.newPassword}
          onChange={handleChange('newPassword')}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <p className="text-xs text-gray-500">Enter your new password</p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          type="password"
          value={passwords.confirmPassword}
          onChange={handleChange('confirmPassword')}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <p className="text-xs text-gray-500">Re-enter your new password</p>
      </div>

      <button
        type="submit"
        disabled={loading || !passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Updating Password...' : 'Update Password'}
      </button>
    </form>
  )
}

export default ChangePasswordForm
