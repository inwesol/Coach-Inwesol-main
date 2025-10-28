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
  Grid3X3
} from 'lucide-react'

interface StoryboardCell {
  id: string
  content: string
  createdAt: string
}

interface StoryboardData {
  id: string
  name: string
  cells: StoryboardCell[]
  createdAt: string
}

interface CareerStorySixData {
  id: string
  user_id: string
  session_id: number
  selected_storyboard_id: string | null
  storyboard_data: StoryboardData | null
  created_at: string
  updated_at: string
}

interface CareerStorySixDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  sessionId: number
}

const CareerStorySixDetailsDialog: React.FC<
  CareerStorySixDetailsDialogProps
> = ({ open, onOpenChange, clientId, sessionId }) => {
  const [careerStorySixData, setCareerStorySixData] =
    useState<CareerStorySixData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && clientId) {
      fetchCareerStorySixData()
    }
  }, [open, clientId])

  const fetchCareerStorySixData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/session-details/${clientId}/career-story-6`
      )
      const data = await response.json()

      if (data.success) {
        setCareerStorySixData(data.data)
      } else {
        setError(data.error || 'Failed to fetch career story six data')
      }
    } catch (err) {
      setError('Failed to fetch career story six data')
      console.error('Error fetching career story six data:', err)
    } finally {
      setLoading(false)
    }
  }

  const getCompletionStatus = () => {
    if (!careerStorySixData) return 'Unknown'
    if (
      careerStorySixData.storyboard_data &&
      careerStorySixData.selected_storyboard_id
    ) {
      return 'Completed'
    }
    return 'In Progress'
  }

  const getCompletionBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return (
          <Badge className='bg-green-100 text-green-800'>
            <CheckCircle className='mr-1 h-3 w-3' />
            Completed
          </Badge>
        )
      case 'in progress':
        return (
          <Badge className='bg-yellow-100 text-yellow-800'>
            <Clock className='mr-1 h-3 w-3' />
            In Progress
          </Badge>
        )
      default:
        return <Badge className='bg-gray-100 text-gray-800'>{status}</Badge>
    }
  }

  const renderStoryboard = (storyboard: StoryboardData) => {
    return (
      <Card className='h-full'>
        <CardHeader className='pb-3'>
          <CardTitle className='flex items-center justify-between text-lg'>
            <div className='flex items-center gap-2'>
              <Grid3X3 className='h-5 w-5' />
              {storyboard.name}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-3 gap-2'>
            {storyboard.cells.map((cell, cellIndex) => (
              <div
                key={cell.id}
                className='min-h-[80px] rounded-lg border bg-gray-50 p-3'
              >
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-xs font-medium text-gray-500'>
                      Cell {cellIndex + 1}
                    </span>
                  </div>
                  <div className='text-sm text-gray-700'>
                    {cell.content ? (
                      <p className='whitespace-pre-wrap leading-relaxed'>
                        {cell.content}
                      </p>
                    ) : (
                      <p className='italic text-gray-400'>Empty</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-6xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-2xl font-bold'>
            <BookOpen className='h-6 w-6' />
            Career Story Six Details
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin' />
            <span className='ml-2'>Loading career story six data...</span>
          </div>
        )}

        {error && (
          <div className='py-8 text-center'>
            <div className='mb-4 text-red-500'>{error}</div>
            <p className='text-muted-foreground'>
              No career story six data available for this client.
            </p>
          </div>
        )}

        {careerStorySixData && !loading && (
          <div className='space-y-6'>
            {/* Selected Storyboard Overview */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <FileText className='h-5 w-5' />
                <h3 className='text-lg font-semibold'>Selected Storyboard</h3>
              </div>
              {/* {getCompletionBadge(getCompletionStatus())} */}
            </div>

            {/* Selected Storyboard */}
            {!careerStorySixData.storyboard_data ? (
              <div className='rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center'>
                <Grid3X3 className='mx-auto mb-2 h-8 w-8 text-gray-400' />
                <p className='text-sm text-gray-500'>No storyboard selected</p>
              </div>
            ) : (
              <div className='space-y-6'>
                {renderStoryboard(careerStorySixData.storyboard_data)}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CareerStorySixDetailsDialog
