import { Kysely } from "kysely";

import { Database } from "../schema";

export class DeckRepo {
    constructor(private readonly db: Kysely<Database>) {}

    getDetailsById(id: number) {
        return this.db.selectFrom("decks")
            .where("decks.id", "=", id)
            .leftJoin("cardEntries", "cardEntries.deckId", "deckId")
            .leftJoin("cardPrices", join => join.onRef("cardPrices.cardId", "=", "cardEntries.cardId")
                .onRef("cardPrices.formatId", "=", "decks.formatId"))
            .leftJoin("cards", "cards.id", "cardEntries.cardId")
            .select([
                "cards.displayName",
                "cardEntries.count",
                "cardPrices.priceInUsd",
                "cards.imageUrl",
                "cards.scryfallUrl",
            ])
            .execute();
    }
}
