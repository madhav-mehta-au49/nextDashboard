'use client'

import { useState } from 'react'

export const UpdateEmailForm = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/settings/email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include',
      })

      if (response.ok) {
        // Show success toast notification
        alert('Email updated successfully')
        setEmail('')
      } else {
        throw new Error('Failed to update email')
      }
    } catch (error) {
      // Show error toast notification
      alert('Failed to update email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          New Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter new email"
          required
        />
        {email.length > 0 && !email.includes('@') && (
          <p className="text-xs text-red-500">Please enter a valid email</p>
        )}
        <p className="text-xs text-gray-500">Enter your new email address</p>
      </div>

      <button
        type="submit"
        disabled={loading || !email.includes('@')}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Updating...' : 'Update Email'}
      </button>
    </form>
  )
}

export default UpdateEmailForm
