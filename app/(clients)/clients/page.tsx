'use client'

import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { DataTable } from './data-table'
import { columns, User } from './columns'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

const ClientsPage = () => {
  const { user, isLoaded } = useUser()
  const [users, setUsers] = useState<User[]>([])
  const [sessionLinks, setSessionLinks] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleToggle = (userId: string, key: string, enabled: boolean) => {
    setUsers(prevUsers =>
      prevUsers.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            enableByCoach: {
              ...user.enableByCoach,
              [key]: enabled
            }
          }
        }
        return user
      })
    )
  }

  useEffect(() => {
    const fetchUsers = async () => {
      // Wait for user to be loaded
      if (!isLoaded || !user) {
        return
      }

      // Check if emailAddresses exists and has at least one email
      const emailAddresses = user.emailAddresses
      if (
        !emailAddresses ||
        !Array.isArray(emailAddresses) ||
        emailAddresses.length === 0
      ) {
        return
      }

      const coachEmail = emailAddresses[0]?.emailAddress
      if (!coachEmail) {
        return
      }

      try {
        setLoading(true)
        setError(null)
        const response = await fetch(
          `/api/clients?coachEmail=${encodeURIComponent(coachEmail)}`
        )
        const data = await response.json()

        if (data.success) {
          setUsers(data.data.users)
          setSessionLinks(data.data.sessionLinks)
        } else {
          setError(data.error || 'Failed to fetch clients')
        }
      } catch (err) {
        setError('Failed to fetch clients')
        console.error('Error fetching clients:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [isLoaded, user])

  if (!isLoaded) {
    return (
      <div className='container mx-auto py-10'>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-lg'>Loading...</div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='container mx-auto py-10'>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-lg'>Loading clients...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto py-10'>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-lg text-red-500'>Error: {error}</div>
        </div>
      </div>
    )
  }

  const handleJoinSession = () => {
    if (sessionLinks) {
      window.open(sessionLinks, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className='container mx-auto py-10'>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>My Clients</h1>
          <p className='text-muted-foreground'>View your assigned clients</p>
        </div>
        {sessionLinks && (
          <Button
            onClick={handleJoinSession}
            className='bg-blue-600 text-white hover:bg-blue-700'
          >
            <ExternalLink className='mr-2 h-4 w-4' />
            Join Session
          </Button>
        )}
      </div>

      {users.length === 0 ? (
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <div className='text-lg text-muted-foreground'>
              No clients assigned to you yet
            </div>
            <div className='mt-2 text-sm text-muted-foreground'>
              Contact your administrator to get clients assigned
            </div>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={users}
          meta={{ onToggle: handleToggle }}
        />
      )}
    </div>
  )
}

export default ClientsPage
