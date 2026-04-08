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
import { Loader2, FileText, CheckCircle, Clock } from 'lucide-react'

interface PostCoachingData {
  id: string
  user_id: string
  session_id: number
  answers: any
  created_at: string
  updated_at: string
}

interface PostCoachingDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  sessionId: number
}

const PostCoachingDetailsDialog: React.FC<PostCoachingDetailsDialogProps> = ({
  open,
  onOpenChange,
  clientId,
  sessionId
}) => {
  const [postCoachingData, setPostCoachingData] =
    useState<PostCoachingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && clientId) {
      fetchPostCoachingData()
    }
  }, [open, clientId])

  const fetchPostCoachingData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/session-details/${clientId}/post-coaching`
      )
      const data = await response.json()

      if (data.success) {
        setPostCoachingData(data.data)
      } else {
        setError(data.error || 'Failed to fetch post-coaching data')
      }
    } catch (err) {
      setError('Failed to fetch post-coaching data')
      console.error('Error fetching post-coaching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const questions = [
    'How clear are your career goals after coaching?',
    'How confident are you that you will achieve your career goals after coaching?',
    'How confident are you in your ability to overcome obstacles in your career after coaching?',
    'How would you rate your level of stress related to work or personal life after coaching?',
    'How well do you understand your own thought patterns and behaviors after coaching?',
    'How satisfied are you with your work-life balance after coaching?',
    'How satisfied are you with your job and overall well-being after coaching?',
    'How ready are you to make changes in your professional or personal life after coaching?',
    'How would you rate your overall experience with the coaching process?',
    'How effective was the relationship between you and your coach?',
    'Did you feel supported and understood by your coach?',
    'How much do you currently feel that you are using your strengths in your career?',
    'How much more do you feel that you are using your strengths in your career after coaching?'
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
    if (!postCoachingData) return 'Unknown'
    const answers = postCoachingData.answers
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
            Post-Coaching Assessment Details
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin' />
            <span className='ml-2'>Loading post-coaching data...</span>
          </div>
        )}

        {error && (
          <div className='py-8 text-center'>
            <div className='mb-4 text-red-500'>{error}</div>
            <p className='text-muted-foreground'>
              No post-coaching data available for this client.
            </p>
          </div>
        )}

        {postCoachingData && !loading && (
          <div className='space-y-6'>
            {/* Assessment Answers */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <CheckCircle className='h-5 w-5' />
                  Post-Coaching Assessment Responses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const answers = postCoachingData.answers
                  if (!answers) {
                    return (
                      <div className='py-4 text-center'>
                        <p className='text-muted-foreground'>
                          No post-coaching responses available or data is not in
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

export default PostCoachingDetailsDialog
