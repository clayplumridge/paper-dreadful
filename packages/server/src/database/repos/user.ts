import { Kysely } from "kysely";

import { Database, NewUser, User } from "../schema";

export class UserRepo {
    constructor(private readonly db: Kysely<Database>) {}

    byId(id: number): Promise<User | undefined> {
        return this.db.selectFrom("users")
            .where("id", "=", id)
            .selectAll()
            .executeTakeFirst();
    }

    byGoogleUserId(googleUserId: string): Promise<User | undefined> {
        return this.db.selectFrom("users")
            .where("googleUserId", "=", googleUserId)
            .selectAll()
            .executeTakeFirst();
    }

    async create(user: NewUser): Promise<User> {
        await this.db.insertInto("users")
            .values(user)
            .execute();
        
        // Because this user was just created, we can assert that we'll find it.
        return this.byGoogleUserId(user.googleUserId) as Promise<User>;
    }
}
