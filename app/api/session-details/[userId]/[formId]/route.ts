import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { demographicsDetailsForm, preAssessment, postCoachingAssessments, careerMaturityAssessment, postCareerMaturityTable, psychologicalWellbeingTest, post_psychological_wellbeing_test, preCoachingSdq, postCoachingSdq, riasecTest, personalityTest } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
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
