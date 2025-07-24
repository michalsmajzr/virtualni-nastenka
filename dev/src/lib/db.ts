import mysql, { Pool } from "mysql2/promise";

/* problém s vytvářením stále nového spojení
viz https://medium.com/@truongtronghai/globalthis-declare-global-and-the-solution-of-singleton-prisma-client-7706a769c9d3 */

declare global {
  var pool: Pool | undefined;
}

export const pool =
  globalThis.pool ||
  mysql.createPool({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "root",
    database: "db",
  });

globalThis.pool = pool;
