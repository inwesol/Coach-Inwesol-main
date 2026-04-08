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

interface PostPsychologicalWellbeingData {
  id: string
  user_id: string
  session_id: number
  answers: string
  score: string
  subscale_scores: Record<string, number>
  created_at: string
  updated_at: string
}

interface PostPsychologicalWellbeingDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  sessionId: number
}

const subscaleMetadata: Record<string, { name: string; description: string }> = {
  autonomy: {
    name: 'Autonomy',
    description:
      'Self-determination and independence; ability to resist social pressure and regulate behavior from within.'
  },
  environmentalMastery: {
    name: 'Environmental Mastery',
    description:
      'Sense of competence in managing everyday life, activities, and surrounding circumstances.'
  },
  personalGrowth: {
    name: 'Personal Growth',
    description:
      'Openness to new experiences and sense of continued development and potential.'
  },
  positiveRelations: {
    name: 'Positive Relations',
    description:
      'Warm, trusting relationships with others; capacity for empathy, affection, and intimacy.'
  },
  purposeInLife: {
    name: 'Purpose in Life',
    description:
      'Having goals and a sense of direction; feeling that life has meaning.'
  },
  selfAcceptance: {
    name: 'Self-Acceptance',
    description:
      'Positive attitude toward oneself; acceptance of multiple aspects of self, including past life.'
  }
}

const PostPsychologicalWellbeingDetailsDialog: React.FC<
  PostPsychologicalWellbeingDetailsDialogProps
> = ({ open, onOpenChange, clientId, sessionId }) => {
  const [postPsychologicalWellbeingData, setPostPsychologicalWellbeingData] =
    useState<PostPsychologicalWellbeingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && clientId) {
      fetchPostPsychologicalWellbeingData()
    }
  }, [open, clientId])

  const fetchPostPsychologicalWellbeingData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/session-details/${clientId}/post-psychological-wellbeing`
      )
      const data = await response.json()

      if (data.success) {
        setPostPsychologicalWellbeingData(data.data)
      } else {
        setError(
          data.error || 'Failed to fetch post-psychological wellbeing data'
        )
      }
    } catch (err) {
      setError('Failed to fetch post-psychological wellbeing data')
      console.error('Error fetching post-psychological wellbeing data:', err)
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
    'I am not afraid to voice my opinions, even when they are in opposition to the opinions of most people',
    'For me, life has been a continuous process of learning, changing, and growth',
    'In general, I feel I am in charge of the situation in which I live',
    'People would describe me as a giving person, willing to share my time with others',
    'I am not interested in activities that will expand my horizons',
    'I enjoy making plans for the future and working to make them a reality',
    'Most people see me as loving and affectionate',
    'In many ways I feel disappointed about my achievements in life',
    'I live life one day at a time and do not really think about the future',
    'I tend to worry about what other people think of me',
    'When I look at the story of my life, I am pleased with how things have turned out',
    'I have difficulty arranging my life in a way that is satisfying to me',
    'My decisions are not usually influenced by what everyone else is doing',
    'I gave up trying to make big improvements or changes in my life a long time ago',
    'The demands of everyday life often get me down',
    'I have not experienced many warm and trusting relationships with others',
    'I think it is important to have new experiences that challenge how you think about yourself and the world',
    'Maintaining close relationships has been difficult and frustrating for me',
    'My attitude about myself is probably not as positive as most people feel about themselves',
    'I have a sense of direction and purpose in life',
    'I judge myself by what I think is important, not by the values of what others think is important',
    'In general, I feel confident and positive about myself',
    'I have been able to build a living environment and a lifestyle for myself that is much to my liking',
    'I tend to be influenced by people with strong opinions',
    'I do not enjoy being in new situations that require me to change my old familiar ways of doing things',
    'I do not fit very well with the people and the community around me',
    'I know that I can trust my friends, and they know they can trust me',
    'When I think about it, I have not really improved much as a person over the years',
    'Some people wander aimlessly through life, but I am not one of them',
    'I often feel lonely because I have few close friends with whom to share my concerns',
    'When I compare myself to friends and acquaintances, it makes me feel good about who I am',
    'I do not have a good sense of what it is I am trying to accomplish in life',
    'I sometimes feel as if I have done all there is to do in life',
    'I feel like many of the people I know have gotten more out of life than I have',
    'I have confidence in my opinions, even if they are contrary to the general consensus',
    'I am quite good at managing the many responsibilities of my daily life',
    'I have the sense that I have developed a lot as a person over time',
    'I enjoy personal and mutual conversations with family members and friends',
    'My daily activities often seem trivial and unimportant to me',
    'I like most parts of my personality',
    'It is difficult for me to voice my own opinions on controversial matters',
    'I often feel overwhelmed by my responsibilities'
  ]

  const getQuestionNumber = (index: number) => `Q${index + 1}`

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

  const normalizeSubscaleKey = (key: string) =>
    key.replace(/_/g, '').replace(/\s+/g, '').toLowerCase()

  const getSubscaleMetadata = (key: string) => {
    const normalizedInput = normalizeSubscaleKey(key)
    return Object.entries(subscaleMetadata).find(
      ([metadataKey]) => normalizeSubscaleKey(metadataKey) === normalizedInput
    )?.[1]
  }

  const getCompletionStatus = () => {
    if (!postPsychologicalWellbeingData) return 'Unknown'
    const answers = parseAnswers(postPsychologicalWellbeingData.answers)
    if (answers && Object.keys(answers).length > 0) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-5xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-2xl font-bold'>
            <Brain className='h-6 w-6' />
            Post-Psychological Wellbeing Assessment Details
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin' />
            <span className='ml-2'>
              Loading post-psychological wellbeing data...
            </span>
          </div>
        )}

        {error && (
          <div className='py-8 text-center'>
            <div className='mb-4 text-red-500'>{error}</div>
            <p className='text-muted-foreground'>
              No post-psychological wellbeing data available for this client.
            </p>
          </div>
        )}

        {postPsychologicalWellbeingData && !loading && (
          <div className='space-y-6'>
            {/* Assessment Overview */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <TrendingUp className='h-5 w-5' />
                  Assessment Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-between gap-4'>
                  <div className='flex items-center gap-2'>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Session ID:
                    </label>
                    <p className='text-sm font-medium'>{postPsychologicalWellbeingData.session_id}</p>
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
                      Overall Score:
                    </label>
                    <span className='text-xl font-bold text-blue-600'>
                      {Math.round(parseFloat(postPsychologicalWellbeingData.score))}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscale Scores */}
            {postPsychologicalWellbeingData.subscale_scores &&
              Object.keys(postPsychologicalWellbeingData.subscale_scores)
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
                        postPsychologicalWellbeingData.subscale_scores
                      ).map(([key, value]) => {
                        const metadata = getSubscaleMetadata(key)

                        return (
                          <div
                            key={key}
                            className='rounded-lg border bg-gray-50 p-4'
                          >
                            <div className='flex items-center justify-between'>
                              <div className='flex-1'>
                                <h4 className='font-medium text-gray-900'>
                                  {metadata?.name || formatKeyName(key)}
                                </h4>
                                <p className='mt-1 text-xs text-muted-foreground'>
                                  {metadata?.description ||
                                    'No description available for this subscale.'}
                                </p>
                              </div>
                              <div className='mx-4 h-12 w-px bg-gray-300'></div>
                              <div className='text-right'>
                                <div className='text-xl font-semibold text-blue-600'>
                                  {Math.round(value)}%
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
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
                  const answers = parseAnswers(
                    postPsychologicalWellbeingData.answers
                  )
                  if (!answers) {
                    return (
                      <div className='py-4 text-center'>
                        <p className='text-muted-foreground'>
                          No post-psychological wellbeing responses available or
                          data is not in expected format.
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
                                    {question}
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

export default PostPsychologicalWellbeingDetailsDialog
