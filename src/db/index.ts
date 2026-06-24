import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const poolConnection = mysql.createPool(
  process.env.DATABASE_URL || "mysql://root:root@127.0.0.1:3306/belajar_vibe_coding"
);

export const db = drizzle({ client: poolConnection, schema, mode: "default" });
export * from "./schema";
