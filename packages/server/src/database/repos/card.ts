import { ScryfallCard } from "@scryfall/api-types";
import { Kysely } from "kysely";

import { getImageUri, parseTypeLine } from "../../scryfall";
import { Card, Database } from "../schema";

export class CardRepo {
    constructor(private readonly db: Kysely<Database>) {}

    async getByDisplayNames(names: string[]) {
        const dbResult = await this.db.selectFrom("cards")
            .where("cards.displayName", "in", names)
            .select(["cards.scryfallId", "cards.displayName"])
            .execute();

        const dbSet = new Set(dbResult.map(x => x.displayName));
            
        return {
            missing: names.filter(x => !dbSet.has(x)),
            result: dbResult,
        };
    }

    async getPrice(cardId: string, formatId: number) {
        return this.db.selectFrom("cardPrices")
            .where("cardPrices.cardId", "=", cardId)
            .where("cardPrices.formatId", "=", formatId)
            .select(["cardPrices.priceInUsd"])
            .executeTakeFirst();
    }

    async getPrices(cardIds: string[], formatId: number) {
        return this.db.selectFrom("cardPrices")
            .where("cardPrices.cardId", "in", cardIds)
            .where("cardPrices.formatId", "=", formatId)
            .select(["cardPrices.cardId", "cardPrices.priceInUsd"])
            .execute();
    }

    async importScryfallOracleCards(cards: ScryfallCard.Any[]) {
        const result = await this.db.insertInto("cards")
            .ignore()
            .values(cards.map(toDatabaseCard))
            .execute();

        return result.reduce((prev, curr) => prev + Number(curr.numInsertedOrUpdatedRows), 0);
    }

    /**
     * Drops any cards that don't have entries in the Database; eg. the base scryfall import
     * isn't done yet but someone created a format and we need to import prices
     */
    async importScryfallCardPricesForFormat(cards: ScryfallCard.Any[], formatId: number) {
        const legalCardIds = new Set((await this.db.selectFrom("cards")
            .select("cards.scryfallId")
            .execute()).map(x => x.scryfallId));

        cards = cards.filter(x => legalCardIds.has(x.id));

        await this.db.insertInto("cardPrices")
            .values(cards
                .filter(x => x.prices.usd != null)
                .map(x => ({
                    cardId: x.id,
                    formatId,
                    priceInUsd: x.prices.usd!,
                })))
            .execute();
    }
}

function toDatabaseCard(card: ScryfallCard.Any): Card {
    return {
        colorIdentity: card.color_identity.join(""),
        displayName: card.name,
        imageUrl: getImageUri(card),
        manaCost: card.mana_cost ?? "",
        scryfallId: card.id,
        scryfallUrl: card.uri,
        type: parseTypeLine(card) ?? "UNKNOWN",
    };
}
