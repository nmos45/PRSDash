import postgres from "postgres";

// Prevent multiple connections in development due to hot reloading
const globalForDb = global as unknown as { conn: postgres.Sql | undefined };

const sql =
  globalForDb.conn ??
  postgres(process.env.DATABASE_URL!, {
    transform: {
      ...postgres.camel,
      undefined: null,
    },
  });

if (process.env.NODE_ENV !== "production") globalForDb.conn = sql;

export default sql;
