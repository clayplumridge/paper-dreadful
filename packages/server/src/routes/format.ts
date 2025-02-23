import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import {
    CreateFormatRequest,
    CreateFormatResponse,
    FormatDetailsRequest,
    FormatDetailsResponse,
    FormatSearchResponse,
} from "@/common/contracts";

import { getDatabaseClient } from "../database";
import { getCardsWithPrices } from "../scryfall";
import { getLogger } from "../util/logger";
import { Unpromise } from "../util/typings";
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

                const details = await getDatabaseClient().formats.getDetailsById(dbResult);
                res.json({ details: dbDetailsToResponse(details) });

                return;
            }

            
            res.json({ missingCardNames: dbResult.missing ?? [] });
        }
    ));

    router.get("/search", asyncHandler(
        async (req: Request<{}, {}, {}, {q: string}>, res: Response<FormatSearchResponse>) => {
            const result = await getDatabaseClient().formats.search(req.query.q);
            res.json(searchResultToResponse(result));
        }
    ));

    router.get("/:id", asyncHandler(
        async (req: Request<FormatDetailsRequest>, res: Response<FormatDetailsResponse>) => {
            const details = await getDatabaseClient().formats.getDetailsById(req.params.id);
            res.json(dbDetailsToResponse(details));
        }
    ));

    return router;
}

type DbDetails = Unpromise<ReturnType<ReturnType<typeof getDatabaseClient>["formats"]["getDetailsById"]>>;
function dbDetailsToResponse(details: DbDetails): FormatDetailsResponse {
    return {
        bannedCards: details.bannedCards,
        displayName: details.displayName,
        formatId: details.id,
        owner: {
            id: details.ownerId,
            displayName: details.ownerDisplayName,
        },
    };
}

type DbSearchResult = Unpromise<ReturnType<ReturnType<typeof getDatabaseClient>["formats"]["search"]>>;
function searchResultToResponse(searchResult: DbSearchResult) {
    return searchResult.map(x => ({
        displayName: x.displayName,
        formatId: x.id,
        owner: {
            id: x.ownerId,
            displayName: x.displayName,
        },
    }));
}
