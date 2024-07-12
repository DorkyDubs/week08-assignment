import pg from "pg";
export function dbConnect() {
  const connectionString = process.env.NEXT_PUBLIC_db_url;

  const db = new pg.Pool({
    connectionString: connectionString,
  });

  return db;
}
