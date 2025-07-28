import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import { CardPriceResponse, CardPricesResponse } from "@/common/contracts/card";

import { getDatabaseClient } from "../database";
import { getLogger } from "../util/logger";

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
