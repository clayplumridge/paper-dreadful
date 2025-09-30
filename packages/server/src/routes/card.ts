import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import { CardPriceResponse, CardPricesResponse, CardSearchResponse } from "@/common/contracts/card";

import { getDatabaseClient } from "../database";
import { getLogger } from "../util/logger";

interface SearchQueryParams {
    cardName?: string;
    formatId?: string;
}

interface PriceQueryParams {
    cardId?: string;
    formatId?: string;
}

interface PricesQueryParams {
    cardIds?: string;
    formatId?: string;
}

export function router() {
    const logger = getLogger("card");
    const router = express.Router();

    router.get("/search", asyncHandler(
        async (req: Request<{}, {}, {}, SearchQueryParams>, res: Response<CardSearchResponse>) => {
            const { cardName, formatId } = req.query;
            const formatIdAsNumber = Number(formatId);
            if(!cardName || !formatId) {
                logger.info("Card search missing required query params", "search");
                res.status(400)
                    .send({ errorMessage: "Card search requires a cardName and formatId" });
                return;
            }

            if(isNaN(formatIdAsNumber)) {
                logger.info("Card search formatId did not resolve to number", "search");
                res.status(400)
                    .send({ errorMessage: "Card search formatId did not resolve to number" });
                return;
            }

            const result = await getDatabaseClient().cards.search(cardName, formatIdAsNumber);

            res.json({
                cards: result.map(x => ({
                    cardId: x.scryfallId,
                    displayName: x.displayName,
                    imageUrl: x.imageUrl,
                    manaCost: x.manaCost,
                    priceInUsd: x.priceInUsd,
                })),
            });
        }
    ));

    router.get("/price", asyncHandler(
        async (req: Request<{}, {}, {}, PriceQueryParams>, res: Response<CardPriceResponse>) => {
            const { cardId, formatId } = req.query;
            if(!cardId || !formatId) {
                logger.info("Price requested missing required query params", "price");
                res.status(400)
                    .send({ errorMessage: "Card price requires both cardId and formatId as query parameters" });
                return;
            }

            const result = await getDatabaseClient().cards.getPrice(cardId, Number(formatId));

            if(!result) {
                const message = `Failed to find price for card ${cardId} format ${formatId}`;
                logger.info(message);
                res.status(404)
                    .send({ errorMessage: message });
                return;
            }

            res.json({
                cardId,
                formatId,
                priceInUsd: Number(result.priceInUsd),
            });
        }
    ));

    router.get("/prices", asyncHandler(
        async (req: Request<{}, {}, {}, PricesQueryParams>, res: Response<CardPricesResponse>) => {
            const { cardIds, formatId } = req.query;
            if(!cardIds || !formatId) {
                logger.info("Price requested missing required query params", "price");
                res.status(400)
                    .send({ errorMessage: "Card prices require both cardIds and formatId as query parameters" });
                return;
            }

            const cardIdArray = cardIds.split(",");
            const result = await getDatabaseClient().cards.getPrices(cardIdArray, Number(formatId));

            res.json({
                formatId,
                cards: result.map(x => ({ cardId: x.cardId, priceInUsd: Number(x.priceInUsd) })),
            });
        }
    ));

    return router;
}
