'use client'

import { Button } from "@chakra-ui/react"
import { useState } from 'react'
import { Field } from '@/components/ui/field'
import { toaster } from '@/components/ui/toaster'

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
        toaster.create({
          title: 'Success',
          description: 'Email updated successfully',
          type: 'success',
          duration: 3000,
          meta: { closable: true }
        })
        setEmail('')
      } else {
        throw new Error('Failed to update email')
      }
    } catch (error) {
      toaster.create({
        title: 'Error',
        description: 'Failed to update email',
        type: 'error',
        duration: 3000,
        meta: { closable: true }
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Field
        label="New Email Address"
        helperText="Enter your new email address"
        errorText={email.length > 0 && !email.includes('@') ? 'Please enter a valid email' : undefined}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter new email"
          required
        />
      </Field>

      <Button
        type="submit"
        disabled={loading || !email.includes('@')}
        className="w-full"
        variant="outline"
      >
        {loading ? 'Updating...' : 'Update Email'}
      </Button>
    </form>
  )
}

export default UpdateEmailForm
