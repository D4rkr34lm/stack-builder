import { Table } from "ts-sql-query/Table";
import { DBConnection } from "../db";

export const tUser = new (class TUser extends Table<DBConnection, "tUser"> {
  email = this.primaryKey("email", "string");
  name = this.column("name", "string");
  password_hash = this.column("password_hash", "string");
  constructor() {
    super("user");
  }
})();
