'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Loader2,
  FileText,
  CheckCircle,
  Clock,
  BookOpen,
  MessageSquare,
  ClipboardList
} from 'lucide-react'

interface SessionReportData {
  id: string
  user_id: string
  session_id: number
  summary: string
  coach_feedback: string | null
  created_at: string
  updated_at: string
}

interface SessionReportDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  sessionId: number
}

const SessionReportDetailsDialog: React.FC<SessionReportDetailsDialogProps> = ({
  open,
  onOpenChange,
  clientId,
  sessionId
}) => {
  const [sessionReportData, setSessionReportData] =
    useState<SessionReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && clientId) {
      fetchSessionReportData()
    }
  }, [open, clientId])

  const fetchSessionReportData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/session-details/${clientId}/session-report?sessionId=${sessionId}`
      )
      const data = await response.json()

      if (data.success) {
        setSessionReportData(data.data)
      } else {
        setError(data.error || 'Failed to fetch session report data')
      }
    } catch (err) {
      setError('Failed to fetch session report data')
      console.error('Error fetching session report data:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-2xl font-bold'>
            <BookOpen className='h-6 w-6' />
            Session Report Details
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin' />
            <span className='ml-2'>Loading session report data...</span>
          </div>
        )}

        {error && (
          <div className='py-8 text-center'>
            <div className='mb-4 text-red-500'>{error}</div>
            <p className='text-muted-foreground'>
              No session report data available for this client.
            </p>
          </div>
        )}

        {sessionReportData && !loading && (
          <div className='space-y-6'>
            {/* Report Overview */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <FileText className='h-5 w-5' />
                <h3 className='text-lg font-semibold'>Session Report</h3>
              </div>
            </div>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <ClipboardList className='h-5 w-5' />
                  Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sessionReportData.summary ? (
                  <div className='rounded-lg border bg-gray-50 p-4'>
                    <p className='whitespace-pre-wrap leading-relaxed text-gray-900'>
                      {sessionReportData.summary}
                    </p>
                  </div>
                ) : (
                  <div className='rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center'>
                    <ClipboardList className='mx-auto mb-2 h-8 w-8 text-gray-400' />
                    <p className='text-sm text-gray-500'>
                      No summary available
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Coach Feedback */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <MessageSquare className='h-5 w-5' />
                  Coach Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sessionReportData.coach_feedback ? (
                  <div className='rounded-lg border bg-gray-50 p-4'>
                    <p className='whitespace-pre-wrap leading-relaxed text-gray-900'>
                      {sessionReportData.coach_feedback}
                    </p>
                  </div>
                ) : (
                  <div className='rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center'>
                    <MessageSquare className='mx-auto mb-2 h-8 w-8 text-gray-400' />
                    <p className='text-sm text-gray-500'>
                      No coach feedback available
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default SessionReportDetailsDialog
