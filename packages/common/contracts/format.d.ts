export interface FormatDetailsResponse {
    bannedCardNames: string[];
    displayName: string;
    formatId: number;
    owner: {
        id: number;
        displayName: string;
    }
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
