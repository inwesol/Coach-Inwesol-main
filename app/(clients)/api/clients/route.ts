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

    // Handle cases where coach doesn't exist, clients is null, or clients array is empty
    if (!coach.length || !coach[0]) {
      return NextResponse.json({ 
        success: true, 
        data: {
          users: [],
          sessionLinks: null
        } 
      })
    }

    const clientsArray = coach[0].clients
    // Check if clients exists and is an array (handle null/undefined/empty)
    // Must check existence first, then array type, then length
    if (clientsArray == null || !Array.isArray(clientsArray)) {
      return NextResponse.json({ 
        success: true, 
        data: {
          users: [],
          sessionLinks: coach[0].sessionLinks || null
        } 
      })
    }

    // Check if array has at least one element
    if (clientsArray.length === 0) {
      return NextResponse.json({ 
        success: true, 
        data: {
          users: [],
          sessionLinks: coach[0].sessionLinks || null
        } 
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
      .where(inArray(users.id, clientsArray))

    return NextResponse.json({ 
      success: true, 
      data: {
        users: clientUsers,
        sessionLinks: coach[0].sessionLinks || null
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    // Log more details for debugging production issues
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error('Error details:', { errorMessage, errorStack })
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch users',
        // Only include detailed error in development
        ...(process.env.NODE_ENV === 'development' && { details: errorMessage })
      },
      { status: 500 }
    )
  }
}
