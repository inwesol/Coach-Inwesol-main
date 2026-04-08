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
  TrendingUp,
  User,
  MapPin,
  Target,
  Briefcase,
  Quote,
  Lightbulb,
  Heart
} from 'lucide-react'

interface CareerStoryThreeData {
  id: string
  userId: string
  sessionId: number
  selfStatement: string
  settingStatement: string
  plotDescription: string
  plotActivities: string
  ableToBeStatement: string
  placesWhereStatement: string
  soThatStatement: string
  mottoStatement: string
  selectedOccupations: string[]
  createdAt: string
  updatedAt: string
}

interface CareerStoryThreeDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  sessionId: number
}

const CareerStoryThreeDetailsDialog: React.FC<
  CareerStoryThreeDetailsDialogProps
> = ({ open, onOpenChange, clientId, sessionId }) => {
  const [careerStoryThreeData, setCareerStoryThreeData] =
    useState<CareerStoryThreeData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && clientId) {
      fetchCareerStoryThreeData()
    }
  }, [open, clientId])

  const fetchCareerStoryThreeData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/session-details/${clientId}/career-story-3`
      )
      const data = await response.json()

      if (data.success) {
        setCareerStoryThreeData(data.data)
      } else {
        setError(data.error || 'Failed to fetch career story three data')
      }
    } catch (err) {
      setError('Failed to fetch career story three data')
      console.error('Error fetching career story three data:', err)
    } finally {
      setLoading(false)
    }
  }

  const getCompletionStatus = () => {
    if (!careerStoryThreeData) return 'Unknown'
    if (
      careerStoryThreeData.selfStatement &&
      careerStoryThreeData.settingStatement &&
      careerStoryThreeData.plotDescription &&
      careerStoryThreeData.plotActivities &&
      careerStoryThreeData.ableToBeStatement &&
      careerStoryThreeData.placesWhereStatement &&
      careerStoryThreeData.soThatStatement &&
      careerStoryThreeData.mottoStatement
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
        return <Badge className='bg-muted text-foreground'>{status}</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-5xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-2xl font-bold'>
            <BookOpen className='h-6 w-6' />
            Career Story Three Details
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin' />
            <span className='ml-2'>Loading career story three data...</span>
          </div>
        )}

        {error && (
          <div className='py-8 text-center'>
            <div className='mb-4 text-red-500'>{error}</div>
            <p className='text-muted-foreground'>
              No career story three data available for this client.
            </p>
          </div>
        )}

        {careerStoryThreeData && !loading && (
          <div className='space-y-6'>
            {/* Self Statement */}
            {careerStoryThreeData.selfStatement && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <User className='h-5 w-5' />
                    Self Statement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='rounded-lg border bg-muted/40 p-4'>
                    <p className='whitespace-pre-wrap text-sm leading-relaxed text-foreground'>
                      {careerStoryThreeData.selfStatement}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Setting Statement */}
            {careerStoryThreeData.settingStatement && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <MapPin className='h-5 w-5' />
                    Setting Statement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='rounded-lg border bg-muted/40 p-4'>
                    <p className='whitespace-pre-wrap text-sm leading-relaxed text-foreground'>
                      {careerStoryThreeData.settingStatement}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Plot Description */}
            {careerStoryThreeData.plotDescription && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <FileText className='h-5 w-5' />
                    Plot Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='rounded-lg border bg-muted/40 p-4'>
                    <p className='whitespace-pre-wrap text-sm leading-relaxed text-foreground'>
                      {careerStoryThreeData.plotDescription}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Plot Activities */}
            {careerStoryThreeData.plotActivities && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Target className='h-5 w-5' />
                    Plot Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='rounded-lg border bg-muted/40 p-4'>
                    <p className='whitespace-pre-wrap text-sm leading-relaxed text-foreground'>
                      {careerStoryThreeData.plotActivities}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Able To Be Statement */}
            {careerStoryThreeData.ableToBeStatement && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Lightbulb className='h-5 w-5' />
                    Able To Be Statement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='rounded-lg border bg-muted/40 p-4'>
                    <p className='whitespace-pre-wrap text-sm leading-relaxed text-foreground'>
                      {careerStoryThreeData.ableToBeStatement}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Places Where Statement */}
            {careerStoryThreeData.placesWhereStatement && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <MapPin className='h-5 w-5' />
                    Places Where Statement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='rounded-lg border bg-muted/40 p-4'>
                    <p className='whitespace-pre-wrap text-sm leading-relaxed text-foreground'>
                      {careerStoryThreeData.placesWhereStatement}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* So That Statement */}
            {careerStoryThreeData.soThatStatement && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Heart className='h-5 w-5' />
                    So That Statement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='rounded-lg border bg-muted/40 p-4'>
                    <p className='whitespace-pre-wrap text-sm leading-relaxed text-foreground'>
                      {careerStoryThreeData.soThatStatement}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Motto Statement */}
            {careerStoryThreeData.mottoStatement && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Quote className='h-5 w-5' />
                    Motto Statement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='rounded-lg border bg-muted/40 p-4'>
                    <blockquote className='text-sm italic leading-relaxed text-foreground'>
                      "{careerStoryThreeData.mottoStatement}"
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Selected Occupations */}
            {careerStoryThreeData.selectedOccupations &&
              careerStoryThreeData.selectedOccupations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Briefcase className='h-5 w-5' />
                      Selected Occupations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-3'>
                      {careerStoryThreeData.selectedOccupations.map(
                        (occupation, index) => (
                          <div
                            key={index}
                            className='flex items-center gap-2 rounded-lg border bg-muted/40 p-3'
                          >
                            <span className='flex-shrink-0 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800'>
                              {index + 1}
                            </span>
                            <span className='text-sm text-foreground'>
                              {occupation}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CareerStoryThreeDetailsDialog
