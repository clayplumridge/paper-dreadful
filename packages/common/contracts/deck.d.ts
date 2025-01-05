export interface CardCount {
    scryfallId: string;
    displayName: string;
    priceInUsd: number;
    imageUrl: string;
    type: string;
    count: number;
    manaCost: string;
}

export interface DeckDetailsRequest {
    id: number;
}

export interface DeckDetailsResponse {
    id: number;
    cards: CardCount[];
    displayName: string;
    ownerDetails: {
        id: number;
        displayName: string;
    }
}

export interface CreateDeckRequest {
    body: string;
    displayName: string;
    formatId: number;
}

export interface CreateDeckSuccessResponse {
    details: DeckDetailsResponse;
}

export interface CreateDeckFailureResponse {
    bannedCards?: string[];
    missingCards?: string[];
}

export type CreateDeckResponse = CreateDeckSuccessResponse | CreateDeckFailureResponse;
