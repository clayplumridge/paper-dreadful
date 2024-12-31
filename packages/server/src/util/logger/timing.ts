import express from "express";

import { getLogger } from ".";

export function requestTime(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    const requestTime = Date.now();

    res.on("finish", () => {
        const endTime = Date.now();
        const duration = endTime - requestTime;

        getLogger("Express.Request")
            .timing(
                {
                    duration,
                    end: new Date(endTime),
                    route: req.url,
                    start: new Date(requestTime),
                    requestId: req.id,
                },
                "Timing"
            );
    });

    next();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withTiming<T extends (...args: any[]) => any>(
    func: T,
    area: string,
    action?: string
): (...funcArgs: Parameters<T>) => ReturnType<T> {
    return (...args: Parameters<T>): ReturnType<T> => {
        const start = Date.now();
        const result = func(args) as ReturnType<T>;
        const end = Date.now();
        const duration = end - start;

        getLogger(area)
            .timing(
                {
                    duration,
                    end: new Date(end),
                    start: new Date(start),
                },
                action
            );

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return result;
    };
}
