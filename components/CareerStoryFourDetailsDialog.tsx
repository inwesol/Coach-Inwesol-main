'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface CareerStoryFourData {
  id: string
  userId: string
  sessionId: number
  rewrittenStory: string
  createdAt: string
  updatedAt: string
}

interface CareerStoryFourDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  sessionId: number
}

export default function CareerStoryFourDetailsDialog({
  open,
  onOpenChange,
  clientId,
  sessionId
}: CareerStoryFourDetailsDialogProps) {
  const [data, setData] = useState<CareerStoryFourData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && clientId && sessionId) {
      fetchCareerStoryFourData()
    }
  }, [open, clientId, sessionId])

  const fetchCareerStoryFourData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `/api/session-details/${clientId}/career-story-4`
      )
      const result = await response.json()

      if (result.success && result.data) {
        setData(result.data)
      } else {
        setError(result.error || 'Failed to fetch career story 4 data')
      }
    } catch (err) {
      setError('Failed to fetch career story 4 data')
      console.error('Error fetching career story 4 data:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-foreground'>
            Career Story 4 - Rewritten Story
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className='flex items-center justify-center py-8'>
            <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
            <span className='ml-2 text-muted-foreground'>
              Loading career story 4 data...
            </span>
          </div>
        )}

        {error && (
          <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg
                  className='h-5 w-5 text-red-400'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-red-800'>Error</h3>
                <div className='mt-2 text-sm text-red-700'>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {data && !loading && (
          <div className='space-y-6'>
            {/* Rewritten Story */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg font-semibold text-foreground'>
                  Rewritten Story
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='rounded-lg bg-muted/40 p-4'>
                  <p className='whitespace-pre-wrap leading-relaxed text-muted-foreground'>
                    {data.rewrittenStory}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
