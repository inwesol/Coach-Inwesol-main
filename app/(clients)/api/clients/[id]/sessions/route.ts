import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, userSessionFormProgress } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get client information
    const client = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image
      })
      .from(users)
      .where(eq(users.id, params.id))
      .limit(1)

    if (!client.length) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      )
    }

    // Get all sessions for this client
    const sessions = await db
      .select({
        id: userSessionFormProgress.id,
        sessionId: userSessionFormProgress.sessionId,
        formId: userSessionFormProgress.formId,
        status: userSessionFormProgress.status,
        score: userSessionFormProgress.score,
        completedAt: userSessionFormProgress.completedAt,
        updatedAt: userSessionFormProgress.updatedAt,
        insights: userSessionFormProgress.insights
      })
      .from(userSessionFormProgress)
      .where(eq(userSessionFormProgress.userId, params.id))
      .orderBy(userSessionFormProgress.sessionId, userSessionFormProgress.updatedAt)

    return NextResponse.json({
      success: true,
      data: {
        client: client[0],
        sessions
      }
    })
  } catch (error) {
    console.error('Error fetching client sessions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch client sessions' },
      { status: 500 }
    )
  }
}
