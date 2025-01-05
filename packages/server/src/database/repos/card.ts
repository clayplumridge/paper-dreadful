import { ScryfallCard, ScryfallLayout } from "@scryfall/api-types";
import { Kysely } from "kysely";

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

    async importScryfallOracleCards(cards: ScryfallCard.Any[]) {
        const result = await this.db.insertInto("cards")
            .ignore()
            .values(cards.map(toDatabaseCard))
            .execute();

        return result.reduce((prev, curr) => prev + Number(curr.numInsertedOrUpdatedRows), 0);
    }

    async importScryfallCardPricesForFormat(cards: ScryfallCard.Any[], formatId: number) {
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
    };
}

function getImageUri(card: ScryfallCard.Any): string {
    if("card_faces" in card) {
        if(isSingleSideSplit(card)) {
            return card.image_uris?.png ?? "about:blank";
        } else {
            return card.card_faces[0].image_uris?.png ?? "about:blank";
        }
    } else {
        return (card as ScryfallCard.AnySingleFaced).image_uris?.png ?? "about:blank";
    }
}

function isSingleSideSplit(card: ScryfallCard.Any): card is ScryfallCard.AnySingleSidedSplit {
    return card.layout === ScryfallLayout.Split || card.layout === ScryfallLayout.Flip || card.layout === ScryfallLayout.Adventure;
}
