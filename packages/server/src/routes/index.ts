import { Request } from "express";

export type PostRequest<T extends {}> = Request<unknown, unknown, T>;

export { router as adminRouter } from "./admin";
export { router as authRouter } from "./auth";
export { router as deckRouter } from "./deck";
export { router as formatRouter } from "./format";
