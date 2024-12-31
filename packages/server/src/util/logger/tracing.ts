import express from "express";
import { v4 as uuidv4 } from "uuid";

declare global {
    namespace Express {
        interface Request {
            id: string;
        }
    }
}

const HEADER_NAME = "X-Request-Id";
export function requestId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    const id = req.get(HEADER_NAME) ?? uuidv4();
    res.set(HEADER_NAME, id);
    req.id = id;

    next();
}
