import axios from "axios";

import {
    CurrentUserResponse,
    DeckDetailsResponse,
    FormatDetailsResponse,
    FormatSearchResponse,
} from "@/common/contracts";

axios.defaults.withCredentials = true;

let memoClient: RestClient | undefined;
export function getRestClient() {
    memoClient ??= new RestClient("http://localhost:5001");
    return memoClient;
}

class RestClient {
    constructor(private readonly baseUrl: string) {}

    async getCurrentUser() {
        return (await axios.get<CurrentUserResponse>(this.getUrl("/auth/current"))).data;
    }

    async getDeck(deckId: number) {
        return (await axios.get<DeckDetailsResponse>(this.getUrl(`/deck/${deckId}`))).data;
    }

    async getFormat(formatId: number) {
        return (await axios.get<FormatDetailsResponse>(this.getUrl(`/format/${formatId}`))).data;
    }

    async logout() {
        return (await axios.delete<{}>(this.getUrl("/auth/logout"))).data;
    }

    async searchFormats(searchString: string) {
        return (await axios.get<FormatSearchResponse>(this.getUrl(`/format/search?q=${searchString}`))).data;
    }

    private getUrl(path: string) {
        return `${this.baseUrl}${path}`;
    }
}
