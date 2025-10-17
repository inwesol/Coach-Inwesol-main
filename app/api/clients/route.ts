import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const client = await pool.connect();
    
    // Get all coaches with their clients and session progress
    const result = await client.query(`
      WITH client_data AS (
        SELECT 
          c.id as coach_id,
          c.name as coach_name,
          c.email as coach_email,
          c.clients,
          trim(client_uuid) as client_uuid
        FROM 
          coaches c,
          unnest(string_to_array(c.clients, ',')) as client_uuid
      ),
      max_sessions AS (
        SELECT 
          user_id,
          MAX(session_id) as max_session_id
        FROM 
          user_session_form_progress
        GROUP BY 
          user_id
      )
      SELECT 
        cd.coach_id,
        cd.coach_name,
        cd.coach_email,
        cd.clients,
        u.id as user_id,
        u.name as user_name,
        u.email as user_email,
        u.image as user_image,
        u.email_verified as user_email_verified,
        u.created_at as user_created_at,
        u.updated_at as user_updated_at,
        ms.max_session_id as session_id
      FROM 
        client_data cd
      LEFT JOIN 
        "User" u ON u.id::text = cd.client_uuid
      LEFT JOIN
        max_sessions ms ON ms.user_id = u.id
      ORDER BY 
        cd.coach_name, u.name
    `);
    
    await client.release();
    
    // Group clients by coach
    const coachesMap = new Map();
    
    result.rows.forEach(row => {
      if (!coachesMap.has(row.coach_id)) {
        coachesMap.set(row.coach_id, {
          id: row.coach_id,
          name: row.coach_name,
          email: row.coach_email,
          clients: []
        });
      }
      
      // Add client if exists
      if (row.user_id) {
        coachesMap.get(row.coach_id).clients.push({
          id: row.user_id,
          name: row.user_name,
          email: row.user_email,
          image: row.user_image,
          email_verified: row.user_email_verified,
          created_at: row.user_created_at,
          updated_at: row.user_updated_at,
          session_id: row.session_id
        });
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      data: Array.from(coachesMap.values()) 
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}