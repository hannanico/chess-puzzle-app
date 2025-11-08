import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT * FROM puzzles
      ORDER BY RANDOM()
      LIMIT 5
    `);
    client.release();

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
  }
}
