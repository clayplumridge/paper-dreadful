import { ScryfallCard } from "@scryfall/api-types";
import axios from "axios";
import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import { getLatestDefaultCards, getLatestOracleCards } from "./scryfall";
import * as TEST_DATA from "./scryfall_test_data";

vi.mock("axios");

const mockAxiosGet = vi.mocked(axios.get);

beforeEach(() => {
    vi.clearAllMocks();
    mockAxiosGet
        .mockResolvedValueOnce({ data: { object: "bulk_data", download_uri: "irrelevant" } });
});


describe.each([
    ["oracle cards", getLatestOracleCards],
    ["default cards", getLatestDefaultCards],
])("%s", (_, fetcher) => {
    it.each([
        ["token cards", TEST_DATA.DemonToken],
        ["meld cards", TEST_DATA.Meld],
        ["art series cards", TEST_DATA.ArtSeries],
        ["content-warning cards", TEST_DATA.ContentWarning],
        ["cards from funny sets", TEST_DATA.FunnySet],
        // TODO: Find a card not legal in any formats
        ["conspiracy cards", TEST_DATA.Conspiracy],
    ] as [string, ScryfallCard.Any][])("filters out %s", async (_, card) => {
        mockAxiosGet.mockResolvedValueOnce({ data: [card] });

        const result = await fetcher();
        expect(result.length)
            .toBe(0);
    });
});
