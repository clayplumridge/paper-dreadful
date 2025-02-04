import axios from "axios";

import { CurrentUserResponse, DeckDetailsResponse } from "@/common/contracts";

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
        const axiosPromise = axios.get<DeckDetailsResponse>(this.getUrl(`/deck/${deckId}`));
        const delayPromise = new Promise<void>(resolve => setTimeout(() => resolve(), 3000));
    
        const [axiosResult] = await Promise.all([axiosPromise, delayPromise]);
        return axiosResult.data;
    }

    async logout() {
        return (await axios.delete<{}>(this.getUrl("/auth/logout"))).data;
    }

    private getUrl(path: string) {
        return `${this.baseUrl}${path}`;
    }
}
