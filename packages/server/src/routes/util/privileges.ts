import express, {Request, Response} from "express";
import asyncHandler from "express-async-handler";

import { getDatabaseClient } from "../../database";

export function guardWithPrivilege(priv: number): express.RequestHandler {
    return asyncHandler(async (req: Request<unknown>, res: Response<unknown>, next) => {
        const user = req.user;
        if(!user) {
            res.sendStatus(401);
            return;
        }

        const hasPriv = await getDatabaseClient().users.hasPrivilege(user.id, priv);
        if(!hasPriv) {
            res.sendStatus(403);
            return;
        }

        next();
    });
}
