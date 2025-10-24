import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { coaches, journeyProgress } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const coachEmail = searchParams.get('coachEmail')
    const { key, enabled } = await request.json()
    
    if (!coachEmail) {
      return NextResponse.json(
        { success: false, error: 'Coach email is required' },
        { status: 400 }
      )
    }

    if (!key || typeof enabled !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Key and enabled are required' },
        { status: 400 }
      )
    }

    // Validate key is one of the allowed keys
    const allowedKeys = ['mlc:pnc', 'cs-1:values', 'mtrx:scores', 'cs-2:strengths']
    if (!allowedKeys.includes(key)) {
      return NextResponse.json(
        { success: false, error: 'Invalid key provided' },
        { status: 400 }
      )
    }

    // Verify coach has access to this client
    const coach = await db
      .select({
        clients: coaches.clients
      })
      .from(coaches)
      .where(eq(coaches.email, coachEmail))
      .limit(1)

    if (!coach.length || !coach[0].clients || !coach[0].clients.includes(params.id)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access to this client' },
        { status: 403 }
      )
    }

    // Check if journey progress exists
    const existingProgress = await db
      .select()
      .from(journeyProgress)
      .where(eq(journeyProgress.userId, params.id))
      .limit(1)

    if (existingProgress.length > 0) {
      // Update existing record - merge with existing enableByCoach data
      const currentEnableByCoach = existingProgress[0].enableByCoach || {}
      const updatedEnableByCoach = {
        ...currentEnableByCoach,
        [key]: enabled
      }

      await db
        .update(journeyProgress)
        .set({ 
          enableByCoach: updatedEnableByCoach,
          updatedAt: new Date()
        })
        .where(eq(journeyProgress.userId, params.id))
    } else {
      // Create new journey progress record
      const newEnableByCoach = {
        'mlc:pnc': false,
        'cs-1:values': false,
        'mtrx:scores': false,
        'cs-2:strengths': false,
        [key]: enabled
      }

      await db.insert(journeyProgress).values({
        userId: params.id,
        currentSession: 1,
        completedSessions: [],
        totalScore: 0,
        lastActiveDate: new Date().toISOString().split('T')[0],
        enableByCoach: newEnableByCoach
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Client ${key} ${enabled ? 'enabled' : 'disabled'} successfully` 
    })
  } catch (error) {
    console.error('Error updating enable by coach:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update client status' },
      { status: 500 }
    )
  }
}
