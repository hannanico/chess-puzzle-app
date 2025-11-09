import { NextResponse } from 'next/server';
import { getPuzzles } from '../../../../lib/puzzles';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const fromParam = searchParams.get('from');
  const toParam = searchParams.get('to');

  const ratingFrom = fromParam ? parseInt(fromParam, 10) : undefined;
  const ratingTo = toParam ? parseInt(toParam, 10) : undefined;

  if (
    (fromParam && isNaN(ratingFrom as number)) ||
    (toParam && isNaN(ratingTo as number))
  ) {
    return NextResponse.json(
      { error: "Invalid 'from' or 'to' parameter. Must be a number." },
      { status: 400 }
    );
  }

  try {
    const puzzles = await getPuzzles({
      ratingFrom: ratingFrom,
      ratingTo: ratingTo,
      limit: 10,
    });

    if (puzzles.length === 0) {
      return NextResponse.json(
        { error: 'No puzzle found in that rating range' },
        { status: 404 }
      );
    }

    return NextResponse.json(puzzles);
  } catch (error) {
    console.error('[API /byRating Error]', error);
    return NextResponse.json(
      { error: 'Database query failed' },
      { status: 500 }
    );
  }
}