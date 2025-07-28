import express from "express";
import asyncHandler from "express-async-handler";

import { getDatabaseClient } from "../database";
import { PRIVILEGES } from "../database/privileges";
import { getLatestOracleCards } from "../scryfall";
import { getLogger } from "../util/logger";
import { guardWithPrivilege } from "./util/privileges";

export function router() {
    const router = express.Router();
    const logger = getLogger("admin")
        .scope("scryfall-import");

    router.get(
        "/scryfall-import",
        guardWithPrivilege(PRIVILEGES.RUN_SCRYFALL_IMPORT),
        asyncHandler(async (req, res) => {
            logger.info("Starting scryfall import");
            const cards = await getLatestOracleCards();
            logger.info(`Successfully got ${cards.length} cards from scryfall`);
            const numImportedCards = await getDatabaseClient().cards.importScryfallOracleCards(cards);
            logger.info(`Inserted ${numImportedCards} rows from scryfall`);
            res.json({});
        })
    );

    return router;
}
