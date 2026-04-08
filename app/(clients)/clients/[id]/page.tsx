'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import DemographicsDetailsDialog from '@/components/DemographicsDetailsDialog'
import PreAssessmentDetailsDialog from '@/components/PreAssessmentDetailsDialog'
import PostCoachingDetailsDialog from '@/components/PostCoachingDetailsDialog'
import CareerMaturityDetailsDialog from '@/components/CareerMaturityDetailsDialog'
import PostCareerMaturityDetailsDialog from '@/components/PostCareerMaturityDetailsDialog'
import PsychologicalWellbeingDetailsDialog from '@/components/PsychologicalWellbeingDetailsDialog'
import PostPsychologicalWellbeingDetailsDialog from '@/components/PostPsychologicalWellbeingDetailsDialog'
import PreCoachingStrengthDifficultyDetailsDialog from '@/components/PreCoachingStrengthDifficultyDetailsDialog'
import PostCoachingStrengthDifficultyDetailsDialog from '@/components/PostCoachingStrengthDifficultyDetailsDialog'
import RiasecTestDetailsDialog from '@/components/RiasecTestDetailsDialog'
import PersonalityTestDetailsDialog from '@/components/PersonalityTestDetailsDialog'
import CareerStoryOneDetailsDialog from '@/components/CareerStoryOneDetailsDialog'
import CareerStoryTwoDetailsDialog from '@/components/CareerStoryTwoDetailsDialog'
import CareerStoryThreeDetailsDialog from '@/components/CareerStoryThreeDetailsDialog'
import CareerStoryFourDetailsDialog from '@/components/CareerStoryFourDetailsDialog'
import LetterFromFutureSelfDetailsDialog from '@/components/LetterFromFutureSelfDetailsDialog'
import MyLifeCollageDetailsDialog from '@/components/MyLifeCollageDetailsDialog'
import CareerStoryFiveDetailsDialog from '@/components/CareerStoryFiveDetailsDialog'
import CareerStorySixDetailsDialog from '@/components/CareerStorySixDetailsDialog'
import SessionReportDetailsDialog from '@/components/SessionReportDetailsDialog'
import ScheduleCallDetailsDialog from '@/components/ScheduleCallDetailsDialog'
import CareerOptionsMatrixDetailsDialog from '@/components/CareerOptionsMatrixDetailsDialog'
import dynamic from 'next/dynamic'

const SessionGuidePdfDialog = dynamic(
  () => import('@/components/SessionGuidePdfDialog'),
  {
    ssr: false
  }
)

interface Client {
  id: string
  name: string | null
  email: string
  image: string | null
}

interface Session {
  id: string
  sessionId: number
  formId: string
  status: string
  score: number | null
  completedAt: string | null
  updatedAt: string
  insights: any
}

const ClientSessionsPage = () => {
  const params = useParams()
  const clientId = params.id as string
  const [client, setClient] = useState<Client | null>(null)

  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [demographicsDialogOpen, setDemographicsDialogOpen] = useState(false)

  const [preAssessmentDialogOpen, setPreAssessmentDialogOpen] = useState(false)
  const [postCoachingDialogOpen, setPostCoachingDialogOpen] = useState(false)
  const [careerMaturityDialogOpen, setCareerMaturityDialogOpen] =
    useState(false)
  const [postCareerMaturityDialogOpen, setPostCareerMaturityDialogOpen] =
    useState(false)
  const [
    psychologicalWellbeingDialogOpen,
    setPsychologicalWellbeingDialogOpen
  ] = useState(false)
  const [
    postPsychologicalWellbeingDialogOpen,
    setPostPsychologicalWellbeingDialogOpen
  ] = useState(false)
  const [
    preCoachingStrengthDifficultyDialogOpen,
    setPreCoachingStrengthDifficultyDialogOpen
  ] = useState(false)
  const [
    postCoachingStrengthDifficultyDialogOpen,
    setPostCoachingStrengthDifficultyDialogOpen
  ] = useState(false)
  const [riasecTestDialogOpen, setRiasecTestDialogOpen] = useState(false)
  const [personalityTestDialogOpen, setPersonalityTestDialogOpen] =
    useState(false)
  const [careerStoryOneDialogOpen, setCareerStoryOneDialogOpen] =
    useState(false)
  const [careerStoryTwoDialogOpen, setCareerStoryTwoDialogOpen] =
    useState(false)
  const [careerStoryThreeDialogOpen, setCareerStoryThreeDialogOpen] =
    useState(false)
  const [careerStoryFourDialogOpen, setCareerStoryFourDialogOpen] =
    useState(false)
  const [letterFromFutureSelfDialogOpen, setLetterFromFutureSelfDialogOpen] =
    useState(false)
  const [myLifeCollageDialogOpen, setMyLifeCollageDialogOpen] = useState(false)
  const [careerStoryFiveDialogOpen, setCareerStoryFiveDialogOpen] =
    useState(false)
  const [careerStorySixDialogOpen, setCareerStorySixDialogOpen] =
    useState(false)
  const [sessionReportDialogOpen, setSessionReportDialogOpen] = useState(false)
  const [scheduleCallDialogOpen, setScheduleCallDialogOpen] = useState(false)
  const [careerOptionsMatrixDialogOpen, setCareerOptionsMatrixDialogOpen] =
    useState(false)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [selectedPdf, setSelectedPdf] = useState<{
    path: string
    title: string
  } | null>(null)
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false)

  useEffect(() => {
    const fetchClientSessions = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/clients/${clientId}/sessions`)
        const data = await response.json()

        if (data.success) {
          setClient(data.data.client)
          setSessions(data.data.sessions)
        } else {
          setError(data.error || 'Failed to fetch client sessions')
        }
      } catch (err) {
        setError('Failed to fetch client sessions')
        console.error('Error fetching client sessions:', err)
      } finally {
        setLoading(false)
      }
    }

    if (clientId) {
      fetchClientSessions()
    }
  }, [clientId])

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className='h-4 w-4 text-green-500' />
      case 'in_progress':
        return <Clock className='h-4 w-4 text-yellow-500' />
      case 'pending':
        return <Clock className='h-4 w-4 text-gray-500' />
      default:
        return <Clock className='h-4 w-4 text-gray-500' />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return (
          <Badge
            variant='default'
            className='bg-green-50 text-green-800 hover:bg-green-100'
          >
            Completed
          </Badge>
        )
      case 'assigned':
        return (
          <Badge
            variant='default'
            className='bg-yellow-50 text-yellow-800 hover:bg-yellow-100'
          >
            Assigned
          </Badge>
        )
      case 'pending':
        return (
          <Badge
            variant='default'
            className='bg-blue-50 text-blue-800 hover:bg-blue-100'
          >
            Pending
          </Badge>
        )
      default:
        return (
          <Badge
            variant='default'
            className='bg-gray-50 text-gray-800 hover:bg-gray-100'
          >
            {status}
          </Badge>
        )
    }
  }

  const handleSessionClick = (session: Session) => {
    setSelectedSession(session)

    // Open appropriate dialog based on formId
    if (session.formId === 'demographics-details') {
      setDemographicsDialogOpen(true)
    } else if (session.formId === 'pre-assessment') {
      setPreAssessmentDialogOpen(true)
    } else if (session.formId === 'post-coaching') {
      setPostCoachingDialogOpen(true)
    } else if (session.formId === 'career-maturity') {
      setCareerMaturityDialogOpen(true)
    } else if (session.formId === 'post-career-maturity') {
      setPostCareerMaturityDialogOpen(true)
    } else if (session.formId === 'psychological-wellbeing') {
      setPsychologicalWellbeingDialogOpen(true)
    } else if (session.formId === 'post-psychological-wellbeing') {
      setPostPsychologicalWellbeingDialogOpen(true)
    } else if (session.formId === 'pre-coaching-strength-difficulty') {
      setPreCoachingStrengthDifficultyDialogOpen(true)
    } else if (session.formId === 'post-coaching-strength-difficulty') {
      setPostCoachingStrengthDifficultyDialogOpen(true)
    } else if (session.formId === 'riasec-test') {
      setRiasecTestDialogOpen(true)
    } else if (session.formId === 'personality-test') {
      setPersonalityTestDialogOpen(true)
    } else if (session.formId === 'career-story-1') {
      setCareerStoryOneDialogOpen(true)
    } else if (session.formId === 'career-story-2') {
      setCareerStoryTwoDialogOpen(true)
    } else if (session.formId === 'career-story-3') {
      setCareerStoryThreeDialogOpen(true)
    } else if (session.formId === 'career-story-4') {
      setCareerStoryFourDialogOpen(true)
    } else if (session.formId === 'letter-from-future-self') {
      setLetterFromFutureSelfDialogOpen(true)
    } else if (session.formId === 'my-life-collage') {
      setMyLifeCollageDialogOpen(true)
    } else if (session.formId === 'career-story-5') {
      setCareerStoryFiveDialogOpen(true)
    } else if (session.formId === 'career-story-6') {
      setCareerStorySixDialogOpen(true)
    } else if (session.formId === 'session-report') {
      setSessionReportDialogOpen(true)
    } else if (session.formId === 'schedule-call') {
      setScheduleCallDialogOpen(true)
    } else if (session.formId === 'career-options-matrix') {
      setCareerOptionsMatrixDialogOpen(true)
    }
    // Add other form types here in the future
  }

  // Filter out sessions with formId containing 'feedback' and 'daily-journaling'
  const filteredSessions = sessions.filter(
    session =>
      !session.formId.toLowerCase().includes('feedback') &&
      !session.formId.toLowerCase().includes('daily-journaling')
  )

  // Group sessions by session_id
  const groupedSessions = filteredSessions.reduce(
    (acc, session) => {
      const sessionKey = `session_${session.sessionId}`
      if (!acc[sessionKey]) {
        acc[sessionKey] = {
          sessionId: session.sessionId,
          sessions: []
        }
      }
      acc[sessionKey].sessions.push(session)
      return acc
    },
    {} as Record<string, { sessionId: number; sessions: Session[] }>
  )

  // Sort sessions by session_id
  const sortedSessions = Object.values(groupedSessions).sort(
    (a, b) => a.sessionId - b.sessionId
  )

  // Session Guides data
  const sessionGuides = [
    {
      id: '0',
      title: 'Session 1',
      path: '/pdfs/session-wise-guide/Session 0.pdf'
    },
    {
      id: '1',
      title: 'Session 2',
      path: '/pdfs/session-wise-guide/Session 1.pdf'
    },
    {
      id: '2',
      title: 'Session 3',
      path: '/pdfs/session-wise-guide/Session 2.pdf'
    },
    {
      id: '3',
      title: 'Session 4',
      path: '/pdfs/session-wise-guide/Session 3.pdf'
    },
    {
      id: '4',
      title: 'Session 5',
      path: '/pdfs/session-wise-guide/Session 4.pdf'
    },
    {
      id: '5',
      title: 'Session 6',
      path: '/pdfs/session-wise-guide/Session 5.pdf'
    },
    {
      id: '6',
      title: 'Session 7',
      path: '/pdfs/session-wise-guide/Session 6.pdf'
    },
    {
      id: '7',
      title: 'Session 8',
      path: '/pdfs/session-wise-guide/Session 7.pdf'
    },
    {
      id: '8',
      title: 'Session 9',
      path: '/pdfs/session-wise-guide/Session 8.pdf'
    },
    {
      id: 'check-in',
      title: 'Check-in Session Guide',
      path: '/pdfs/session-wise-guide/Check-in-Session.pdf'
    },
    {
      id: 'conversation',
      title: 'Parents Conversation Guide',
      path: '/pdfs/session-wise-guide/Conversation Guide_Parents_Session 0 & 8.pdf'
    }
  ]

  const handlePdfClick = (guide: {
    id: string
    title: string
    path: string
  }) => {
    setSelectedPdf({ path: guide.path, title: guide.title })
    setPdfDialogOpen(true)
  }

  if (loading) {
    return (
      <div className='container mx-auto py-10'>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-lg'>Loading client sessions...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto py-10'>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <div className='text-lg text-red-500'>Error: {error}</div>
            <Link href='/clients'>
              <Button variant='outline' className='mt-4'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to Clients
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className='container mx-auto py-10'>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <div className='text-lg text-muted-foreground'>
              Client not found
            </div>
            <Link href='/clients'>
              <Button variant='outline' className='mt-4'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to Clients
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto py-10'>
      {/* Client Info Header */}
      <div className='mb-8'>
        <div className='mb-4 flex items-center gap-4'>
          <Link href='/clients'>
            <Button variant='outline' size='sm'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Clients
            </Button>
          </Link>
        </div>

        <div className='flex items-center gap-4'>
          {client.image && (
            <img
              src={client.image}
              alt={client.name || 'Client'}
              className='h-16 w-16 rounded-full'
            />
          )}
          <div>
            <h1 className='text-3xl font-bold'>
              {client.name || 'Unknown Client'}
            </h1>
            <p className='text-muted-foreground'>{client.email}</p>
          </div>
        </div>
      </div>

      {/* Session Guides */}
      <div className='mb-8'>
        <h2 className='mb-6 text-2xl font-semibold'>Session Guides</h2>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {sessionGuides.map(guide => (
            <Card
              key={guide.id}
              className='cursor-pointer border-l-4 border-l-teal-200 transition-shadow hover:shadow-md'
              onClick={() => handlePdfClick(guide)}
            >
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <FileText className='h-5 w-5' />
                  {guide.title}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Sessions Cards */}
      <div className='mb-6'>
        <h2 className='mb-6 text-2xl font-semibold'>Sessions Response</h2>
        {filteredSessions.length === 0 ? (
          <div className='flex h-32 items-center justify-center'>
            <div className='text-center text-muted-foreground'>
              <Calendar className='mx-auto mb-2 h-8 w-8' />
              <div>No sessions found for this client</div>
            </div>
          </div>
        ) : (
          <div className='space-y-8'>
            {sortedSessions.map(sessionGroup => (
              <div key={sessionGroup.sessionId} className='space-y-4'>
                {/* Session Header */}
                <div className='flex items-center gap-3'>
                  <div className='h-px flex-1 bg-border'></div>
                  <h3 className='text-xl font-semibold text-blue-600'>
                    Session {sessionGroup.sessionId + 1}
                  </h3>
                  <div className='h-px flex-1 bg-border'></div>
                </div>

                {/* Session Cards */}
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  {sessionGroup.sessions.map(session => (
                    <Card
                      key={session.id}
                      className='cursor-pointer border-l-4 border-l-blue-200 transition-shadow hover:shadow-md'
                      onClick={() => handleSessionClick(session)}
                    >
                      <CardHeader className='pb-3'>
                        <div className='flex items-center justify-between'>
                          <CardTitle className='text-lg'>
                            {session.formId
                              .split('-')
                              .map(
                                word =>
                                  word.charAt(0).toUpperCase() +
                                  word.slice(1).toLowerCase()
                              )
                              .join(' ')}
                          </CardTitle>
                          {getStatusIcon(session.status)}
                        </div>
                        <div className='flex items-center gap-2'>
                          {getStatusBadge(session.status)}
                        </div>
                      </CardHeader>
                      <CardContent className='pt-0'>
                        <div className='space-y-2'>
                          {session.score !== null && (
                            <div className='text-sm text-muted-foreground'>
                              <strong>Score:</strong> {session.score}
                            </div>
                          )}
                          {session.completedAt && (
                            <div className='text-sm text-muted-foreground'>
                              <strong>Completed:</strong>{' '}
                              {new Date(
                                session.completedAt
                              ).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Demographics Details Dialog */}
      <DemographicsDetailsDialog
        open={demographicsDialogOpen}
        onOpenChange={setDemographicsDialogOpen}
        clientId={clientId}
        sessionId={selectedSession?.sessionId || 0}
      />

      {/* Pre-Assessment Details Dialog */}
      <PreAssessmentDetailsDialog
        open={preAssessmentDialogOpen}
        onOpenChange={setPreAssessmentDialogOpen}
        clientId={clientId}
        sessionId={selectedSession?.sessionId || 0}
      />

      {/* Post-Coaching Details Dialog */}
      <PostCoachingDetailsDialog
        open={postCoachingDialogOpen}
        onOpenChange={setPostCoachingDialogOpen}
        clientId={clientId}
        sessionId={selectedSession?.sessionId || 0}
      />

      {/* Career Maturity Details Dialog */}
      <CareerMaturityDetailsDialog
        open={careerMaturityDialogOpen}
        onOpenChange={setCareerMaturityDialogOpen}
        clientId={clientId}
        sessionId={selectedSession?.sessionId || 0}
      />

      {/* Post-Career Maturity Details Dialog */}
      <PostCareerMaturityDetailsDialog
        open={postCareerMaturityDialogOpen}
        onOpenChange={setPostCareerMaturityDialogOpen}
        clientId={clientId}
        sessionId={selectedSession?.sessionId || 0}
      />

      {/* Psychological Wellbeing Details Dialog */}
      <PsychologicalWellbeingDetailsDialog
        open={psychologicalWellbeingDialogOpen}
        onOpenChange={setPsychologicalWellbeingDialogOpen}
        clientId={clientId}
        sessionId={selectedSession?.sessionId || 0}
      />

      {/* Post-Psychological Wellbeing Details Dialog */}
      <PostPsychologicalWellbeingDetailsDialog
        open={postPsychologicalWellbeingDialogOpen}
        onOpenChange={setPostPsychologicalWellbeingDialogOpen}
        clientId={clientId}
        sessionId={selectedSession?.sessionId || 0}
      />

      {/* Pre-Coaching Strength Difficulty Details Dialog */}
      <PreCoachingStrengthDifficultyDetailsDialog
        open={preCoachingStrengthDifficultyDialogOpen}
        onOpenChange={setPreCoachingStrengthDifficultyDialogOpen}
        clientId={clientId}
        sessionId={selectedSession?.sessionId || 0}
      />

      {/* Post-Coaching Strength Difficulty Details Dialog */}
      <PostCoachingStrengthDifficultyDetailsDialog
        open={postCoachingStrengthDifficultyDialogOpen}
        onOpenChange={setPostCoachingStrengthDifficultyDialogOpen}
        clientId={clientId}
        sessionId={selectedSession?.sessionId || 0}
      />

      {/* RIASEC Test Details Dialog */}
      <RiasecTestDetailsDialog
        open={riasecTestDialogOpen}
        onOpenChange={setRiasecTestDialogOpen}
        clientId={clientId}
        sessionId={selectedSession?.sessionId || 0}
      />

      {/* Personality Test Details Dialog */}
      <PersonalityTestDetailsDialog
        open={personalityTestDialogOpen}
        onOpenChange={setPersonalityTestDialogOpen}
        clientId={clientId}
        sessionId={selectedSession?.sessionId || 0}
      />

      {/* Career Story One Details Dialog */}
      <CareerStoryOneDetailsDialog
        open={careerStoryOneDialogOpen}
        onOpenChange={setCareerStoryOneDialogOpen}
        clientId={clientId}
        sessionId={selectedSession?.sessionId || 0}
      />

      {/* Career Story Two Details Dialog */}
      <CareerStoryTwoDetailsDialog
        open={careerStoryTwoDialogOpen}
        onOpenChange={setCareerStoryTwoDialogOpen}
        clientId={clientId}
        sessionId={selectedSession?.sessionId || 0}
      />

      {/* Career Story Three Details Dialog */}
      <CareerStoryThreeDetailsDialog
        open={careerStoryThreeDialogOpen}
        onOpenChange={setCareerStoryThreeDialogOpen}
        clientId={clientId}
        sessionId={selectedSession?.sessionId || 0}
      />
      {/* Career Story Four Details Dialog */}
      <CareerStoryFourDetailsDialog
        open={careerStoryFourDialogOpen}
        onOpenChange={setCareerStoryFourDialogOpen}
        clientId={clientId}
        sessionId={selectedSession?.sessionId || 0}
      />
      {/* Letter From Future Self Details Dialog */}
      <LetterFromFutureSelfDetailsDialog
        open={letterFromFutureSelfDialogOpen}
        onOpenChange={setLetterFromFutureSelfDialogOpen}
        clientId={clientId}
        sessionId={selectedSession?.sessionId || 0}
      />
      {/* My Life Collage Details Dialog */}
      <MyLifeCollageDetailsDialog
        open={myLifeCollageDialogOpen}
        onOpenChange={setMyLifeCollageDialogOpen}
        clientId={clientId}
        sessionId={selectedSession?.sessionId || 0}
      />
      {/* Career Story Five Details Dialog */}
      <CareerStoryFiveDetailsDialog
        open={careerStoryFiveDialogOpen}
        onOpenChange={setCareerStoryFiveDialogOpen}
        clientId={clientId}
        sessionId={selectedSession?.sessionId || 0}
      />
      {/* Career Story Six Details Dialog */}
      <CareerStorySixDetailsDialog
        open={careerStorySixDialogOpen}
        onOpenChange={setCareerStorySixDialogOpen}
        clientId={clientId}
        sessionId={selectedSession?.sessionId || 0}
      />
      {/* Session Report Details Dialog */}
      <SessionReportDetailsDialog
        open={sessionReportDialogOpen}
        onOpenChange={setSessionReportDialogOpen}
        clientId={clientId}
        sessionId={selectedSession?.sessionId || 0}
      />

      {/* Schedule Call Details Dialog */}
      <ScheduleCallDetailsDialog
        open={scheduleCallDialogOpen}
        onOpenChange={setScheduleCallDialogOpen}
        clientId={clientId}
        sessionId={selectedSession?.sessionId || 0}
        onPublishSuccess={() => {
          // Refresh the sessions list after publish
          fetch(`/api/clients/${clientId}/sessions`)
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                setSessions(data.data.sessions)
              }
            })
        }}
      />

      {/* Career Options Matrix Details Dialog */}
      <CareerOptionsMatrixDetailsDialog
        open={careerOptionsMatrixDialogOpen}
        onOpenChange={setCareerOptionsMatrixDialogOpen}
        clientId={clientId}
        sessionId={selectedSession?.sessionId || 0}
      />

      {/* Session Guide PDF Dialog */}
      {selectedPdf && (
        <SessionGuidePdfDialog
          open={pdfDialogOpen}
          onOpenChange={setPdfDialogOpen}
          pdfPath={selectedPdf.path}
          title={selectedPdf.title}
        />
      )}
    </div>
  )
}

export default ClientSessionsPage
