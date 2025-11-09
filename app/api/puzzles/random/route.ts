import { NextResponse } from 'next/server';
import { getPuzzles } from '../../../../lib/puzzles';

export async function GET() {
  try {
    const puzzles = await getPuzzles({
      limit: 10,
    });

    if (puzzles.length === 0) {
      return NextResponse.json({ error: 'No puzzle found' }, { status: 404 });
    }

    return NextResponse.json(puzzles);
  } catch (error) {
    console.error('[API /random Error]', error);
    return NextResponse.json(
      { error: 'Database query failed' },
      { status: 500 }
    );
  }
}