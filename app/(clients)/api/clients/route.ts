import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { coaches, users, journeyProgress } from '@/lib/db/schema'
import { eq, inArray } from 'drizzle-orm'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const coachEmail = searchParams.get('coachEmail')
    
    if (!coachEmail) {
      return NextResponse.json(
        { success: false, error: 'Coach email is required' },
        { status: 400 }
      )
    }

    // Get coach by email
    const coach = await db
      .select({
        clients: coaches.clients,
        sessionLinks: coaches.sessionLinks
      })
      .from(coaches)
      .where(eq(coaches.email, coachEmail))
      .limit(1)

    if (!coach.length || !coach[0].clients || coach[0].clients.length === 0) {
      return NextResponse.json({ 
        success: true, 
        data: [] 
      })
    }

    // Get users for the client IDs using inArray with journey progress
    const clientUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        enableByCoach: journeyProgress.enableByCoach
      })
      .from(users)
      .leftJoin(journeyProgress, eq(users.id, journeyProgress.userId))
      .where(inArray(users.id, coach[0].clients))

    return NextResponse.json({ 
      success: true, 
      data: {
        users: clientUsers,
        sessionLinks: coach[0].sessionLinks
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
