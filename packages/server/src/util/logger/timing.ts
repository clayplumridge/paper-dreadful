import express from "express";

import { getLogger } from ".";

export function requestTime(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    const timing = getLogger("express.request")
        .startTiming(
            {
                requestId: req.id,
                method: req.method,
                route: (req.baseUrl ?? "") + req.path,
            }
        );

    res.on("finish", () => {
        timing.addData({ responseCode: res.statusCode });
        timing.submit();
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
        const timing = getLogger(area)
            .startTiming(undefined, action);
            
        const result = func(args) as ReturnType<T>;

        timing.submit();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return result;
    };
}
