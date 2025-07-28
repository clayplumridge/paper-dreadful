import { Kysely } from "kysely";

import { DEFAULT_PRIVILEGES } from "../privileges";
import { Database, NewUser } from "../schema";

export class UserRepo {
    constructor(private readonly db: Kysely<Database>) {}

    async byId(id: number) {
        const base = await this.db.selectFrom("users")
            .where("id", "=", id)
            .selectAll()
            .executeTakeFirst();

        // TODO: Make priv attachment more generic
        if(!base) {
            return undefined;
        }

        return { ...base, privileges: await this.getPrivileges(id) };
    }

    async byGoogleUserId(googleUserId: string) {
        const base = await this.db.selectFrom("users")
            .where("googleUserId", "=", googleUserId)
            .selectAll()
            .executeTakeFirst();

        // TODO: Make priv attachment more generic
        if(!base) {
            return undefined;
        }

        return { ...base, privileges: await this.getPrivileges(base.id) };
    }

    async getPrivileges(id: number) {
        return (
            await this.db.selectFrom("userPrivileges")
                .where("userId", "=", id)
                .select("privilegeId")
                .execute()
        ).map(x => x.privilegeId);
    }

    async hasPrivilege(userId: number, privilegeId: number) {
        const results = await this.db.selectFrom("userPrivileges")
            .where("userId", "=", userId)
            .where("privilegeId", "=", privilegeId)
            .selectAll()
            .executeTakeFirst();

        return results !== undefined;
    }

    async create(user: NewUser) {
        const result = await this.db.insertInto("users")
            .values(user)
            .execute();

        const userId = Number(result[0].insertId);

        await this.db.insertInto("userPrivileges")
            .values(Array.from(DEFAULT_PRIVILEGES.values())
                .map(x => ({ userId, privilegeId: x })))
            .execute();
        
        // Because this user was just created, we can assert that we'll find it.
        return asDefinedPromise(this.byGoogleUserId(user.googleUserId));
    }
}

function asDefinedPromise<T>(promise: Promise<T | undefined>): Promise<T> {
    return promise as Promise<T>;
}
