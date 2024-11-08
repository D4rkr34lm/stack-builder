import { hasValue } from "@stack-builder/shared/lib/utils/typeGuards";
import { toNumber } from "lodash";
import { Pool } from "pg";
import { PostgreSqlConnection } from "ts-sql-query/connections/PostgreSqlConnection";
import { PgPoolQueryRunner } from "ts-sql-query/queryRunners/PgPoolQueryRunner";

export class DBConnection extends PostgreSqlConnection<"DBConnection"> {
  allowEmptyString = true;
}

let connection: DBConnection;

export function initDB() {
  const pool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    port: toNumber(process.env.DB_PORT),
    password: process.env.DB_PASSWORD,
  });

  connection = new DBConnection(new PgPoolQueryRunner(pool));
}

export function getDbConnection() {
  if (hasValue(connection)) {
    return connection;
  } else {
    throw "db-not-yet-initialized";
  }
}
