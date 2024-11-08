import { getDbConnection } from "../../core/db/db";
import { tUser } from "../../core/db/tables/user";

async function readUser(payload: { email: string; passwordHash?: string }): Promise<User> {
  const db = getDbConnection();

  const result = await db
    .selectFrom(tUser)
    .select({
      email: tUser.email,
      name: tUser.name,
    })
    .where(tUser.email.equals(payload.email))
    .executeSelectOne();

  return result;
}

export const UserRepository = { readUser };
