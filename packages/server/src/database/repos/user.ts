import { Kysely } from "kysely";

import { Database, NewUser, User } from "../schema";

export class UserRepo {
    constructor(private readonly db: Kysely<Database>) {}

    byId(id: number): Promise<User | undefined> {
        return this.db.selectFrom("user")
            .where("id", "=", id)
            .selectAll()
            .executeTakeFirst();
    }

    byGoogleUserId(googleUserId: string): Promise<User | undefined> {
        return this.db.selectFrom("user")
            .where("googleUserId", "=", googleUserId)
            .selectAll()
            .executeTakeFirst();
    }

    create(user: NewUser) {
        return this.db.insertInto("user")
            .values(user)
            .returningAll()
            .executeTakeFirstOrThrow();
    }
}
