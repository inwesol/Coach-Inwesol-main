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

interface PostCareerMaturityData {
  id: string
  user_id: string
  session_id: number
  answers: any
  created_at: string
  updated_at: string
}

interface PostCareerMaturityDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  sessionId: number
}

const PostCareerMaturityDetailsDialog: React.FC<
  PostCareerMaturityDetailsDialogProps
> = ({ open, onOpenChange, clientId, sessionId }) => {
  const [postCareerMaturityData, setPostCareerMaturityData] =
    useState<PostCareerMaturityData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && clientId) {
      fetchPostCareerMaturityData()
    }
  }, [open, clientId])

  const fetchPostCareerMaturityData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/session-details/${clientId}/post-career-maturity`
      )
      const data = await response.json()

      if (data.success) {
        setPostCareerMaturityData(data.data)
      } else {
        setError(data.error || 'Failed to fetch post-career maturity data')
      }
    } catch (err) {
      setError('Failed to fetch post-career maturity data')
      console.error('Error fetching post-career maturity data:', err)
    } finally {
      setLoading(false)
    }
  }

  const questions = [
    {
      id: 'q1',
      statement:
        'There is no point in deciding on a job when the future is so uncertain.'
    },
    {
      id: 'q2',
      statement: 'I know very little about the requirements of jobs.'
    },
    {
      id: 'q3',
      statement:
        'I have so many interests that it is hard to choose just one occupation.'
    },
    {
      id: 'q4',
      statement: 'Choosing a job is something that you do on your own.'
    },
    {
      id: 'q5',
      statement:
        "I can't seem to become very concerned about my future occupation."
    },
    {
      id: 'q6',
      statement:
        "I don't know how to go about getting into the kind of work I want to do."
    },
    {
      id: 'q7',
      statement:
        "Everyone seems to tell me something different; as a result I don't know what kind of work to choose."
    },
    {
      id: 'q8',
      statement:
        'If you have doubts about what you want to do, ask your parents or friends for advice.'
    },
    {
      id: 'q9',
      statement: 'I seldom think about the job that I want to enter.'
    },
    {
      id: 'q10',
      statement:
        'I am having difficulty in preparing myself for the work that I want to do.'
    },
    {
      id: 'q11',
      statement: 'I keep changing my occupational choice.'
    },
    {
      id: 'q12',
      statement:
        'When it comes to choosing a career, I will ask other people to help me.'
    },
    {
      id: 'q13',
      statement:
        "I'm not going to worry about choosing an occupation until I am out of school."
    },
    {
      id: 'q14',
      statement: "I don't know what courses I should take in school."
    },
    {
      id: 'q15',
      statement:
        'I often daydream about what I want to be, but I really have not chosen an occupation yet.'
    },
    {
      id: 'q16',
      statement:
        'I will choose my career without paying attention to the feelings of other people.'
    },
    {
      id: 'q17',
      statement:
        'As far as choosing an occupation is concerned, something will come along sooner or later.'
    },
    {
      id: 'q18',
      statement: "I don't know whether my occupational plans are realistic."
    },
    {
      id: 'q19',
      statement:
        'There are so many things to consider in choosing an occupation, it is hard to make a decision.'
    },
    {
      id: 'q20',
      statement:
        'It is important to consult close friends and get their ideas before making an occupational choice.'
    },
    {
      id: 'q21',
      statement: "I really can't find any work that has much appeal to me."
    },
    {
      id: 'q22',
      statement:
        'I keep wondering how I can reconcile the kind of person I am with the kind of person I want to be in my occupation.'
    },
    {
      id: 'q23',
      statement:
        "I can't understand how some people can be so certain about what they want to do."
    },
    {
      id: 'q24',
      statement:
        'In making career choices, one should pay attention to the thoughts and feelings of family members.'
    }
  ]

  const getQuestionNumber = (index: number) => `Q${index + 1}`

  const getCompletionStatus = () => {
    if (!postCareerMaturityData) return 'Unknown'
    const answers = postCareerMaturityData.answers
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
        return <Badge className='bg-gray-100 text-gray-800'>{status}</Badge>
    }
  }

  const getResponseText = (answer: any) => {
    if (answer === undefined || answer === null) return 'No response'

    // Handle different response formats
    if (typeof answer === 'boolean') {
      return answer ? 'True' : 'False'
    }
    if (typeof answer === 'string') {
      return answer
    }
    if (typeof answer === 'number') {
      return `${answer}/5`
    }

    return String(answer)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-5xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-2xl font-bold'>
            <FileText className='h-6 w-6' />
            Post-Career Maturity Assessment Details
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin' />
            <span className='ml-2'>Loading post-career maturity data...</span>
          </div>
        )}

        {error && (
          <div className='py-8 text-center'>
            <div className='mb-4 text-red-500'>{error}</div>
            <p className='text-muted-foreground'>
              No post-career maturity data available for this client.
            </p>
          </div>
        )}

        {postCareerMaturityData && !loading && (
          <div className='space-y-6'>
            {/* Assessment Answers */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <CheckCircle className='h-5 w-5' />
                  Post-Career Maturity Assessment Responses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const answers = postCareerMaturityData.answers
                  if (!answers) {
                    return (
                      <div className='py-4 text-center'>
                        <p className='text-muted-foreground'>
                          No post-career maturity responses available or data is
                          not in expected format.
                        </p>
                      </div>
                    )
                  }

                  return (
                    <div className='space-y-4'>
                      {/* Display questions and answers in order */}
                      <div className='space-y-3'>
                        {questions.map((question, index) => {
                          const answer = answers[question.id]

                          return (
                            <div
                              key={index}
                              className='flex items-start justify-between rounded-lg border bg-gray-50 p-3'
                            >
                              <div className='flex flex-1 items-start gap-3'>
                                <span className='flex-shrink-0 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800'>
                                  {getQuestionNumber(index)}
                                </span>
                                <div className='flex-1'>
                                  <h4 className='text-sm font-medium leading-relaxed text-gray-900'>
                                    {question.statement}
                                  </h4>
                                </div>
                              </div>
                              <div className='ml-4 flex-shrink-0'>
                                <div className='text-right'>
                                  <div className='text-lg font-semibold text-blue-600'>
                                    {getResponseText(answer)}
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

export default PostCareerMaturityDetailsDialog
