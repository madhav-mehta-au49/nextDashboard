'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { toaster } from '@/components/ui/toaster'

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
        toaster.create({
          title: 'Success',
          description: 'Password updated successfully',
          type: 'success',
          duration: 3000,
          meta: { closable: true }
        })
        setPasswords({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      } else {
        throw new Error('Failed to update password')
      }
    } catch (error) {
      toaster.create({
        title: 'Error',
        description: 'Failed to update password',
        type: 'error',
        duration: 3000,
        meta: { closable: true }
      })
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

      <Field
        label="Current Password"
        helperText="Enter your current password"
      >
        <input
          type="password"
          value={passwords.currentPassword}
          onChange={handleChange('currentPassword')}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </Field>

      <Field
        label="New Password"
        errorText={error}
        helperText="Enter your new password"
      >
        <input
          type="password"
          value={passwords.newPassword}
          onChange={handleChange('newPassword')}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </Field>

      <Field
        label="Confirm Password"
        errorText={error}
        helperText="Re-enter your new password"
      >
        <input
          type="password"
          value={passwords.confirmPassword}
          onChange={handleChange('confirmPassword')}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </Field>

      <Button
        type="submit"
        disabled={loading || !passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword}
        className="w-full"
        variant="outline"
      >
        {loading ? 'Updating Password...' : 'Update Password'}
      </Button>
    </form>
  )
}

export default ChangePasswordForm
