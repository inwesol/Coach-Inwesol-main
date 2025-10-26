'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Loader2,
  FileText,
  BookOpen,
  MessageSquare,
  ClipboardList,
  CheckCircle
} from 'lucide-react'

interface ScheduleCallData {
  summary: string
  coach_feedback: string | null
}

interface ScheduleCallDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  sessionId: number
  onPublishSuccess?: () => void
}

const ScheduleCallDetailsDialog: React.FC<ScheduleCallDetailsDialogProps> = ({
  open,
  onOpenChange,
  clientId,
  sessionId,
  onPublishSuccess
}) => {
  const [scheduleCallData, setScheduleCallData] =
    useState<ScheduleCallData | null>(null)
  const [summary, setSummary] = useState('')
  const [coachFeedback, setCoachFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (open && clientId) {
      fetchScheduleCallData()
    }
  }, [open, clientId, sessionId])

  const fetchScheduleCallData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/session-details/${clientId}/schedule-call?sessionId=${sessionId}`
      )
      const data = await response.json()

      if (data.success) {
        setScheduleCallData(data.data)
        setSummary(data.data.summary || '')
        setCoachFeedback(data.data.coach_feedback || '')
      } else {
        // No data found - this is okay for new entries
        setScheduleCallData(null)
        setSummary('')
        setCoachFeedback('')
      }
    } catch (err) {
      setError('Failed to fetch schedule call data')
      console.error('Error fetching schedule call data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    try {
      setPublishing(true)
      setError(null)
      setSuccess(false)

      const response = await fetch(
        `/api/session-details/${clientId}/schedule-call`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            summary,
            coach_feedback: coachFeedback,
            sessionId
          })
        }
      )

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setPublishing(false)
        // Call the success callback to refresh data
        if (onPublishSuccess) {
          onPublishSuccess()
        }
        // Close the dialog after 2 seconds
        setTimeout(() => {
          onOpenChange(false)
          setSuccess(false)
        }, 2000)
      } else {
        setError(data.error || 'Failed to publish schedule call data')
        setPublishing(false)
      }
    } catch (err) {
      setError('Failed to publish schedule call data')
      setPublishing(false)
      console.error('Error publishing schedule call data:', err)
    }
  }

  const handleClose = () => {
    // Reset state when closing
    setSuccess(false)
    setError(null)
    setPublishing(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-2xl font-bold'>
            <BookOpen className='h-6 w-6' />
            Schedule Call Details
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin' />
            <span className='ml-2'>Loading schedule call data...</span>
          </div>
        )}

        {error && (
          <div className='py-4 text-center'>
            <div className='mb-4 text-red-500'>{error}</div>
          </div>
        )}

        {success && (
          <div className='py-4 text-center'>
            <div className='mb-4 flex items-center justify-center gap-2 text-green-600'>
              <CheckCircle className='h-5 w-5' />
              <span className='font-medium'>
                Schedule call data published successfully!
              </span>
            </div>
          </div>
        )}

        {!loading && (
          <div className='space-y-6'>
            {/* Summary Section */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <ClipboardList className='h-5 w-5' />
                  Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  placeholder='Write the session summary here...'
                  className='min-h-72 w-full resize-y rounded-lg border-2 border-gray-200 p-2 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                />
              </CardContent>
            </Card>

            {/* Coach Feedback Section */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <MessageSquare className='h-5 w-5' />
                  Coach Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={coachFeedback}
                  onChange={e => setCoachFeedback(e.target.value)}
                  placeholder='Write your coach feedback here...'
                  className='min-h-48 w-full resize-y rounded-lg border-2 border-gray-200 p-2 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                />
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter className='flex-col gap-2 sm:flex-row sm:gap-0'>
          <Button variant='outline' onClick={handleClose} disabled={publishing}>
            Cancel
          </Button>
          <Button
            onClick={handlePublish}
            disabled={publishing}
            className='bg-green-600 hover:bg-green-700'
          >
            {publishing ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Publishing...
              </>
            ) : (
              'Publish'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ScheduleCallDetailsDialog
