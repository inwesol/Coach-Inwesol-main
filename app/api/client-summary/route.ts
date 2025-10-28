// app/api/client-summary/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create client_summary table if it doesn't exist
async function ensureTableExists(client: any) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS client_summary (
      id SERIAL PRIMARY KEY,
      client_id UUID NOT NULL,
      session_id INTEGER NOT NULL,
      summary TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(client_id, session_id),
      FOREIGN KEY (client_id) REFERENCES "User"(id) ON DELETE CASCADE
    );
  `);

  // Create index for faster queries
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_client_summary_client_session 
    ON client_summary(client_id, session_id);
  `);
}

// GET endpoint - Fetch existing summary
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const clientId = searchParams.get('clientId');
  const sessionId = searchParams.get('sessionId');

  if (!clientId || sessionId === null) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  let dbClient = null;
  try {
    dbClient = await pool.connect();
    await ensureTableExists(dbClient);

    const result = await dbClient.query(
      `SELECT id, client_id, session_id, summary, created_at, updated_at 
       FROM client_summary 
       WHERE client_id = $1 AND session_id = $2`,
      [clientId, parseInt(sessionId, 10)]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: true, data: null, message: 'No summary found' },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch summary' },
      { status: 500 }
    );
  } finally {
    if (dbClient) {
      await dbClient.release();
    }
  }
}

// POST endpoint - Save or update summary
export async function POST(request: NextRequest) {
  let dbClient = null;
  try {
    const body = await request.json();
    const { clientId, sessionId, summary } = body;

    if (!clientId || sessionId === null || !summary) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    dbClient = await pool.connect();
    await ensureTableExists(dbClient);

    // Use UPSERT (INSERT ... ON CONFLICT) to handle both create and update
    const result = await dbClient.query(
      `INSERT INTO client_summary (client_id, session_id, summary, created_at, updated_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT (client_id, session_id)
       DO UPDATE SET 
         summary = $3,
         updated_at = CURRENT_TIMESTAMP
       RETURNING id, client_id, session_id, summary, created_at, updated_at`,
      [clientId, parseInt(sessionId, 10), summary]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Summary saved successfully',
    });
  } catch (error) {
    console.error('Error saving summary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save summary' },
      { status: 500 }
    );
  } finally {
    if (dbClient) {
      await dbClient.release();
    }
  }
}

// DELETE endpoint - Optional: Delete a summary
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const clientId = searchParams.get('clientId');
  const sessionId = searchParams.get('sessionId');

  if (!clientId || sessionId === null) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  let dbClient = null;
  try {
    dbClient = await pool.connect();
    await ensureTableExists(dbClient);

    const result = await dbClient.query(
      `DELETE FROM client_summary 
       WHERE client_id = $1 AND session_id = $2
       RETURNING id`,
      [clientId, parseInt(sessionId, 10)]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Summary not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Summary deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting summary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete summary' },
      { status: 500 }
    );
  } finally {
    if (dbClient) {
      await dbClient.release();
    }
  }
}