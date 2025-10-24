'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Client {
  id: string
  name: string | null
  email: string
  image: string | null
}

interface Session {
  id: string
  sessionId: number
  formId: string
  status: string
  score: number | null
  completedAt: string | null
  updatedAt: string
  insights: any
}

const ClientSessionsPage = () => {
  const params = useParams()
  const clientId = params.id as string

  const [client, setClient] = useState<Client | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClientSessions = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/clients/${clientId}/sessions`)
        const data = await response.json()

        if (data.success) {
          setClient(data.data.client)
          setSessions(data.data.sessions)
        } else {
          setError(data.error || 'Failed to fetch client sessions')
        }
      } catch (err) {
        setError('Failed to fetch client sessions')
        console.error('Error fetching client sessions:', err)
      } finally {
        setLoading(false)
      }
    }

    if (clientId) {
      fetchClientSessions()
    }
  }, [clientId])

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className='h-4 w-4 text-green-500' />
      case 'in_progress':
        return <Clock className='h-4 w-4 text-yellow-500' />
      case 'pending':
        return <Clock className='h-4 w-4 text-gray-500' />
      default:
        return <Clock className='h-4 w-4 text-gray-500' />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return (
          <Badge
            variant='default'
            className='bg-green-50 text-green-800 hover:bg-green-100'
          >
            Completed
          </Badge>
        )
      case 'assigned':
        return (
          <Badge
            variant='default'
            className='bg-yellow-50 text-yellow-800 hover:bg-yellow-100'
          >
            Assigned
          </Badge>
        )
      case 'pending':
        return (
          <Badge
            variant='default'
            className='bg-blue-50 text-blue-800 hover:bg-blue-100'
          >
            Pending
          </Badge>
        )
      default:
        return (
          <Badge
            variant='default'
            className='bg-gray-50 text-gray-800 hover:bg-gray-100'
          >
            {status}
          </Badge>
        )
    }
  }

  // Group sessions by session_id
  const groupedSessions = sessions.reduce(
    (acc, session) => {
      const sessionKey = `session_${session.sessionId}`
      if (!acc[sessionKey]) {
        acc[sessionKey] = {
          sessionId: session.sessionId,
          sessions: []
        }
      }
      acc[sessionKey].sessions.push(session)
      return acc
    },
    {} as Record<string, { sessionId: number; sessions: Session[] }>
  )

  // Sort sessions by session_id
  const sortedSessions = Object.values(groupedSessions).sort(
    (a, b) => a.sessionId - b.sessionId
  )

  if (loading) {
    return (
      <div className='container mx-auto py-10'>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-lg'>Loading client sessions...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto py-10'>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <div className='text-lg text-red-500'>Error: {error}</div>
            <Link href='/clients'>
              <Button variant='outline' className='mt-4'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to Clients
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className='container mx-auto py-10'>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <div className='text-lg text-muted-foreground'>
              Client not found
            </div>
            <Link href='/clients'>
              <Button variant='outline' className='mt-4'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to Clients
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto py-10'>
      {/* Client Info Header */}
      <div className='mb-8'>
        <div className='mb-4 flex items-center gap-4'>
          <Link href='/clients'>
            <Button variant='outline' size='sm'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Clients
            </Button>
          </Link>
        </div>

        <div className='flex items-center gap-4'>
          {client.image && (
            <img
              src={client.image}
              alt={client.name || 'Client'}
              className='h-16 w-16 rounded-full'
            />
          )}
          <div>
            <h1 className='text-3xl font-bold'>
              {client.name || 'Unknown Client'}
            </h1>
            <p className='text-muted-foreground'>{client.email}</p>
          </div>
        </div>
      </div>

      {/* Sessions Cards */}
      <div className='mb-6'>
        <h2 className='mb-6 text-2xl font-semibold'>Sessions</h2>
        {sessions.length === 0 ? (
          <div className='flex h-32 items-center justify-center'>
            <div className='text-center text-muted-foreground'>
              <Calendar className='mx-auto mb-2 h-8 w-8' />
              <div>No sessions found for this client</div>
            </div>
          </div>
        ) : (
          <div className='space-y-8'>
            {sortedSessions.map(sessionGroup => (
              <div key={sessionGroup.sessionId} className='space-y-4'>
                {/* Session Header */}
                <div className='flex items-center gap-3'>
                  <div className='h-px flex-1 bg-border'></div>
                  <h3 className='text-xl font-semibold text-blue-600'>
                    Session {sessionGroup.sessionId + 1}
                  </h3>
                  <div className='h-px flex-1 bg-border'></div>
                </div>

                {/* Session Cards */}
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  {sessionGroup.sessions.map(session => (
                    <Card
                      key={session.id}
                      className='border-l-4 border-l-blue-200 transition-shadow hover:shadow-md'
                    >
                      <CardHeader className='pb-3'>
                        <div className='flex items-center justify-between'>
                          <CardTitle className='text-lg'>
                            {session.formId
                              .split('-')
                              .map(
                                word =>
                                  word.charAt(0).toUpperCase() +
                                  word.slice(1).toLowerCase()
                              )
                              .join(' ')}
                          </CardTitle>
                          {getStatusIcon(session.status)}
                        </div>
                        <div className='flex items-center gap-2'>
                          {getStatusBadge(session.status)}
                        </div>
                      </CardHeader>
                      <CardContent className='pt-0'>
                        <div className='space-y-2'>
                          {session.score !== null && (
                            <div className='text-sm text-muted-foreground'>
                              <strong>Score:</strong> {session.score}
                            </div>
                          )}
                          {session.completedAt && (
                            <div className='text-sm text-muted-foreground'>
                              <strong>Completed:</strong>{' '}
                              {new Date(
                                session.completedAt
                              ).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ClientSessionsPage
