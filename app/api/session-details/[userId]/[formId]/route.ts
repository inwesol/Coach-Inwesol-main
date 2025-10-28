import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import {
  demographicsDetailsForm,
  preAssessment,
  postCoachingAssessments,
  careerMaturityAssessment,
  postCareerMaturityTable,
  psychologicalWellbeingTest,
  post_psychological_wellbeing_test,
  preCoachingSdq,
  postCoachingSdq,
  riasecTest,
  personalityTest,
  careerStoryOneTable,
  careerStoryTwo,
  careerStoryThree,
  careerStoryFours,
  letterFromFutureSelfTable,
  myLifeCollageTable,
  careerStoryFive,
  careerStorySix,
  report,
  userSessionFormProgress
} from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'

export async function GET(
  request: Request,
  { params }: { params: { userId: string; formId: string } }
) {
  try {
    // Check authentication
    const { userId: authUserId } = await auth()
    if (!authUserId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { userId, formId } = params

    // Handle demographics-details form
    if (formId === 'demographics-details') {
      const demographicsData = await db
        .select()
        .from(demographicsDetailsForm)
        .where(eq(demographicsDetailsForm.user_id, userId))
        .limit(1)

      if (!demographicsData.length) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'No demographics data found for this client',
            data: null 
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: demographicsData[0]
      })
    }

    // Handle pre-assessment form
    if (formId === 'pre-assessment') {
      const preAssessmentData = await db
        .select()
        .from(preAssessment)
        .where(eq(preAssessment.user_id, userId))
        .limit(1)

      if (!preAssessmentData.length) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'No pre-assessment data found for this client',
            data: null 
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: preAssessmentData[0]
      })
    }

    // Handle post-coaching form
    if (formId === 'post-coaching') {
      const postCoachingData = await db
        .select()
        .from(postCoachingAssessments)
        .where(eq(postCoachingAssessments.userId, userId))
        .limit(1)

      if (!postCoachingData.length) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'No post-coaching data found for this client',
            data: null 
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: postCoachingData[0]
      })
    }

    // Handle career-maturity form
    if (formId === 'career-maturity') {
      const careerMaturityData = await db
        .select()
        .from(careerMaturityAssessment)
        .where(eq(careerMaturityAssessment.user_id, userId))
        .limit(1)

      if (!careerMaturityData.length) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'No career maturity data found for this client',
            data: null 
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: careerMaturityData[0]
      })
    }

    // Handle post-career-maturity form
    if (formId === 'post-career-maturity') {
      const postCareerMaturityData = await db
        .select()
        .from(postCareerMaturityTable)
        .where(eq(postCareerMaturityTable.user_id, userId))
        .limit(1)

      if (!postCareerMaturityData.length) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'No post-career maturity data found for this client',
            data: null 
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: postCareerMaturityData[0]
      })
    }

    // Handle psychological-wellbeing form
    if (formId === 'psychological-wellbeing') {
      const psychologicalWellbeingData = await db
        .select()
        .from(psychologicalWellbeingTest)
        .where(eq(psychologicalWellbeingTest.user_id, userId))
        .limit(1)

      if (!psychologicalWellbeingData.length) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'No psychological wellbeing data found for this client',
            data: null 
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: psychologicalWellbeingData[0]
      })
    }

    // Handle post-psychological-wellbeing form
    if (formId === 'post-psychological-wellbeing') {
      const postPsychologicalWellbeingData = await db
        .select()
        .from(post_psychological_wellbeing_test)
        .where(eq(post_psychological_wellbeing_test.user_id, userId))
        .limit(1)

      if (!postPsychologicalWellbeingData.length) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'No post-psychological wellbeing data found for this client',
            data: null 
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: postPsychologicalWellbeingData[0]
      })
    }

    // Handle pre-coaching-strength-difficulty form
    if (formId === 'pre-coaching-strength-difficulty') {
      const preCoachingStrengthDifficultyData = await db
        .select()
        .from(preCoachingSdq)
        .where(eq(preCoachingSdq.userId, userId))
        .limit(1)

      if (!preCoachingStrengthDifficultyData.length) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'No pre-coaching strength difficulty data found for this client',
            data: null 
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: preCoachingStrengthDifficultyData[0]
      })
    }

    // Handle post-coaching-strength-difficulty form
    if (formId === 'post-coaching-strength-difficulty') {
      const postCoachingStrengthDifficultyData = await db
        .select()
        .from(postCoachingSdq)
        .where(eq(postCoachingSdq.userId, userId))
        .limit(1)

      if (!postCoachingStrengthDifficultyData.length) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'No post-coaching strength difficulty data found for this client',
            data: null 
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: postCoachingStrengthDifficultyData[0]
      })
    }

    // Handle riasec-test form
    if (formId === 'riasec-test') {
      const riasecTestData = await db
        .select()
        .from(riasecTest)
        .where(eq(riasecTest.user_id, userId))
        .limit(1)

      if (!riasecTestData.length) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'No RIASEC test data found for this client',
            data: null 
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: riasecTestData[0]
      })
    }

    // Handle personality-test form
    if (formId === 'personality-test') {
      const personalityTestData = await db
        .select()
        .from(personalityTest)
        .where(eq(personalityTest.user_id, userId))
        .limit(1)

      if (!personalityTestData.length) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'No personality test data found for this client',
            data: null 
          },
          { status: 404 }
        )
      }

      // Debug: Log the data structure
      console.log('Personality Test Data from DB:', personalityTestData[0])
      console.log('Answers field:', personalityTestData[0].answers)
      
      try {
        const parsedAnswers = JSON.parse(personalityTestData[0].answers)
        console.log('Parsed answers:', parsedAnswers)
        console.log('Answer keys:', Object.keys(parsedAnswers))
      } catch (e) {
        console.log('Error parsing answers:', e)
      }

      return NextResponse.json({
        success: true,
        data: personalityTestData[0]
      })
    }

    // Handle career-story-1 form
    if (formId === 'career-story-1') {
      const careerStoryOneData = await db
        .select()
        .from(careerStoryOneTable)
        .where(eq(careerStoryOneTable.userId, userId))
        .limit(1)

      if (!careerStoryOneData.length) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'No career story one data found for this client',
            data: null 
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: careerStoryOneData[0]
      })
    }

    // Handle career-story-2 form
    if (formId === 'career-story-2') {
      const careerStoryTwoData = await db
        .select()
        .from(careerStoryTwo)
        .where(eq(careerStoryTwo.userId, userId))
        .limit(1)

      if (!careerStoryTwoData.length) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'No career story two data found for this client',
            data: null 
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: careerStoryTwoData[0]
      })
    }

    // Handle career-story-3 form
    if (formId === 'career-story-3') {
      const careerStoryThreeData = await db
        .select()
        .from(careerStoryThree)
        .where(eq(careerStoryThree.userId, userId))
        .limit(1)

      if (!careerStoryThreeData.length) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'No career story three data found for this client',
            data: null 
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: careerStoryThreeData[0]
      })
    }

    // Handle career-story-4 form
    if (formId === 'career-story-4') {
      const careerStoryFourData = await db
        .select()
        .from(careerStoryFours)
        .where(eq(careerStoryFours.userId, userId))
        .limit(1)

      if (!careerStoryFourData.length) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'No career story four data found for this client',
            data: null 
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: careerStoryFourData[0]
      })
    }

    // Handle letter-from-future-self form
    if (formId === 'letter-from-future-self') {
      const letterFromFutureSelfData = await db
        .select()
        .from(letterFromFutureSelfTable)
        .where(eq(letterFromFutureSelfTable.userId, userId))
        .limit(1)

      if (!letterFromFutureSelfData.length) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'No letter from future self data found for this client',
            data: null 
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: letterFromFutureSelfData[0]
      })
    }

    // Handle my-life-collage form
    if (formId === 'my-life-collage') {
      const myLifeCollageData = await db
        .select()
        .from(myLifeCollageTable)
        .where(eq(myLifeCollageTable.userId, userId))
        .limit(1)

      if (!myLifeCollageData.length) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'No my life collage data found for this client',
            data: null 
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: myLifeCollageData[0]
      })
    }

    // Handle career-story-5 form
    if (formId === 'career-story-5') {
      const careerStoryFiveData = await db
        .select()
        .from(careerStoryFive)
        .where(eq(careerStoryFive.user_id, userId))
        .limit(1)

      if (!careerStoryFiveData.length) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'No career story five data found for this client',
            data: null 
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: careerStoryFiveData[0]
      })
    }

    // Handle career-story-6 form
    if (formId === 'career-story-6') {
      const careerStorySixData = await db
        .select()
        .from(careerStorySix)
        .where(eq(careerStorySix.user_id, userId))
        .limit(1)

      if (!careerStorySixData.length) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'No career story six data found for this client',
            data: null 
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: careerStorySixData[0]
      })
    }

    // Handle session-report form
    if (formId === 'session-report') {
      const sessionReportData = await db
        .select()
        .from(report)
        .where(eq(report.user_id, userId))
        .limit(1)

      if (!sessionReportData.length) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'No session report data found for this client',
            data: null 
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: sessionReportData[0]
      })
    }

    // Handle schedule-call form
    if (formId === 'schedule-call') {
      const { searchParams } = new URL(request.url)
      const sessionIdParam = searchParams.get('sessionId')
      
      if (!sessionIdParam) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'sessionId is required',
            data: null 
          },
          { status: 400 }
        )
      }

      const sessionId = parseInt(sessionIdParam)

      const scheduleCallData = await db
        .select()
        .from(report)
        .where(
          and(
            eq(report.user_id, userId),
            eq(report.session_id, sessionId)
          )
        )
        .limit(1)

      // Return empty data if no report exists yet
      if (!scheduleCallData.length) {
        return NextResponse.json({
          success: true,
          data: {
            summary: '',
            coach_feedback: null
          }
        })
      }

      return NextResponse.json({
        success: true,
        data: {
          summary: scheduleCallData[0].summary,
          coach_feedback: scheduleCallData[0].coach_feedback
        }
      })
    }

    // Handle other form types in the future
    return NextResponse.json(
      { 
        success: false, 
        error: `Form type '${formId}' not supported yet`,
        data: null 
      },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error fetching session details:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch session details',
        data: null 
      },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { userId: string; formId: string } }
) {
  try {
    // Check authentication
    const { userId: authUserId } = await auth()
    if (!authUserId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { userId, formId } = params

    // Handle schedule-call publish
    if (formId === 'schedule-call') {
      const body = await request.json()
      const { summary, coach_feedback, sessionId } = body

      if (sessionId === null || sessionId === undefined) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'sessionId is required',
          },
          { status: 400 }
        )
      }

      if (!summary || summary.trim() === '') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Summary cannot be empty',
          },
          { status: 400 }
        )
      }

      // Check if report exists
      const existingReport = await db
        .select()
        .from(report)
        .where(
          and(
            eq(report.user_id, userId),
            eq(report.session_id, sessionId)
          )
        )
        .limit(1)

      // Use provided values
      const coachFeedbackToSave = coach_feedback || null

      if (existingReport.length > 0) {
        // Update existing report
        await db
          .update(report)
          .set({
            summary,
            coach_feedback: coachFeedbackToSave
          })
          .where(eq(report.id, existingReport[0].id))
      } else {
        // Create new report
        await db
          .insert(report)
          .values({
            user_id: userId,
            session_id: sessionId,
            summary,
            coach_feedback: coachFeedbackToSave
          })
      }

      // Update userSessionFormProgress status to completed for schedule-call
      const completedAtStr = new Date().toISOString()
      await db
        .update(userSessionFormProgress)
        .set({
          status: 'completed',
          completedAt: completedAtStr,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(userSessionFormProgress.userId, userId),
            eq(userSessionFormProgress.sessionId, sessionId),
            eq(userSessionFormProgress.formId, 'schedule-call')
          )
        )

      // Check if session-report entry exists
      const existingSessionReport = await db
        .select()
        .from(userSessionFormProgress)
        .where(
          and(
            eq(userSessionFormProgress.userId, userId),
            eq(userSessionFormProgress.sessionId, sessionId),
            eq(userSessionFormProgress.formId, 'session-report')
          )
        )
        .limit(1)

      if (existingSessionReport.length > 0) {
        // Update existing session-report entry
        await db
          .update(userSessionFormProgress)
          .set({
            status: 'completed',
            completedAt: completedAtStr,
            updatedAt: new Date()
          })
          .where(eq(userSessionFormProgress.id, existingSessionReport[0].id))
      } else {
        // Create new session-report entry
        await db.insert(userSessionFormProgress).values({
          userId: userId,
          sessionId: sessionId,
          formId: 'session-report',
          status: 'completed',
          completedAt: completedAtStr
        })
      }

      return NextResponse.json({
        success: true,
        message: 'Schedule call data published successfully'
      })
    }

    // Handle other form types
    return NextResponse.json(
      { 
        success: false, 
        error: `Form type '${formId}' not supported for POST`,
      },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error publishing schedule call data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to publish schedule call data',
      },
      { status: 500 }
    )
  }
}
