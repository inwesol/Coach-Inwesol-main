import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { Pool } from "pg"

// Reuse pool in dev to avoid open socket issues
declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined
}

const pool: Pool =
  global.__pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
  })

if (!global.__pgPool) global.__pgPool = pool

export async function GET() {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const email =
      // prefer primaryEmailAddress if available, fall back to first emailAddresses entry or email field
      (user as any).primaryEmailAddress?.emailAddress ||
      (user as any).emailAddresses?.[0]?.emailAddress ||
      (user as any).email ||
      ""

    if (!email) return NextResponse.json({ error: "No email found on user" }, { status: 400 })

    // Read-only SELECT — will not modify existing data
    const res = await pool.query(
      `SELECT mapping_id, user_id, person_id, coach_email, person_data, mapped_at
       FROM mappings
       WHERE coach_email = $1
       ORDER BY mapped_at DESC`,
      [email]
    )

    return NextResponse.json(res.rows)
  } catch (err) {
    console.error("Mappings API error:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}