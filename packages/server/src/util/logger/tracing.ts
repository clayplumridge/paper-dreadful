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
    const oldValue = req.get(HEADER_NAME);
    // Unclear why types here are borked
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const id = oldValue ?? uuidv4();

    res.set(HEADER_NAME, id);
    // Cascading failures from above
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    req.id = id;

    next();
}
