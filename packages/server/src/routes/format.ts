import express, { Response } from "express";
import asyncHandler from "express-async-handler";

import { CreateFormatRequest, CreateFormatResponse } from "@/common/contracts";

import { getDatabaseClient } from "../database";
import { getCardsWithPrices } from "../scryfall";
import { getLogger } from "../util/logger";
import { allConcreteKeys } from "../util/typings";
import { PostRequest } from ".";

export function router() {
    const logger = getLogger("format");
    const router = express.Router();

    router.post("/create", asyncHandler(
        async (req: PostRequest<CreateFormatRequest>, res: Response<CreateFormatResponse>) => {
            const ownerId = req.user?.id;

            if(!ownerId) {
                logger.warn("Could not create format; user not logged in");
                res.sendStatus(401);
                return;
            }

            const { bannedCardNames, displayName } = req.body;

            const dbResult = await getDatabaseClient().formats.create({
                displayName,
                ownerId,
            }, bannedCardNames);

            if(typeof dbResult == "number") {
                const cards = await getCardsWithPrices();
                await getDatabaseClient().cards.importScryfallCardPricesForFormat(cards, dbResult);

                // We can confirm this is defined because we just created it
                const details = await allConcreteKeys(getDatabaseClient().formats.getDetailsById(dbResult));

                res.json({details: {
                    bannedCardNames,
                    displayName: details.displayName,
                    formatId: details.id,
                    owner: {
                        id: details.ownerId,
                        displayName: details.ownerDisplayName,
                    },
                }});

                return;
            }

            
            res.json({ missingCardNames: dbResult.missing ?? [] });
        }
    ));

    return router;
}
