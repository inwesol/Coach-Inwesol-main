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
  Image,
  CheckCircle,
  Clock,
  Palette,
  Calendar
} from 'lucide-react'

interface CollageElement {
  x: number
  y: number
  id: string
  type: string
  width: number
  height: number
  zIndex: number
  content: string
  rotation: number
}

interface MyLifeCollageData {
  id: string
  userId: string
  sessionId: number
  presentLifeCollage: CollageElement[]
  futureLifeCollage: CollageElement[]
  createdAt: string
  updatedAt: string
}

interface MyLifeCollageDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  sessionId: number
}

const MyLifeCollageDetailsDialog: React.FC<MyLifeCollageDetailsDialogProps> = ({
  open,
  onOpenChange,
  clientId,
  sessionId
}) => {
  const [myLifeCollageData, setMyLifeCollageData] =
    useState<MyLifeCollageData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && clientId) {
      fetchMyLifeCollageData()
    }
  }, [open, clientId])

  const fetchMyLifeCollageData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/session-details/${clientId}/my-life-collage`
      )
      const data = await response.json()

      if (data.success) {
        setMyLifeCollageData(data.data)
      } else {
        setError(data.error || 'Failed to fetch my life collage data')
      }
    } catch (err) {
      setError('Failed to fetch my life collage data')
      console.error('Error fetching my life collage data:', err)
    } finally {
      setLoading(false)
    }
  }

  const getCompletionStatus = () => {
    if (!myLifeCollageData) return 'Unknown'
    if (
      myLifeCollageData.presentLifeCollage &&
      myLifeCollageData.presentLifeCollage.length > 0 &&
      myLifeCollageData.futureLifeCollage &&
      myLifeCollageData.futureLifeCollage.length > 0
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

  const renderCollageElements = (elements: CollageElement[], title: string) => {
    if (!elements || elements.length === 0) {
      return (
        <div className='rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center'>
          <Image className='mx-auto mb-2 h-8 w-8 text-gray-400' />
          <p className='text-sm text-gray-500'>
            No {title.toLowerCase()} elements
          </p>
        </div>
      )
    }

    return (
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h4 className='text-sm font-medium text-gray-700'>
            {title} ({elements.length} elements)
          </h4>
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {elements.map((element, index) => (
            <div
              key={element.id}
              className='rounded-lg border bg-white p-4 shadow-sm'
            >
              <div className='space-y-3'>
                {/* Element Info */}
                <div className='flex items-center justify-start'>
                  <span className='rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800'>
                    #{index + 1}
                  </span>
                </div>

                {/* Image Preview */}
                <div className='aspect-square overflow-hidden rounded-lg bg-gray-100'>
                  <img
                    src={element.content}
                    alt={`${title} element ${index + 1}`}
                    className='h-full w-full object-cover'
                    onError={e => {
                      const target = e.target as HTMLImageElement
                      target.src =
                        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSA1MEw5MCA3NUg2MEw3NSA1MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTc1IDEwMEw2MCA3NUg5MEw3NSAxMDBaIiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9Ijc1IiB5PSI4NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZTwvdGV4dD4KPC9zdmc+'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-6xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-2xl font-bold'>
            <Palette className='h-6 w-6' />
            My Life Collage Details
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin' />
            <span className='ml-2'>Loading my life collage data...</span>
          </div>
        )}

        {error && (
          <div className='py-8 text-center'>
            <div className='mb-4 text-red-500'>{error}</div>
            <p className='text-muted-foreground'>
              No my life collage data available for this client.
            </p>
          </div>
        )}

        {myLifeCollageData && !loading && (
          <div className='space-y-6'>
            {/* Present Life Collage */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Calendar className='h-5 w-5' />
                  Present Life Collage
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderCollageElements(
                  myLifeCollageData.presentLifeCollage,
                  'Present Life'
                )}
              </CardContent>
            </Card>

            {/* Future Life Collage */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Image className='h-5 w-5' />
                  Future Life Collage
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderCollageElements(
                  myLifeCollageData.futureLifeCollage,
                  'Future Life'
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default MyLifeCollageDetailsDialog
