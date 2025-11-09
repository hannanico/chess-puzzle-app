import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

export interface Puzzle {
    id: number;
    fen: string;
    moves: string;
    rating: number;
}

export interface GetPuzzlesOptions{
    limit?: number;
    ratingFrom?: number;
    ratingTo?: number;
}

export async function getPuzzles(
    options:GetPuzzlesOptions):Promise<Puzzle[]> {
        const {
            limit = 20,
            ratingFrom = 0,
            ratingTo = 3350,    
        } = options;

        const query = `
        SELECT id, fen, moves, rating FROM puzzles
        WHERE rating >= $1 AND rating <= $2
        ORDER BY RANDOM()
        LIMIT $3
        `;

        const params: any[] = [ratingFrom, ratingTo, limit];

        console.log(`[lib/puzzles] Executing query: ${query.replace(/\s+/g, ' ').trim()}`);
        console.log(`[lib/puzzles] With params: ${JSON.stringify(params)}`);

        let client;
        try {
            client = await pool.connect();
            const result = await client.query(query, params);
            return result.rows as Puzzle[];
        } catch (error) {
            console.error('[lib/puzzles] Error executing query:', error);
            throw new Error('Database query failed');
        } finally {
            if (client) {
            client.release();
            console.log('[lib/puzzles] Database client released.');
        }
    }
}