import { Kysely } from "kysely";

import { CardRepo } from "./repos/card";
import { DeckRepo } from "./repos/deck";
import { FormatRepo } from "./repos/format";
import { UserRepo } from "./repos/user";
import { Database } from "./schema";

export class DatabaseClient {
    custom = this.db;
    cards = new CardRepo(this.db);
    decks = new DeckRepo(this.db);
    formats = new FormatRepo(this.db);
    users = new UserRepo(this.db);

    constructor(private readonly db: Kysely<Database>) {}
}
