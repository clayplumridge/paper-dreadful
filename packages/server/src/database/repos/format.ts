import { Kysely } from "kysely";

import { getDatabaseClient } from "..";
import { Database, NewFormat } from "../schema";

export class FormatRepo {
    constructor(private readonly db: Kysely<Database>) {}

    async getById(id: number) {
        return this.db.selectFrom("formats")
            .where("formats.id", "=", id)
            .selectAll()
            .executeTakeFirst();
    }

    async getDetailsById(id: number) {
        const baseDetails = await this.db.selectFrom("formats")
            .where("formats.id", "=", id)
            .leftJoin("users", join => join.onRef("users.id", "=", "formats.ownerId"))
            .select([
                "formats.displayName",
                "formats.createdAt",
                "formats.id",
                "users.displayName as ownerDisplayName",
                "users.id as ownerId",
            ])
            .executeTakeFirst();

        return { ...baseDetails };
    }

    async create(format: Omit<NewFormat, "id" | "createdAt">, bannedCardNames: string[]) {
        // Validate that cards provided exist and get their IDs
        const { missing, result: bannedCardDetails } = await getDatabaseClient()
            .cards.getByDisplayNames(bannedCardNames);

        if(missing.length > 0) {
            return { missing };
        }

        const insertResult = await this.db.insertInto("formats")
            .values(format)
            .execute();

        const formatId = Number(insertResult[0]?.insertId);
        if(!formatId) {
            // TODO: Handle insert failures gracefully
            return {};
        }

        await this.db.insertInto("bans")
            .values(bannedCardDetails.map(card => ({ cardId: card.scryfallId, formatId })))
            .execute();

        return formatId;
    }
}
