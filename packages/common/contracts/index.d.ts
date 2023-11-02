export interface Card {
    name: string;
    price: number;
    imageUrl: string;
}

export interface CardCount {
    card: Card;
    count: number;
}

export interface Deck {
    cards: CardCount[];
}
