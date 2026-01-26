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
  Brain,
  TrendingUp,
  Target,
  User,
  Briefcase,
  Lightbulb,
  Wrench,
  Palette,
  Heart
} from 'lucide-react'

interface RiasecTestData {
  id: string
  user_id: string
  session_id: number
  selected_answers: string
  category_counts: Record<string, number>
  interest_code: string
  created_at: string
  updated_at: string
}

interface RiasecTestDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  sessionId: number
}

const RiasecTestDetailsDialog: React.FC<RiasecTestDetailsDialogProps> = ({
  open,
  onOpenChange,
  clientId,
  sessionId
}) => {
  const [riasecTestData, setRiasecTestData] = useState<RiasecTestData | null>(
    null
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && clientId) {
      fetchRiasecTestData()
    }
  }, [open, clientId])

  const fetchRiasecTestData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/session-details/${clientId}/riasec-test`
      )
      const data = await response.json()

      if (data.success) {
        setRiasecTestData(data.data)
      } else {
        setError(data.error || 'Failed to fetch RIASEC test data')
      }
    } catch (err) {
      setError('Failed to fetch RIASEC test data')
      console.error('Error fetching RIASEC test data:', err)
    } finally {
      setLoading(false)
    }
  }

  const riasecCategories = [
    {
      code: 'R',
      name: 'Realistic',
      description: 'Practical, hands-on, mechanical',
      icon: Wrench,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      code: 'I',
      name: 'Investigative',
      description: 'Analytical, scientific, intellectual',
      icon: Brain,
      color: 'bg-green-100 text-green-800'
    },
    {
      code: 'A',
      name: 'Artistic',
      description: 'Creative, expressive, original',
      icon: Palette,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      code: 'S',
      name: 'Social',
      description: 'Helpful, caring, supportive',
      icon: Heart,
      color: 'bg-pink-100 text-pink-800'
    },
    {
      code: 'E',
      name: 'Enterprising',
      description: 'Leadership, persuasive, ambitious',
      icon: Briefcase,
      color: 'bg-orange-100 text-orange-800'
    },
    {
      code: 'C',
      name: 'Conventional',
      description: 'Organized, detail-oriented, systematic',
      icon: Target,
      color: 'bg-yellow-100 text-yellow-800'
    }
  ]

  const formatKeyName = (key: string) => {
    // Replace underscores with spaces
    let formatted = key.replace(/_/g, ' ')
    // Split on camelCase boundaries (before capital letters)
    formatted = formatted.replace(/([a-z])([A-Z])/g, '$1 $2')
    // Capitalize first letter of each word
    return formatted
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  const getCompletionStatus = () => {
    if (!riasecTestData) return 'Unknown'
    if (riasecTestData.selected_answers && riasecTestData.interest_code) {
      return 'Completed'
    }
    return 'In Progress'
  }

  const getCompletionBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return (
          <Badge className='bg-green-100 text-green-700 hover:green-800 hover:bg-green-200'>
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

  const getCategoryIcon = (code: string) => {
    const category = riasecCategories.find(cat => cat.code === code)
    return category ? category.icon : User
  }

  const getCategoryColor = (code: string) => {
    const category = riasecCategories.find(cat => cat.code === code)
    return category ? category.color : 'bg-gray-100 text-gray-800'
  }

  const getCategoryDescription = (code: string) => {
    const category = riasecCategories.find(cat => cat.code === code)
    return category ? category.description : 'Unknown category'
  }

  const parseSelectedAnswers = (selected_answers: string) => {
    try {
      return JSON.parse(selected_answers)
    } catch {
      return []
    }
  }

  const getSortedCategories = () => {
    if (!riasecTestData?.category_counts) return []

    return Object.entries(riasecTestData.category_counts)
      .sort(([, a], [, b]) => b - a)
      .map(([code, count]) => ({
        code,
        count,
        percentage: Math.round((count / 60) * 100) // Assuming 60 total questions
      }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-5xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-2xl font-bold'>
            <Brain className='h-6 w-6' />
            RIASEC Career Interest Test Details
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin' />
            <span className='ml-2'>Loading RIASEC test data...</span>
          </div>
        )}

        {error && (
          <div className='py-8 text-center'>
            <div className='mb-4 text-red-500'>{error}</div>
            <p className='text-muted-foreground'>
              No RIASEC test data available for this client.
            </p>
          </div>
        )}

        {riasecTestData && !loading && (
          <div className='space-y-6'>
            {/* Test Overview */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <TrendingUp className='h-5 w-5' />
                  Test Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-between gap-4'>
                  <div className='flex items-center gap-2'>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Session ID:
                    </label>
                    <p className='text-sm font-medium'>{riasecTestData.session_id}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Status:
                    </label>
                    <div>
                      {getCompletionBadge(getCompletionStatus())}
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Interest Code:
                    </label>
                    <span className='text-xl font-bold text-blue-600'>
                      {riasecTestData.interest_code}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Scores */}
            {riasecTestData.category_counts &&
              Object.keys(riasecTestData.category_counts).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Target className='h-5 w-5' />
                      Interest Category Scores
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      {Object.entries(riasecTestData.category_counts).map(
                        ([key, value]) => {
                          const category = riasecCategories.find(
                            cat => cat.code === key
                          )
                          const categoryName = category?.name || formatKeyName(key)
                          const categoryDescription = category?.description || ''

                          return (
                            <div
                              key={key}
                              className='rounded-lg border bg-gray-50 p-4'
                            >
                              <div className='flex items-center justify-between'>
                                <div className='flex-1'>
                                  <h4 className='font-medium text-gray-900'>
                                    {categoryName}
                                  </h4>
                                  <p className='mt-1 text-xs text-muted-foreground'>
                                    This is a dummy description for the subscale score. It provides additional context about the measurement.
                                  </p>
                                </div>
                                <div className='mx-4 h-12 w-px bg-gray-300'></div>
                                <div className='text-right'>
                                  <div className='text-xl font-semibold text-blue-600'>
                                    {value}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        }
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Selected Answers */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <FileText className='h-5 w-5' />
                  Selected Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const selectedAnswers = parseSelectedAnswers(
                    riasecTestData.selected_answers
                  )

                  if (!selectedAnswers || selectedAnswers.length === 0) {
                    return (
                      <div className='py-4 text-center'>
                        <p className='text-muted-foreground'>
                          No selected activities available.
                        </p>
                      </div>
                    )
                  }

                  return (
                    <div className='space-y-3'>
                      <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
                        {selectedAnswers.map(
                          (answer: string, index: number) => (
                            <div
                              key={index}
                              className='flex items-center gap-2 rounded-lg border bg-gray-50 p-3'
                            >
                              <span className='flex-shrink-0 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800'>
                                {index + 1}
                              </span>
                              <span className='text-sm text-gray-900'>
                                {answer}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>

            {/* Interest Code Interpretation */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Lightbulb className='h-5 w-5' />
                  Interest Code Interpretation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='rounded-lg bg-blue-50 p-4'>
                    <h4 className='mb-2 font-semibold text-blue-900'>
                      Primary Interest Code: {riasecTestData.interest_code}
                    </h4>
                    <p className='text-sm text-blue-800'>
                      This three-letter code represents your strongest career
                      interests. The letters are ordered from highest to lowest
                      interest level.
                    </p>
                  </div>

                  {/* <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
                    {riasecTestData.interestCode
                      .split('')
                      .map((letter, index) => {
                        const category = riasecCategories.find(
                          cat => cat.code === letter
                        )
                        const IconComponent = category?.icon || User
                        const colorClass =
                          category?.color || 'bg-gray-100 text-gray-800'

                        return (
                          <div
                            key={index}
                            className='flex items-center gap-3 rounded-lg border bg-gray-50 p-3'
                          >
                            <div className={`rounded-full p-2 ${colorClass}`}>
                              <IconComponent className='h-4 w-4' />
                            </div>
                            <div>
                              <div className='font-medium text-gray-900'>
                                {index + 1}. {letter} - {category?.name}
                              </div>
                              <div className='text-xs text-muted-foreground'>
                                {category?.description}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div> */}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default RiasecTestDetailsDialog
