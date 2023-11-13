import axios from "axios";
import { Deck } from "@/common/contracts";

const BASE_API_URL = "http://localhost:5001";
const axiosClient = axios.create({
    baseURL: BASE_API_URL,
    withCredentials: true
});

function getDeck() {
    return axiosClient.get<Deck>("/deck");
}

export const RestApi = {
    getDeck
};
