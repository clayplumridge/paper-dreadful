import { Kysely } from "kysely";

import { UserRepo } from "./repos/user";
import { Database } from "./schema";

export class DatabaseClient {
    custom = this.db;
    user = new UserRepo(this.db);

    constructor(private readonly db: Kysely<Database>) {}
}
