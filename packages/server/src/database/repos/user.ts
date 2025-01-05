import { Kysely } from "kysely";

import { Database, NewUser } from "../schema";

export class UserRepo {
    constructor(private readonly db: Kysely<Database>) {}

    byId(id: number) {
        return this.db.selectFrom("users")
            .where("id", "=", id)
            .selectAll()
            .executeTakeFirst();
    }

    byGoogleUserId(googleUserId: string) {
        return this.db.selectFrom("users")
            .where("googleUserId", "=", googleUserId)
            .selectAll()
            .executeTakeFirst();
    }

    async create(user: NewUser) {
        await this.db.insertInto("users")
            .values(user)
            .execute();
        
        // Because this user was just created, we can assert that we'll find it.
        return asDefinedPromise(this.byGoogleUserId(user.googleUserId));
    }
}

function asDefinedPromise<T>(promise: Promise<T | undefined>): Promise<T> {
    return promise as Promise<T>;
}
