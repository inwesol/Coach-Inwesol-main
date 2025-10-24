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
  Target
} from 'lucide-react'

interface PreCoachingStrengthDifficultyData {
  id: string
  userId: string
  sessionId: number
  answers: any
  score: string
  subscaleScores: Record<string, number>
  createdAt: string
  updatedAt: string
}

interface PreCoachingStrengthDifficultyDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  sessionId: number
}

const PreCoachingStrengthDifficultyDetailsDialog: React.FC<
  PreCoachingStrengthDifficultyDetailsDialogProps
> = ({ open, onOpenChange, clientId, sessionId }) => {
  const [
    preCoachingStrengthDifficultyData,
    setPreCoachingStrengthDifficultyData
  ] = useState<PreCoachingStrengthDifficultyData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && clientId) {
      fetchPreCoachingStrengthDifficultyData()
    }
  }, [open, clientId])

  const fetchPreCoachingStrengthDifficultyData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/session-details/${clientId}/pre-coaching-strength-difficulty`
      )
      const data = await response.json()

      if (data.success) {
        setPreCoachingStrengthDifficultyData(data.data)
      } else {
        setError(
          data.error || 'Failed to fetch pre-coaching strength difficulty data'
        )
      }
    } catch (err) {
      setError('Failed to fetch pre-coaching strength difficulty data')
      console.error(
        'Error fetching pre-coaching strength difficulty data:',
        err
      )
    } finally {
      setLoading(false)
    }
  }

  const questions = [
    {
      id: 1,
      text: 'I try to be nice to other people. I care about their feelings',
      category: 'prosocial'
    },
    {
      id: 2,
      text: 'I am restless, I cannot stay still for long',
      category: 'hyperactivity'
    },
    {
      id: 3,
      text: 'I get a lot of headaches, stomach-aches or sickness',
      category: 'emotional'
    },
    {
      id: 4,
      text: "I usually share with others, for example CD's, games, food",
      category: 'prosocial'
    },
    {
      id: 5,
      text: 'I get very angry and often lose my temper',
      category: 'conduct'
    },
    {
      id: 6,
      text: 'I would rather be alone than with people of my age',
      category: 'peer'
    },
    { id: 7, text: 'I usually do as I am told', category: 'conduct' },
    {
      id: 8,
      text: 'I worry a lot',
      category: 'emotional'
    },
    {
      id: 9,
      text: 'I am helpful if someone is hurt, upset or feeling ill',
      category: 'prosocial'
    },
    {
      id: 10,
      text: 'I am constantly fidgeting or squirming',
      category: 'hyperactivity'
    },
    {
      id: 11,
      text: 'I have one good friend or more',
      category: 'peer'
    },
    {
      id: 12,
      text: 'I fight a lot. I can make other people do what I want',
      category: 'conduct'
    },
    {
      id: 13,
      text: 'I am often unhappy, depressed or tearful',
      category: 'emotional'
    },
    { id: 14, text: 'Other people my age generally like me', category: 'peer' },
    {
      id: 15,
      text: 'I am easily distracted, I find it difficult to concentrate',
      category: 'hyperactivity'
    },
    {
      id: 16,
      text: 'I am nervous in new situations. I easily lose confidence',
      category: 'emotional'
    },
    { id: 17, text: 'I am kind to younger children', category: 'prosocial' },
    {
      id: 18,
      text: 'I am often accused of lying or cheating',
      category: 'conduct'
    },
    {
      id: 19,
      text: 'Other children or young people pick on me or bully me',
      category: 'peer'
    },
    {
      id: 20,
      text: 'I often offer to help others (parents, teachers, children)',
      category: 'prosocial'
    },
    {
      id: 21,
      text: 'I think before I do things',
      category: 'hyperactivity'
    },
    {
      id: 22,
      text: 'I take things that are not mine from home, school or elsewhere',
      category: 'conduct'
    },
    {
      id: 23,
      text: 'I get along better with adults than with people my own age',
      category: 'peer'
    },
    {
      id: 24,
      text: 'I have many fears, I am easily scared',
      category: 'emotional'
    },
    {
      id: 25,
      text: "I finish the work I'm doing. My attention is good",
      category: 'hyperactivity'
    }
  ]

  const impactQuestions = [
    {
      id: 26,
      text: 'Overall, do you think that you have difficulties in any of the following areas: emotions, concentration, behavior or being able to get on with other people?'
    },
    {
      id: '26a',
      text: 'How long have these difficulties been present?'
    },
    {
      id: '26b',
      text: 'Do the difficulties upset or distress you?'
    },
    {
      id: '26c',
      text: 'Do the difficulties interfere with your everyday life in the HOME LIFE?'
    },
    {
      id: '26d',
      text: 'Do the difficulties interfere with your everyday life in the FRIENDSHIPS?'
    },
    {
      id: '26e',
      text: 'Do the difficulties interfere with your everyday life in the CLASSROOM LEARNING?'
    },
    {
      id: '26f',
      text: 'Do the difficulties interfere with your everyday life in the LEISURE ACTIVITIES?'
    },
    {
      id: '26g',
      text: 'Do the difficulties make it harder for those around you (family, friends, teachers, etc.)?'
    }
  ]

  const getQuestionNumber = (index: number) => `Q${index + 1}`

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'prosocial':
        return 'bg-green-100 text-green-800'
      case 'hyperactivity':
        return 'bg-yellow-100 text-yellow-800'
      case 'emotional':
        return 'bg-red-100 text-red-800'
      case 'conduct':
        return 'bg-orange-100 text-orange-800'
      case 'peer':
        return 'bg-blue-100 text-blue-800'
      case 'impact':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCompletionStatus = () => {
    if (!preCoachingStrengthDifficultyData) return 'Unknown'
    const answers = preCoachingStrengthDifficultyData.answers
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
            <Target className='h-6 w-6' />
            Pre-Coaching Strength & Difficulty Assessment Details
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin' />
            <span className='ml-2'>
              Loading pre-coaching strength difficulty data...
            </span>
          </div>
        )}

        {error && (
          <div className='py-8 text-center'>
            <div className='mb-4 text-red-500'>{error}</div>
            <p className='text-muted-foreground'>
              No pre-coaching strength difficulty data available for this
              client.
            </p>
          </div>
        )}

        {preCoachingStrengthDifficultyData && !loading && (
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
                    <p className='text-lg'>
                      {preCoachingStrengthDifficultyData.sessionId}
                    </p>
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
                        className={`text-2xl font-bold ${getScoreLevel(parseFloat(preCoachingStrengthDifficultyData.score)).color}`}
                      >
                        {preCoachingStrengthDifficultyData.score}
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
            {preCoachingStrengthDifficultyData.subscaleScores &&
              Object.keys(preCoachingStrengthDifficultyData.subscaleScores)
                .length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Brain className='h-5 w-5' />
                      Subscale Scores
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      {Object.entries(
                        preCoachingStrengthDifficultyData.subscaleScores
                      ).map(([key, value]) => (
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
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Main Questions */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <CheckCircle className='h-5 w-5' />
                  Main Assessment Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const answers = preCoachingStrengthDifficultyData.answers
                  if (!answers) {
                    return (
                      <div className='py-4 text-center'>
                        <p className='text-muted-foreground'>
                          No pre-coaching strength difficulty responses
                          available or data is not in expected format.
                        </p>
                      </div>
                    )
                  }

                  return (
                    <div className='space-y-4'>
                      <div className='space-y-3'>
                        {questions.map((question, index) => {
                          // Try different possible key formats
                          const possibleKeys = [
                            question.id.toString(),
                            `q${question.id}`,
                            `Q${question.id}`,
                            `question_${question.id}`,
                            question.text,
                            ...Object.keys(answers).filter(key =>
                              key
                                .toLowerCase()
                                .includes(
                                  question.text.toLowerCase().substring(0, 20)
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
                                <div className='flex flex-col gap-1'>
                                  <span className='flex-shrink-0 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800'>
                                    {getQuestionNumber(index)}
                                  </span>
                                  {/* <span
                                    className={`rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(question.category)}`}
                                  >
                                    {question.category}
                                  </span> */}
                                </div>
                                <div className='flex-1'>
                                  <h4 className='text-sm font-medium leading-relaxed text-gray-900'>
                                    {question.text}
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

            {/* Impact Questions */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Target className='h-5 w-5' />
                  Impact Assessment Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const answers = preCoachingStrengthDifficultyData.answers
                  if (!answers) {
                    return (
                      <div className='py-4 text-center'>
                        <p className='text-muted-foreground'>
                          No impact assessment responses available.
                        </p>
                      </div>
                    )
                  }

                  return (
                    <div className='space-y-4'>
                      <div className='space-y-3'>
                        {impactQuestions.map((question, index) => {
                          // Try different possible key formats
                          const possibleKeys = [
                            question.id.toString(),
                            `q${question.id}`,
                            `Q${question.id}`,
                            `question_${question.id}`,
                            question.text,
                            ...Object.keys(answers).filter(key =>
                              key
                                .toLowerCase()
                                .includes(
                                  question.text.toLowerCase().substring(0, 20)
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
                                <div className='flex flex-col gap-1'>
                                  <span className='flex-shrink-0 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800'>
                                    Q{question.id}
                                  </span>
                                </div>
                                <div className='flex-1'>
                                  <h4 className='text-sm font-medium leading-relaxed text-gray-900'>
                                    {question.text}
                                  </h4>
                                  {/* {question.responseValues && (
                                    <div className='mt-2 text-xs text-muted-foreground'>
                                      <strong>Options:</strong>{' '}
                                      {question.responseValues.join(', ')}
                                    </div>
                                  )} */}
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

export default PreCoachingStrengthDifficultyDetailsDialog
