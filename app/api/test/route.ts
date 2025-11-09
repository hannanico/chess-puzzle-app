// import { NextResponse } from "next/server";
// import { Pool } from "pg";

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false },
// });

// export async function GET() {
//   try {
//     const client = await pool.connect();
//     const result = await client.query(`
//       SELECT * FROM puzzles
//       ORDER BY RANDOM()
//       LIMIT 20
//     `);
//     client.release();

//     return NextResponse.json(result.rows);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
// Make sure this path is correct. If 'lib' is at your root,
// and 'app' is at your root, this should work.
// If you have path aliases set up (like @/), you can use:
// import { getPuzzles } from '@/lib/puzzles';

// Adjust this relative path based on your structure.
// From app/api/test-db/ it's up 3 levels to the root, then into lib.
import { getPuzzles } from '../../../lib/puzzles';

export async function GET() {
  console.log('--- RUNNING /api/test-db ---');

  try {
    // --- Test 1: Call with default options ---
    console.log('Test 1: Calling getPuzzles({})');
    const defaultPuzzles = await getPuzzles({});

    // --- Test 2: Call with specific options ---
    console.log('Test 2: Calling getPuzzles({ ratingFrom: 1000, ratingTo: 1200, limit: 2 })');
    const specificPuzzles = await getPuzzles({
      ratingFrom: 1000,
      ratingTo: 1200,
      limit: 2,
    });

    console.log('--- TEST SUCCESSFUL ---');
    
    // Send the results back to the browser
    return NextResponse.json({
      test1_defaults: {
        count: defaultPuzzles.length,
        puzzles: defaultPuzzles,
      },
      test2_specific: {
        count: specificPuzzles.length,
        puzzles: specificPuzzles,
      },
    });

  } catch (error) {
    console.error('[API Test Error]', error);
    // Send a detailed error message back
    return NextResponse.json(
      { 
        error: 'Test failed. Check server console.', 
        message: (error as Error).message 
      },
      { status: 500 }
    );
  }
}