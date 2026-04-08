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
  Brain,
  Target,
  Heart,
  Lightbulb
} from 'lucide-react'

interface CareerStoryTwoData {
  id: string
  userId: string
  sessionId: number
  firstAdjectives: string
  repeatedWords: string
  commonTraits: string
  significantWords: string
  selfStatement: string
  mediaActivities: string
  selectedRiasec: string[]
  settingStatement: string
  createdAt: string
  updatedAt: string
}

interface CareerStoryTwoDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  sessionId: number
}

const CareerStoryTwoDetailsDialog: React.FC<
  CareerStoryTwoDetailsDialogProps
> = ({ open, onOpenChange, clientId, sessionId }) => {
  const [careerStoryTwoData, setCareerStoryTwoData] =
    useState<CareerStoryTwoData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && clientId) {
      fetchCareerStoryTwoData()
    }
  }, [open, clientId])

  const fetchCareerStoryTwoData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/session-details/${clientId}/career-story-2`
      )
      const data = await response.json()

      if (data.success) {
        setCareerStoryTwoData(data.data)
      } else {
        setError(data.error || 'Failed to fetch career story two data')
      }
    } catch (err) {
      setError('Failed to fetch career story two data')
      console.error('Error fetching career story two data:', err)
    } finally {
      setLoading(false)
    }
  }

  const getCompletionStatus = () => {
    if (!careerStoryTwoData) return 'Unknown'
    if (
      careerStoryTwoData.firstAdjectives &&
      careerStoryTwoData.repeatedWords &&
      careerStoryTwoData.commonTraits &&
      careerStoryTwoData.significantWords &&
      careerStoryTwoData.selfStatement &&
      careerStoryTwoData.settingStatement
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

  const parseTextList = (textString: string) => {
    try {
      // Try to parse as JSON first
      return JSON.parse(textString)
    } catch {
      // If not JSON, split by common delimiters
      return textString
        .split(/[,;|\n]/)
        .map(item => item.trim())
        .filter(item => item.length > 0)
    }
  }

  const riasecCategories = [
    { code: 'R', name: 'Realistic', color: 'bg-blue-100 text-blue-800' },
    { code: 'I', name: 'Investigative', color: 'bg-green-100 text-green-800' },
    { code: 'A', name: 'Artistic', color: 'bg-purple-100 text-purple-800' },
    { code: 'S', name: 'Social', color: 'bg-pink-100 text-pink-800' },
    { code: 'E', name: 'Enterprising', color: 'bg-orange-100 text-orange-800' },
    { code: 'C', name: 'Conventional', color: 'bg-yellow-100 text-yellow-800' }
  ]

  const getRiasecCategoryInfo = (code: string) => {
    return (
      riasecCategories.find(cat => cat.code === code) || {
        code,
        name: 'Unknown',
        color: 'bg-muted text-foreground'
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-5xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-2xl font-bold'>
            <BookOpen className='h-6 w-6' />
            Career Story Two Details
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin' />
            <span className='ml-2'>Loading career story two data...</span>
          </div>
        )}

        {error && (
          <div className='py-8 text-center'>
            <div className='mb-4 text-red-500'>{error}</div>
            <p className='text-muted-foreground'>
              No career story two data available for this client.
            </p>
          </div>
        )}

        {careerStoryTwoData && !loading && (
          <div className='space-y-6'>
            {/* First Adjectives */}
            {careerStoryTwoData.firstAdjectives && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <User className='h-5 w-5' />
                    First Adjectives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {(() => {
                      const adjectives = parseTextList(
                        careerStoryTwoData.firstAdjectives
                      )
                      if (Array.isArray(adjectives)) {
                        return adjectives.map((adjective, index) => (
                          <div
                            key={index}
                            className='flex items-center gap-2 rounded-lg border bg-muted/40 p-3'
                          >
                            <span className='flex-shrink-0 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800'>
                              {index + 1}
                            </span>
                            <span className='text-sm text-foreground'>
                              {adjective}
                            </span>
                          </div>
                        ))
                      } else {
                        return (
                          <div className='rounded-lg border bg-muted/40 p-4'>
                            <p className='whitespace-pre-wrap text-sm leading-relaxed text-foreground'>
                              {careerStoryTwoData.firstAdjectives}
                            </p>
                          </div>
                        )
                      }
                    })()}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Repeated Words */}
            {careerStoryTwoData.repeatedWords && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Target className='h-5 w-5' />
                    Repeated Words
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {(() => {
                      const words = parseTextList(
                        careerStoryTwoData.repeatedWords
                      )
                      if (Array.isArray(words)) {
                        return words.map((word, index) => (
                          <div
                            key={index}
                            className='flex items-center gap-2 rounded-lg border bg-muted/40 p-3'
                          >
                            <span className='flex-shrink-0 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800'>
                              {index + 1}
                            </span>
                            <span className='text-sm text-foreground'>
                              {word}
                            </span>
                          </div>
                        ))
                      } else {
                        return (
                          <div className='rounded-lg border bg-muted/40 p-4'>
                            <p className='whitespace-pre-wrap text-sm leading-relaxed text-foreground'>
                              {careerStoryTwoData.repeatedWords}
                            </p>
                          </div>
                        )
                      }
                    })()}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Common Traits */}
            {careerStoryTwoData.commonTraits && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Heart className='h-5 w-5' />
                    Common Traits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {(() => {
                      const traits = parseTextList(
                        careerStoryTwoData.commonTraits
                      )
                      if (Array.isArray(traits)) {
                        return traits.map((trait, index) => (
                          <div
                            key={index}
                            className='flex items-center gap-2 rounded-lg border bg-muted/40 p-3'
                          >
                            <span className='flex-shrink-0 rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800'>
                              {index + 1}
                            </span>
                            <span className='text-sm text-foreground'>
                              {trait}
                            </span>
                          </div>
                        ))
                      } else {
                        return (
                          <div className='rounded-lg border bg-muted/40 p-4'>
                            <p className='whitespace-pre-wrap text-sm leading-relaxed text-foreground'>
                              {careerStoryTwoData.commonTraits}
                            </p>
                          </div>
                        )
                      }
                    })()}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Significant Words */}
            {careerStoryTwoData.significantWords && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Lightbulb className='h-5 w-5' />
                    Significant Words
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {(() => {
                      const words = parseTextList(
                        careerStoryTwoData.significantWords
                      )
                      if (Array.isArray(words)) {
                        return words.map((word, index) => (
                          <div
                            key={index}
                            className='flex items-center gap-2 rounded-lg border bg-muted/40 p-3'
                          >
                            <span className='flex-shrink-0 rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800'>
                              {index + 1}
                            </span>
                            <span className='text-sm text-foreground'>
                              {word}
                            </span>
                          </div>
                        ))
                      } else {
                        return (
                          <div className='rounded-lg border bg-muted/40 p-4'>
                            <p className='whitespace-pre-wrap text-sm leading-relaxed text-foreground'>
                              {careerStoryTwoData.significantWords}
                            </p>
                          </div>
                        )
                      }
                    })()}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Self Statement */}
            {careerStoryTwoData.selfStatement && (
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
                      {careerStoryTwoData.selfStatement}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Media Activities */}
            {careerStoryTwoData.mediaActivities && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Brain className='h-5 w-5' />
                    Media Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='rounded-lg border bg-muted/40 p-4'>
                    <p className='whitespace-pre-wrap text-sm leading-relaxed text-foreground'>
                      {careerStoryTwoData.mediaActivities}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Selected RIASEC */}
            {careerStoryTwoData.selectedRiasec &&
              careerStoryTwoData.selectedRiasec.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Target className='h-5 w-5' />
                      Selected RIASEC Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                      {careerStoryTwoData.selectedRiasec.map((code, index) => {
                        const categoryInfo = getRiasecCategoryInfo(code)
                        return (
                          <div
                            key={index}
                            className='flex items-center gap-3 rounded-lg border bg-muted/40 p-3'
                          >
                            <div
                              className={`rounded-full px-3 py-1 text-xs font-medium ${categoryInfo.color}`}
                            >
                              {code}
                            </div>
                            <div>
                              <div className='font-medium text-foreground'>
                                {categoryInfo.name}
                              </div>
                              <div className='text-xs text-muted-foreground'>
                                RIASEC Category
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Setting Statement */}
            {careerStoryTwoData.settingStatement && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <FileText className='h-5 w-5' />
                    Setting Statement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='rounded-lg border bg-muted/40 p-4'>
                    <p className='whitespace-pre-wrap text-sm leading-relaxed text-foreground'>
                      {careerStoryTwoData.settingStatement}
                    </p>
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

export default CareerStoryTwoDetailsDialog
