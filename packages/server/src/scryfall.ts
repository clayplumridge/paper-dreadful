import { ScryfallCard, ScryfallLayout, ScryfallLayoutLike } from "@scryfall/api-types";
import axios from "axios";

interface BulkDataResponse {
    object: "bulk_data";
    download_uri: string;
}

export async function getLatestOracleCards() {
    const latestBulkData = await axios.get<BulkDataResponse>("https://api.scryfall.com/bulk-data/oracle-cards");
    return (await axios.get<ScryfallCard.Any[]>(latestBulkData.data.download_uri)).data.filter(isUseableCard);
}

export async function getLatestDefaultCards() {
    const latestBulkData = await axios.get<BulkDataResponse>("https://api.scryfall.com/bulk-data/default-cards");
    return (await axios.get<ScryfallCard.Any[]>(latestBulkData.data.download_uri)).data.filter(isUseableCard);
}

const uselessLayouts = new Set<ScryfallLayoutLike>([
    ScryfallLayout.Token, ScryfallLayout.Meld, ScryfallLayout.ArtSeries,
]);
function isUseableCard(card: ScryfallCard.Any) {
    const isUseless = card.digital
        || uselessLayouts.has(card.layout)
        || card.content_warning === true
        || card.set_type == "funny"
        || Object.values(card.legalities)
            .every(x => x === "not_legal")
        || getTypeLine(card)
            .includes("Conspiracy");
    return !isUseless;
}

export async function getCardsWithPrices() {
    const [
        oracleCards,
        pricingInfo,
    ] = await Promise.all([
        getLatestOracleCards(),
        getPricesByOracleId(),
    ]);

    return oracleCards
        .map(card => {
            const lowestPrice = pricingInfo.get(getOracleId(card));
            card.prices.usd = lowestPrice ? `${lowestPrice}` : null;
            return card;
        })
        .filter(x => x.prices.usd !== "Infinity");
}

async function getPricesByOracleId() {
    const defaultCards = await getLatestDefaultCards();

    return defaultCards.reduce((map, card) => {
        const oracleId = getOracleId(card);

        const nonfoilPrice = card.prices.usd ? Number(card.prices.usd) : null;
        const foilPrice = card.prices.usd_foil ? Number(card.prices.usd_foil) : null;
        const etchedPrice = card.prices.usd_etched ? Number(card.prices.usd_etched) : null;
        const possiblePrices = [
            nonfoilPrice, foilPrice, etchedPrice,
        ].filter(x => x !== null);

        const price = Math.min(...possiblePrices);
        const existingPrice = map.get(oracleId);

        if(!price && !existingPrice) {
            map.set(oracleId, null);
        } else if (price && !existingPrice) {
            map.set(oracleId, price);
        } else if (price && existingPrice) {
            map.set(oracleId, Math.min(existingPrice, price));
        }

        return map;
    }, new Map<string, number | null>);
}

function getOracleId(card: ScryfallCard.Any) {
    if(card.layout == ScryfallLayout.ReversibleCard) {
        return card.card_faces[0].oracle_id;
    } else {
        return card.oracle_id;
    }
}

export function getImageUri(card: ScryfallCard.Any): string {
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

const typePriority = [
    "Land",
    "Creature",
    "Planeswalker",
    "Instant",
    "Sorcery",
    "Artifact",
    "Enchantment",
    "Battle",
];
export function parseTypeLine(card: ScryfallCard.Any) {
    const typeLine = getTypeLine(card);
    return typePriority.find(x => typeLine.includes(x));
}

function getTypeLine(card: ScryfallCard.Any) {
    if("card_faces" in card) {
        if(isSingleSideSplit(card)) {
            return card.type_line;
        } else {
            return card.card_faces[0].type_line;
        }
    } else {
        return (card as ScryfallCard.AnySingleFaced).type_line;
    }
}
