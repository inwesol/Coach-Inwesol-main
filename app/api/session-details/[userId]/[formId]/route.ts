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
  careerOptionsMatrix,
  report,
  userSessionFormProgress,
  journeyProgress
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

      // Fetch score data from user_session_form_progress
      // Use the session_id from careerMaturityData to match the correct record
      let progressData = await db
        .select()
        .from(userSessionFormProgress)
        .where(
          and(
            eq(userSessionFormProgress.userId, userId),
            eq(userSessionFormProgress.formId, 'career-maturity'),
            eq(userSessionFormProgress.sessionId, careerMaturityData[0].session_id)
          )
        )
        .limit(1)

      // Fallback: if no data found with sessionId, try without sessionId filter
      if (progressData.length === 0) {
        progressData = await db
          .select()
          .from(userSessionFormProgress)
          .where(
            and(
              eq(userSessionFormProgress.userId, userId),
              eq(userSessionFormProgress.formId, 'career-maturity')
            )
          )
          .orderBy(userSessionFormProgress.sessionId)
          .limit(1)
      }

      let scoreData: { score?: number; subscale_scores?: Record<string, number> } = {}
      
      if (progressData.length > 0) {
        
        if (progressData[0].insights) {
          const insights = progressData[0].insights as any
          
          // Handle insights - it might be an object or need parsing
          let parsedInsights = insights
          if (typeof insights === 'string') {
            try {
              parsedInsights = JSON.parse(insights)
            } catch (e) {
              console.error('Error parsing insights:', e)
              parsedInsights = {}
            }
          }
          
          // Extract subscale scores from insights.score
          // The insights.score key contains all subscale scores as an object
          if (parsedInsights && parsedInsights.score) {
            const scoreDataFromInsights = parsedInsights.score
            
            // Handle if score is an object containing subscale scores
            if (typeof scoreDataFromInsights === 'object' && scoreDataFromInsights !== null && !Array.isArray(scoreDataFromInsights)) {
              // Extract subscale_scores from insights.score
              scoreData.subscale_scores = {}
              
              // Copy all numeric values from insights.score as subscale scores
              for (const [key, value] of Object.entries(scoreDataFromInsights)) {
                if (typeof value === 'number') {
                  scoreData.subscale_scores[key] = value
                } else if (value !== null && value !== undefined) {
                  const numValue = parseFloat(String(value))
                  if (!isNaN(numValue)) {
                    scoreData.subscale_scores[key] = numValue
                  }
                }
              }
              
              // Calculate overall score as average of all subscale scores
              if (Object.keys(scoreData.subscale_scores).length > 0) {
                const scores = Object.values(scoreData.subscale_scores)
                const sum = scores.reduce((acc, val) => acc + val, 0)
                scoreData.score = Math.round((sum / scores.length) * 100) / 100 // Round to 2 decimal places
              }
            }
            // Fallback: if score is a direct number, use it as overall score
            else if (typeof scoreDataFromInsights === 'number') {
              scoreData.score = scoreDataFromInsights
            }
            // Fallback: if score is a string that can be parsed as number
            else if (typeof scoreDataFromInsights === 'string') {
              const numValue = parseFloat(scoreDataFromInsights)
              if (!isNaN(numValue)) {
                scoreData.score = numValue
              }
            }
          }
          
          // Also check for direct subscale_scores key (fallback)
          if (!scoreData.subscale_scores && parsedInsights && parsedInsights.subscale_scores && typeof parsedInsights.subscale_scores === 'object') {
            scoreData.subscale_scores = parsedInsights.subscale_scores
            
            // Calculate overall score if not already set
            if (!scoreData.score && scoreData.subscale_scores && Object.keys(scoreData.subscale_scores).length > 0) {
              const scores = Object.values(scoreData.subscale_scores)
              const sum = scores.reduce((acc, val) => acc + val, 0)
              scoreData.score = Math.round((sum / scores.length) * 100) / 100
            }
          }
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          ...careerMaturityData[0],
          ...scoreData
        }
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

      // Fetch score data from user_session_form_progress
      // Use the session_id from postCareerMaturityData to match the correct record
      let progressData = await db
        .select()
        .from(userSessionFormProgress)
        .where(
          and(
            eq(userSessionFormProgress.userId, userId),
            eq(userSessionFormProgress.formId, 'post-career-maturity'),
            eq(userSessionFormProgress.sessionId, postCareerMaturityData[0].session_id)
          )
        )
        .limit(1)

      // Fallback: if no data found with sessionId, try without sessionId filter
      if (progressData.length === 0) {
        progressData = await db
          .select()
          .from(userSessionFormProgress)
          .where(
            and(
              eq(userSessionFormProgress.userId, userId),
              eq(userSessionFormProgress.formId, 'post-career-maturity')
            )
          )
          .orderBy(userSessionFormProgress.sessionId)
          .limit(1)
      }

      let scoreData: { score?: number; subscale_scores?: Record<string, number> } = {}
      
      if (progressData.length > 0) {
        
        if (progressData[0].insights) {
          const insights = progressData[0].insights as any
          
          // Handle insights - it might be an object or need parsing
          let parsedInsights = insights
          if (typeof insights === 'string') {
            try {
              parsedInsights = JSON.parse(insights)
            } catch (e) {
              console.error('Error parsing insights:', e)
              parsedInsights = {}
            }
          }
          
          // Extract subscale scores from insights.score
          // The insights.score key contains all subscale scores as an object
          if (parsedInsights && parsedInsights.score) {
            const scoreDataFromInsights = parsedInsights.score
            
            // Handle if score is an object containing subscale scores
            if (typeof scoreDataFromInsights === 'object' && scoreDataFromInsights !== null && !Array.isArray(scoreDataFromInsights)) {
              // Extract subscale_scores from insights.score
              scoreData.subscale_scores = {}
              
              // Copy all numeric values from insights.score as subscale scores
              for (const [key, value] of Object.entries(scoreDataFromInsights)) {
                if (typeof value === 'number') {
                  scoreData.subscale_scores[key] = value
                } else if (value !== null && value !== undefined) {
                  const numValue = parseFloat(String(value))
                  if (!isNaN(numValue)) {
                    scoreData.subscale_scores[key] = numValue
                  }
                }
              }
              
              // Calculate overall score as average of all subscale scores
              if (Object.keys(scoreData.subscale_scores).length > 0) {
                const scores = Object.values(scoreData.subscale_scores)
                const sum = scores.reduce((acc, val) => acc + val, 0)
                scoreData.score = Math.round((sum / scores.length) * 100) / 100 // Round to 2 decimal places
              }
            }
            // Fallback: if score is a direct number, use it as overall score
            else if (typeof scoreDataFromInsights === 'number') {
              scoreData.score = scoreDataFromInsights
            }
            // Fallback: if score is a string that can be parsed as number
            else if (typeof scoreDataFromInsights === 'string') {
              const numValue = parseFloat(scoreDataFromInsights)
              if (!isNaN(numValue)) {
                scoreData.score = numValue
              }
            }
          }
          
          // Also check for direct subscale_scores key (fallback)
          if (!scoreData.subscale_scores && parsedInsights && parsedInsights.subscale_scores && typeof parsedInsights.subscale_scores === 'object') {
            scoreData.subscale_scores = parsedInsights.subscale_scores
            
            // Calculate overall score if not already set
            if (!scoreData.score && scoreData.subscale_scores && Object.keys(scoreData.subscale_scores).length > 0) {
              const scores = Object.values(scoreData.subscale_scores)
              const sum = scores.reduce((acc, val) => acc + val, 0)
              scoreData.score = Math.round((sum / scores.length) * 100) / 100
            }
          }
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          ...postCareerMaturityData[0],
          ...scoreData
        }
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

    // Handle career-options-matrix form
    if (formId === 'career-options-matrix') {
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

      const careerOptionsMatrixData = await db
        .select()
        .from(careerOptionsMatrix)
        .where(
          and(
            eq(careerOptionsMatrix.userId, userId),
            eq(careerOptionsMatrix.sessionId, sessionId)
          )
        )
        .limit(1)

      if (!careerOptionsMatrixData.length) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'No career options matrix data found for this client',
            data: null 
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: careerOptionsMatrixData[0]
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

      // Update journey progress when session-report is marked as completed
      const [jp] = await db
        .select()
        .from(journeyProgress)
        .where(eq(journeyProgress.userId, userId))
        .limit(1)

      if (jp) {
        const completedSessions: number[] =
          (jp.completedSessions as number[]) ?? []
        const isNewSession = !completedSessions.includes(sessionId)
        
        if (isNewSession) {
          completedSessions.push(sessionId)
        }
        
        // Calculate the new total score
        // Each completed session is worth 100 points (only add if it's a new session)
        const newTotalScore = isNewSession
          ? (jp.totalScore ?? 0) + 100
          : (jp.totalScore ?? 0)

        // Set current_session to the next one
        const nextSession = Math.max(...completedSessions) + 1

        await db
          .update(journeyProgress)
          .set({
            completedSessions: completedSessions,
            lastActiveDate: new Date().toISOString(),
            updatedAt: new Date(),
            currentSession: nextSession,
            totalScore: newTotalScore,
          })
          .where(eq(journeyProgress.userId, userId))
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
