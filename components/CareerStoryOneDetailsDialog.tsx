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
  Briefcase,
  Heart,
  Quote
} from 'lucide-react'

interface CareerStoryOneData {
  id: string
  userId: string
  sessionId: number
  transitionEssay: string
  occupations: string
  heroes: Array<{
    id: string
    title: string
    description: string
  }>
  mediaPreferences: string
  favoriteStory: string
  favoriteSaying: string
  createdAt: string
  updatedAt: string
}

interface CareerStoryOneDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  sessionId: number
}

const CareerStoryOneDetailsDialog: React.FC<
  CareerStoryOneDetailsDialogProps
> = ({ open, onOpenChange, clientId, sessionId }) => {
  const [careerStoryOneData, setCareerStoryOneData] =
    useState<CareerStoryOneData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && clientId) {
      fetchCareerStoryOneData()
    }
  }, [open, clientId])

  const fetchCareerStoryOneData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/session-details/${clientId}/career-story-1`
      )
      const data = await response.json()

      if (data.success) {
        setCareerStoryOneData(data.data)
      } else {
        setError(data.error || 'Failed to fetch career story one data')
      }
    } catch (err) {
      setError('Failed to fetch career story one data')
      console.error('Error fetching career story one data:', err)
    } finally {
      setLoading(false)
    }
  }

  const getCompletionStatus = () => {
    if (!careerStoryOneData) return 'Unknown'
    if (
      careerStoryOneData.transitionEssay &&
      careerStoryOneData.occupations &&
      careerStoryOneData.heroes &&
      careerStoryOneData.heroes.length > 0
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

  const parseOccupations = (occupationsString: string) => {
    try {
      // Try to parse as JSON first
      return JSON.parse(occupationsString)
    } catch {
      // If not JSON, split by common delimiters
      return occupationsString
        .split(/[,;|\n]/)
        .map(occ => occ.trim())
        .filter(occ => occ.length > 0)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-5xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-2xl font-bold'>
            <BookOpen className='h-6 w-6' />
            Career Story One Details
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin' />
            <span className='ml-2'>Loading career story one data...</span>
          </div>
        )}

        {error && (
          <div className='py-8 text-center'>
            <div className='mb-4 text-red-500'>{error}</div>
            <p className='text-muted-foreground'>
              No career story one data available for this client.
            </p>
          </div>
        )}

        {careerStoryOneData && !loading && (
          <div className='space-y-6'>
            {/* Transition Essay */}
            {careerStoryOneData.transitionEssay && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <FileText className='h-5 w-5' />
                    Transition Essay
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='rounded-lg border bg-muted/40 p-4'>
                    <p className='whitespace-pre-wrap text-sm leading-relaxed text-foreground'>
                      {careerStoryOneData.transitionEssay}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Occupations */}
            {careerStoryOneData.occupations && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Briefcase className='h-5 w-5' />
                    Occupations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {(() => {
                      const occupations = parseOccupations(
                        careerStoryOneData.occupations
                      )
                      if (Array.isArray(occupations)) {
                        return occupations.map((occupation, index) => (
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
                        ))
                      } else {
                        return (
                          <div className='rounded-lg border bg-muted/40 p-4'>
                            <p className='whitespace-pre-wrap text-sm leading-relaxed text-foreground'>
                              {careerStoryOneData.occupations}
                            </p>
                          </div>
                        )
                      }
                    })()}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Heroes */}
            {careerStoryOneData.heroes &&
              careerStoryOneData.heroes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Heart className='h-5 w-5' />
                      Heroes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      {careerStoryOneData.heroes.map((hero, index) => (
                        <div
                          key={hero.id || index}
                          className='rounded-lg border bg-muted/40 p-4'
                        >
                          <div className='space-y-3'>
                            <div>
                              <h4 className='font-medium text-foreground'>
                                {hero.title}
                              </h4>
                              <p className='text-sm text-muted-foreground'>
                                Hero
                              </p>
                            </div>
                            <div>
                              <p className='text-sm leading-relaxed text-muted-foreground'>
                                {hero.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Media Preferences */}
            {careerStoryOneData.mediaPreferences && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <BookOpen className='h-5 w-5' />
                    Media Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='rounded-lg border bg-muted/40 p-4'>
                    <p className='whitespace-pre-wrap text-sm leading-relaxed text-foreground'>
                      {careerStoryOneData.mediaPreferences}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Favorite Story */}
            {careerStoryOneData.favoriteStory && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <BookOpen className='h-5 w-5' />
                    Favorite Story
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='rounded-lg border bg-muted/40 p-4'>
                    <p className='whitespace-pre-wrap text-sm leading-relaxed text-foreground'>
                      {careerStoryOneData.favoriteStory}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Favorite Saying */}
            {careerStoryOneData.favoriteSaying && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Quote className='h-5 w-5' />
                    Favorite Saying
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='rounded-lg border bg-muted/40 p-4'>
                    <blockquote className='text-sm italic leading-relaxed text-foreground'>
                      "{careerStoryOneData.favoriteSaying}"
                    </blockquote>
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

export default CareerStoryOneDetailsDialog
