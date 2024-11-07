import { Table } from "ts-sql-query/Table";
import { DBConnection } from "../db";

export const tDbHistory = new (class TDbHistory extends Table<DBConnection, "tDatabaseHistory"> {
  version = this.column("name", "int");
  migrator = this.column("migrator", "string");
  migrationDate = this.column("migration_date", "localDateTime");
  constructor() {
    super("database_history"); // table name in the database
  }
})();
