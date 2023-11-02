import { Card, Deck } from ".";

export const CARDS = {
    brainstorm: {
        name: "Brainstorm",
        price: 2.0,
        imageUrl:
            "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmtgrocks.com%2Fwp-content%2Fuploads%2F2021%2F03%2Fsta-13-brainstorm.jpg&f=1&nofb=1&ipt=39a7c5934178d5bf062adbef7777973a7bd1532715a8f72959e2ccbe0e390be4&ipo=images"
    },
    lightningBolt: {
        name: "Lightning Bolt",
        price: 1.0,
        imageUrl:
            "https://cards.scryfall.io/large/front/e/3/e3285e6b-3e79-4d7c-bf96-d920f973b122.jpg?1562442158"
    }
} satisfies Record<string, Card>;

export const SAMPLE_DECK: Deck = {
    cards: [
        { card: CARDS.brainstorm, count: 4 },
        { card: CARDS.lightningBolt, count: 4 }
    ]
};
