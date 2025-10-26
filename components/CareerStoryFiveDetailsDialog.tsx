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

interface Storyboard {
  id: string
  name: string
  cells: StoryboardCell[]
  createdAt: string
}

interface CareerStoryFiveData {
  id: string
  userId: string
  sessionId: number
  storyboards: Storyboard[]
  createdAt: string
  updatedAt: string
}

interface CareerStoryFiveDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  sessionId: number
}

const CareerStoryFiveDetailsDialog: React.FC<
  CareerStoryFiveDetailsDialogProps
> = ({ open, onOpenChange, clientId, sessionId }) => {
  const [careerStoryFiveData, setCareerStoryFiveData] =
    useState<CareerStoryFiveData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && clientId) {
      fetchCareerStoryFiveData()
    }
  }, [open, clientId])

  const fetchCareerStoryFiveData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/session-details/${clientId}/career-story-5`
      )
      const data = await response.json()

      if (data.success) {
        setCareerStoryFiveData(data.data)
      } else {
        setError(data.error || 'Failed to fetch career story five data')
      }
    } catch (err) {
      setError('Failed to fetch career story five data')
      console.error('Error fetching career story five data:', err)
    } finally {
      setLoading(false)
    }
  }

  const getCompletionStatus = () => {
    if (!careerStoryFiveData) return 'Unknown'
    if (
      careerStoryFiveData.storyboards &&
      careerStoryFiveData.storyboards.length > 0
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

  const renderStoryboard = (storyboard: Storyboard, index: number) => {
    return (
      <Card key={storyboard.id} className='h-full'>
        <CardHeader className='pb-3'>
          <CardTitle className='flex items-center justify-between text-lg'>
            <div className='flex items-center gap-2'>
              <Grid3X3 className='h-5 w-5' />
              {storyboard.name}
            </div>
            {/* <span className='rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800'>
              #{index + 1}
            </span> */}
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
            Career Story Five Details
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin' />
            <span className='ml-2'>Loading career story five data...</span>
          </div>
        )}

        {error && (
          <div className='py-8 text-center'>
            <div className='mb-4 text-red-500'>{error}</div>
            <p className='text-muted-foreground'>
              No career story five data available for this client.
            </p>
          </div>
        )}

        {careerStoryFiveData && !loading && (
          <div className='space-y-6'>
            {/* Storyboards Overview */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <FileText className='h-5 w-5' />
                <h3 className='text-lg font-semibold'>
                  Storyboards ({careerStoryFiveData.storyboards.length})
                </h3>
              </div>
            </div>

            {/* Storyboards List */}
            {careerStoryFiveData.storyboards.length === 0 ? (
              <div className='rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center'>
                <Grid3X3 className='mx-auto mb-2 h-8 w-8 text-gray-400' />
                <p className='text-sm text-gray-500'>No storyboards created</p>
              </div>
            ) : (
              <div className='space-y-6'>
                {careerStoryFiveData.storyboards.map((storyboard, index) =>
                  renderStoryboard(storyboard, index)
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CareerStoryFiveDetailsDialog
