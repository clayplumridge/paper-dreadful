import { Kysely } from "kysely";

import { nonNullKeys } from "../../util/typings";
import { Database, NewCardEntry, NewDeck } from "../schema";

export class DeckRepo {
    constructor(private readonly db: Kysely<Database>) {}

    getCardsById(id: number) {
        return nonNullKeys(
            this.db.selectFrom("decks")
                .where("decks.id", "=", id)
                .leftJoin("cardEntries", "cardEntries.deckId", "deckId")
                .where("cardEntries.deckId", "=", id)
                .leftJoin("cardPrices", join =>
                    join.onRef("cardPrices.cardId", "=", "cardEntries.cardId")
                        .onRef("cardPrices.formatId", "=", "decks.formatId"))
                .leftJoin("cards", "cards.scryfallId", "cardEntries.cardId")
                .select([
                    "cards.displayName",
                    "cardEntries.count",
                    "cardPrices.priceInUsd",
                    "cards.imageUrl",
                    "cards.scryfallUrl",
                    "cards.scryfallId",
                    "cards.type",
                    "cards.manaCost",
                ])
                .execute()
        );
    }

    getSummaryById(id: number) {
        return this.db.selectFrom("decks")
            .where("decks.id", "=", id)
            .leftJoin("users as owners", "owners.id", "decks.ownerId")
            .leftJoin("formats", "formats.id", "decks.formatId")
            .leftJoin("users as formatOwners", "formatOwners.id", "formats.ownerId")
            .select([
                "decks.id",
                "decks.createdAt",
                "decks.displayName",
                "decks.updatedAt",
                "decks.ownerId",
                "owners.displayName as ownerDisplayName",
                "formats.createdAt as formatCreatedAt",
                "formats.displayName as formatDisplayName",
                "formats.id as formatId",
                "formats.ownerId as formatOwnerId",
                "formatOwners.displayName as formatOwnerDisplayName",
            ])
            .executeTakeFirst();
    }

    async create(deck: NewDeck, cards: Omit<NewCardEntry, "deckId">[]) {
        const insertResult = await this.db.insertInto("decks")
            .values(deck)
            .execute();

        const deckId = Number(insertResult[0]?.insertId);
        if(!deckId) {
            // TODO: Handle insert failures gracefully
            return;
        }

        await this.db.insertInto("cardEntries")
            .values(cards.map(x => ({ ...x, deckId })))
            .execute();

        return deckId;
    }

    async checkForBans(formatId: number, scryfallIds: string[]) {
        return await this.db.selectFrom("bans")
            .where("bans.formatId", "=", formatId)
            .where("bans.cardId", "in", scryfallIds)
            .select("bans.cardId as scryfallId")
            .execute();
        
    }
}
