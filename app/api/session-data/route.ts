import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const table = searchParams.get('table');
    const columns = searchParams.get('columns');

    if (!userId || !table || !columns) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: userId, table, or columns' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      const columnArray = columns.split(',').map(col => col.trim());
      
      // Build the SELECT clause
      const selectClause = columnArray.join(', ');
      
      // Query the specified table
      const query = `
        SELECT ${selectClause}
        FROM ${table}
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 1
      `;
      
      const result = await client.query(query, [userId]);
      
      if (result.rows.length === 0) {
        return NextResponse.json({
          success: true,
          data: { message: 'No data found for this user' }
        });
      }
      
      // Format the response data
      const data = result.rows[0];
      const formattedData: { [key: string]: any } = {};
      
      columnArray.forEach(col => {
        formattedData[col] = data[col];
      });
      
      return NextResponse.json({
        success: true,
        data: formattedData
      });
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Error fetching session data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch session data' 
      },
      { status: 500 }
    );
  }
}