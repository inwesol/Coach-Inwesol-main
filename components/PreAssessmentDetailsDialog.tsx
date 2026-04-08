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
import { Loader2, FileText, Calendar, CheckCircle, Clock } from 'lucide-react'

interface PreAssessmentData {
  id: string
  user_id: string
  session_id: number
  answers: string
  created_at: string
  updated_at: string
}

interface PreAssessmentDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  sessionId: number
}

const PreAssessmentDetailsDialog: React.FC<PreAssessmentDetailsDialogProps> = ({
  open,
  onOpenChange,
  clientId,
  sessionId
}) => {
  const [preAssessmentData, setPreAssessmentData] =
    useState<PreAssessmentData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && clientId) {
      fetchPreAssessmentData()
    }
  }, [open, clientId])

  const fetchPreAssessmentData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/session-details/${clientId}/pre-assessment`
      )
      const data = await response.json()

      if (data.success) {
        setPreAssessmentData(data.data)
      } else {
        setError(data.error || 'Failed to fetch pre-assessment data')
      }
    } catch (err) {
      setError('Failed to fetch pre-assessment data')
      console.error('Error fetching pre-assessment data:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const parseAnswers = (answersString: string) => {
    try {
      return JSON.parse(answersString)
    } catch {
      return null
    }
  }

  const questions = [
    'How clear are your current career goals?',
    'How confident are you that you will achieve your career goals?',
    'How confident are you in your ability to overcome obstacles in your career?',
    'How would you rate your current level of stress related to work or personal life?',
    'How well do you understand your own thought patterns and behaviors?',
    'How satisfied are you with your current work-life balance?',
    'How satisfied are you with your current job and overall well-being?',
    'How ready are you to make changes in your professional or personal life?'
  ]

  const getQuestionNumber = (index: number) => `Q${index + 1}`

  const getDisplayScore = (index: number, answer: unknown) => {
    const numericAnswer =
      typeof answer === 'number'
        ? answer
        : typeof answer === 'string'
          ? Number(answer)
          : NaN

    if (Number.isNaN(numericAnswer)) return answer

    // Q4 is reverse-scored on a 1-10 scale.
    if (index === 3) {
      return 10 - numericAnswer
    }

    return numericAnswer
  }

  const getCompletionStatus = () => {
    if (!preAssessmentData) return 'Unknown'
    const answers = parseAnswers(preAssessmentData.answers)
    if (answers && Object.keys(answers).length > 0) {
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
      <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-2xl font-bold'>
            <FileText className='h-6 w-6' />
            Pre-Assessment Details
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin' />
            <span className='ml-2'>Loading pre-assessment data...</span>
          </div>
        )}

        {error && (
          <div className='py-8 text-center'>
            <div className='mb-4 text-red-500'>{error}</div>
            <p className='text-muted-foreground'>
              No pre-assessment data available for this client.
            </p>
          </div>
        )}

        {preAssessmentData && !loading && (
          <div className='space-y-6'>
            {/* Assessment Answers */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <CheckCircle className='h-5 w-5' />
                  Assessment Responses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const answers = parseAnswers(preAssessmentData.answers)
                  if (!answers) {
                    return (
                      <div className='py-4 text-center'>
                        <p className='text-muted-foreground'>
                          No assessment responses available or data is not in
                          expected format.
                        </p>
                      </div>
                    )
                  }

                  return (
                    <div className='space-y-4'>
                      {/* Display questions and answers in order */}
                      <div className='space-y-3'>
                        {questions.map((question, index) => {
                          const questionKey = `q${index + 1}`
                          const answer = answers[questionKey]
                          const displayScore = getDisplayScore(index, answer)

                          return (
                            <div
                              key={index}
                              className='flex items-center justify-between rounded-lg border bg-muted/40 p-3'
                            >
                              <div className='flex flex-1 items-start gap-3'>
                                <span className='flex-shrink-0 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800'>
                                  {getQuestionNumber(index)}
                                </span>
                                <h4 className='text-sm font-medium leading-relaxed text-foreground'>
                                  {question}
                                </h4>
                              </div>
                              <div className='ml-4 flex-shrink-0'>
                                <div className='text-right'>
                                  <div className='text-lg font-semibold text-blue-600'>
                                    {answer !== undefined && answer !== null
                                      ? `${displayScore}/10`
                                      : 'No response'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default PreAssessmentDetailsDialog
