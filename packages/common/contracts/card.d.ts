import { ErrorResponse } from "./common";

export interface CardPriceSuccessResponse {
    cardId: string;
    formatId: string;
    priceInUsd: number;
}

export type CardPriceResponse = CardPriceSuccessResponse | ErrorResponse;

export interface CardPricesSuccessResponse {
    formatId: string;
    cards: {
        cardId: string;
        priceInUsd: number;
    }[];
}

export type CardPricesResponse = CardPricesSuccessResponse | ErrorResponse;
