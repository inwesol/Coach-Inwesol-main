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
  TrendingUp
} from 'lucide-react'

interface PersonalityTestData {
  id: string
  user_id: string
  session_id: number
  answers: string
  score: string
  subscale_scores: Record<string, number>
  created_at: string
  updated_at: string
}

interface PersonalityTestDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  sessionId: number
}

const PersonalityTestDetailsDialog: React.FC<
  PersonalityTestDetailsDialogProps
> = ({ open, onOpenChange, clientId, sessionId }) => {
  const [personalityTestData, setPersonalityTestData] =
    useState<PersonalityTestData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && clientId) {
      fetchPersonalityTestData()
    }
  }, [open, clientId])

  const fetchPersonalityTestData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/session-details/${clientId}/personality-test`
      )
      const data = await response.json()

      if (data.success) {
        setPersonalityTestData(data.data)
      } else {
        setError(data.error || 'Failed to fetch personality test data')
      }
    } catch (err) {
      setError('Failed to fetch personality test data')
      console.error('Error fetching personality test data:', err)
    } finally {
      setLoading(false)
    }
  }

  const parseAnswers = (answersString: string) => {
    try {
      return JSON.parse(answersString)
    } catch {
      return null
    }
  }

  const questions = [
    'is talkative',
    'tends to find fault with others',
    'does a thorough job',
    'is depressed, blue',
    'is original, comes up with new ideas',
    'is reserved',
    'is helpful and unselfish with others',
    'can be somewhat careless',
    'is relaxed, handles stress well',
    'is curious about many different things',
    'is full of energy',
    'starts quarrels with others',
    'is a reliable worker',
    'can be tense',
    'is ingenious, a deep thinker',
    'generates a lot of enthusiasm',
    'has a forgiving nature',
    'tends to be disorganized',
    'worries a lot',
    'has an active imagination',
    'tends to be quiet',
    'is generally trusting',
    'tends to be lazy',
    'is emotionally stable, not easily upset',
    'is inventive',
    'has an assertive personality',
    'can be cold and aloof',
    'perseveres until the task is finished',
    'can be moody',
    'values artistic, aesthetic experiences',
    'is sometimes shy, inhibited',
    'is considerate and kind to almost everyone',
    'does things efficiently',
    'remains calm in tense situations',
    'prefers work that is routine',
    'is outgoing, sociable',
    'is sometimes rude to others',
    'makes plans and follows through with them',
    'gets nervous easily',
    'likes to reflect, play with ideas',
    'has few artistic interests',
    'likes to cooperate with others',
    'is easily distracted',
    'is sophisticated in art, music, or literature'
  ]

  const getQuestionNumber = (index: number) => `Q${index + 1}`

  const getCompletionStatus = () => {
    if (!personalityTestData) return 'Unknown'
    const answers = parseAnswers(personalityTestData.answers)
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

  const getScoreLevel = (score: number) => {
    if (score >= 80)
      return { level: 'High', color: 'text-green-600', bgColor: 'bg-green-100' }
    if (score >= 60)
      return {
        level: 'Moderate',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
      }
    if (score >= 40)
      return {
        level: 'Low',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100'
      }
    return { level: 'Very Low', color: 'text-red-600', bgColor: 'bg-red-100' }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-5xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-2xl font-bold'>
            <Brain className='h-6 w-6' />
            Personality Test Assessment Details
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin' />
            <span className='ml-2'>Loading personality test data...</span>
          </div>
        )}

        {error && (
          <div className='py-8 text-center'>
            <div className='mb-4 text-red-500'>{error}</div>
            <p className='text-muted-foreground'>
              No personality test data available for this client.
            </p>
          </div>
        )}

        {personalityTestData && !loading && (
          <div className='space-y-6'>
            {/* Assessment Overview */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <TrendingUp className='h-5 w-5' />
                  Assessment Overview
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Session ID
                    </label>
                    <p className='text-lg'>{personalityTestData.session_id}</p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Status
                    </label>
                    <div className='mt-1'>
                      {getCompletionBadge(getCompletionStatus())}
                    </div>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Overall Score
                    </label>
                    <div className='mt-1'>
                      <span
                        className={`text-2xl font-bold ${getScoreLevel(parseFloat(personalityTestData.score)).color}`}
                      >
                        {personalityTestData.score}
                      </span>
                      <span className='ml-2 text-sm text-muted-foreground'>
                        / 100
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscale Scores */}
            {personalityTestData.subscale_scores &&
              Object.keys(personalityTestData.subscale_scores).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Brain className='h-5 w-5' />
                      Subscale Scores
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      {Object.entries(personalityTestData.subscale_scores).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className='rounded-lg border bg-gray-50 p-4'
                          >
                            <div className='flex items-center justify-between'>
                              <div>
                                <h4 className='font-medium capitalize text-gray-900'>
                                  {key.replace(/_/g, ' ')}
                                </h4>
                                <p className='text-sm text-muted-foreground'>
                                  Subscale Score
                                </p>
                              </div>
                              <div className='text-right'>
                                <div
                                  className={`text-xl font-semibold ${getScoreLevel(value).color}`}
                                >
                                  {value}
                                </div>
                                <div className='text-xs text-muted-foreground'>
                                  / 100
                                </div>
                              </div>
                            </div>
                            <div className='mt-2'>
                              <div className='flex items-center gap-2'>
                                <div className='h-2 flex-1 rounded-full bg-gray-200'>
                                  <div
                                    className={`h-2 rounded-full transition-all duration-300 ${getScoreLevel(value).bgColor.replace('bg-', 'bg-').replace('-100', '-500')}`}
                                    style={{ width: `${value}%` }}
                                  ></div>
                                </div>
                                <span className='text-sm text-muted-foreground'>
                                  {Math.round(value)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Assessment Responses */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <CheckCircle className='h-5 w-5' />
                  Assessment Responses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const answers = parseAnswers(personalityTestData.answers)
                  if (!answers) {
                    return (
                      <div className='py-4 text-center'>
                        <p className='text-muted-foreground'>
                          No personality test responses available or data is not
                          in expected format.
                        </p>
                      </div>
                    )
                  }

                  return (
                    <div className='space-y-4'>
                      {/* Display questions and answers in order */}
                      <div className='space-y-3'>
                        {questions.map((question, index) => {
                          // Try different possible key formats
                          const possibleKeys = [
                            // `q${index + 1}`,
                            // `Q${index + 1}`,
                            // `question_${index + 1}`,
                            // `Question_${index + 1}`,
                            // `${index + 1}`,
                            // `item_${index + 1}`,
                            // `Item_${index + 1}`,
                            // Try the actual question text as key
                            question,
                            // Try partial matches
                            ...Object.keys(answers).filter(key =>
                              key
                                .toLowerCase()
                                .includes(
                                  question.toLowerCase().substring(0, 20)
                                )
                            )
                          ]

                          let answer = null
                          for (const key of possibleKeys) {
                            if (
                              answers[key] !== undefined &&
                              answers[key] !== null
                            ) {
                              answer = answers[key]
                              break
                            }
                          }

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
                                    I see myself as someone who {question}
                                  </h4>
                                </div>
                              </div>
                              <div className='ml-4 flex-shrink-0'>
                                <div className='text-right'>
                                  <div className='text-lg font-semibold text-blue-600'>
                                    {answer !== undefined && answer !== null
                                      ? String(answer)
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

export default PersonalityTestDetailsDialog
