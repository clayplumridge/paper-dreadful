import { Kysely } from "kysely";

import { DeckRepo } from "./repos/deck";
import { UserRepo } from "./repos/user";
import { Database } from "./schema";

export class DatabaseClient {
    custom = this.db;
    decks = new DeckRepo(this.db);
    users = new UserRepo(this.db);

    constructor(private readonly db: Kysely<Database>) {}
}
