import { Kysely } from "kysely";

import { allConcreteKeys } from "../../util/typings";
import { getDatabaseClient } from "..";
import { Database, NewFormat } from "../schema";

export class FormatRepo {
    constructor(private readonly db: Kysely<Database>) {}

    async getAll() {
        return this.db.selectFrom("formats")
            .selectAll()
            .execute();
    }

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

        const bannedCards = await this.getBans(id);

        return allConcreteKeys({ ...baseDetails, bannedCards });
    }

    async getRecent(num = 10) {
        return this.db.selectFrom("formats")
            .orderBy("formats.createdAt")
            .top(num)
            .execute();
    }

    async getBans(id: number) {
        return await this.db.selectFrom("bans")
            .where("bans.formatId", "=", id)
            .leftJoin("cards", join => join.onRef("bans.cardId", "=", "cards.scryfallId"))
            .leftJoin("cardPrices", join => join.onRef("cardPrices.cardId", "=", "bans.cardId")
                .onRef("cardPrices.formatId", "=", "bans.formatId"))
            .select([
                "cards.displayName",
                "cardPrices.priceInUsd",
                "cards.imageUrl",
                "cards.scryfallUrl",
                "cards.scryfallId",
                "cards.type",
                "cards.manaCost",
            ])
            .execute();
    }

    async search(query: string) {
        return allConcreteKeys(
            await this.db.selectFrom("formats")
                .where("formats.displayName", "like", `%${query}%`)
                .leftJoin("users", join => join.onRef("users.id", "=", "formats.ownerId"))
                .select([
                    "formats.displayName",
                    "formats.createdAt",
                    "formats.id",
                    "users.displayName as ownerDisplayName",
                    "users.id as ownerId",
                ])
                .orderBy("formats.createdAt desc")
                .limit(10)
                .execute()
        );
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
