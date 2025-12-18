// import { drizzle } from 'drizzle-orm/node-postgres';
// import { Pool } from 'pg';
import { schema } from './schema';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL!,
// });

const sql = neon(process.env.DATABASE_URL!);
// export const db = drizzle(pool, { schema });
export const db = drizzle(sql, { schema });
export type Database = typeof db;