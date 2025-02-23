export interface FormatBase {
    /** Epoch ms */
    createdAt: number;
    displayName: string;
    id: number;
    owner: {
        id: number;
        displayName: string;
    }
}

export interface FormatDetailsRequest {
    id: number;
}

export interface FormatDetailsResponse extends FormatBase {
    bannedCards: {}[];
}

export interface CreateFormatRequest {
    bannedCardNames: string[]
    displayName: string;
}

export interface CreateFormatSuccessResponse {
    details: FormatDetailsResponse;
}

export interface CreateFormatFailureResponse {
    missingCardNames: string[];
}

export type CreateFormatResponse = CreateFormatSuccessResponse | CreateFormatFailureResponse;

export type FormatSearchResponse = FormatBase[];
