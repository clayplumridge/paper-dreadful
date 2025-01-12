import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import {
    CreateDeckRequest,
    CreateDeckResponse,
    DeckDetailsRequest,
    DeckDetailsResponse,
} from "@/common/contracts";

import { getDatabaseClient } from "../database";
import { getLogger } from "../util/logger";
import { nonNullKeys } from "../util/typings";
import { PostRequest } from ".";

export function router() {
    const router = express.Router();
    const logger = getLogger("deck");

    router.get("/:id", asyncHandler(
        async (req: Request<DeckDetailsRequest>, res: Response<DeckDetailsResponse>) => {
            const deckDetails = await getDeckDetailsResponse(req.params.id);

            if(typeof deckDetails === "number") {
                res.sendStatus(deckDetails);
                return;
            }

            res.json(deckDetails);
        }
    ));

    router.post("/create", asyncHandler(
        async (req: PostRequest<CreateDeckRequest>, res: Response<CreateDeckResponse>) => {
            const ownerId = req.user?.id;

            if(!ownerId) {
                res.sendStatus(401);
                return;
            }

            // Parsing and validation
            const {body, displayName, formatId} = req.body;
            const cards = parseDeckBody(body);
            const {
                missing: missingCards,
                result: cardDetails,
            } = await getDatabaseClient().cards.getByDisplayNames(cards.map(x => x.cardName));

            const bannedCardIds = await getDatabaseClient().decks.checkForBans(
                formatId,
                cardDetails.map(x => x.scryfallId)
            );

            if(missingCards.length != 0 || bannedCardIds.length != 0) {
                const idToNameMap = cardDetails.reduce((prev, curr) => {
                    prev.set(curr.scryfallId, curr.displayName);
                    return prev;
                }, new Map<string, string>);

                res.json({
                    missingCards: missingCards.length > 0
                        ? missingCards
                        : undefined,
                    bannedCards: bannedCardIds.length > 0
                        ? bannedCardIds.map(x => idToNameMap.get(x.scryfallId)!)
                        : undefined,
                });
                return;
            }

            const nameToDetailsMap = cardDetails.reduce((prev, curr) => {
                prev.set(curr.displayName, curr);
                return prev;
            }, new Map<string, typeof cardDetails[0]>);

            // Actually doing the insert
            const newDeckId = await getDatabaseClient().decks.create(
                { displayName, ownerId, formatId },
                cards.map(
                    x => ({ cardId: nameToDetailsMap.get(x.cardName)!.scryfallId, count: x.count })
                )
            );

            if(!newDeckId) {
                res.status(500);
                return;
            }

            logger.info(`Successfully created new deck ID ${newDeckId}`);

            // Deck was just created so we can assert that it's there
            res.json({ details: await getDeckDetailsResponse(newDeckId) as DeckDetailsResponse });
        }
    ));

    return router;
}

async function getDeckDetailsResponse(deckId: number): Promise<DeckDetailsResponse | number> {
    const deckRepo = getDatabaseClient().decks;
    const [summary, cards] = await Promise.all([
        deckRepo.getSummaryById(deckId),
        nonNullKeys(deckRepo.getCardsById(deckId)),
    ]);

    if(!summary) {
        return 404;
    }

    const displayName = summary.displayName;
    const userDisplayName = summary.ownerDisplayName;
    if(!displayName || !userDisplayName) {
        return 500;
    }

    return {
        id: deckId,
        displayName: displayName,
        cards: cards.map(x => {
            return {
                scryfallId: x.scryfallId,
                count: x.count,
                displayName: x.displayName,
                priceInUsd: Number(x.priceInUsd),
                imageUrl: x.imageUrl,
                type: x.type,
                manaCost: x.manaCost,
            };
        }),
        ownerDetails: {
            id: summary.ownerId,
            displayName: userDisplayName,
        },
    };
}

function parseDeckBody(body: string) {
    const rows = body.split("\n");
    return rows.map(row => row.split(" "))
        .filter(row => row.length > 0)
        .map(row => {
            // Filtered out length == 0 before this step
            const count = Number(row.shift()!);
            const cardName = row.join(" ");
            return { cardName, count };
        })
        // Safety check against accidental empty strings
        .filter(cardCount => cardCount.cardName.length != 0);
}
