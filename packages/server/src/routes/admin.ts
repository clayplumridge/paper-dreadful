import express from "express";
import asyncHandler from "express-async-handler";

import { getDatabaseClient } from "../database";
import { getLatestOracleCards } from "../scryfall";
import { getLogger } from "../util/logger";

export function router() {
    const router = express.Router();
    const logger = getLogger("admin");

    router.get("/scryfall-import", asyncHandler(async (req, res) => {
        logger.info("Starting scryfall import", "scryfall-import");
        const cards = await getLatestOracleCards();
        logger.info(`Successfully got ${cards.length} cards from scryfall`, "scryfall-import");
        const numImportedCards = await getDatabaseClient().cards.importScryfallOracleCards(cards);
        logger.info(`Inserted ${numImportedCards} rows from scryfall`, "scryfall-import");
        res.json({});
    }));

    return router;
}
