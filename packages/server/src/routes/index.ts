import { Request } from "express";

export type PostRequest<T extends {}> = Request<unknown, unknown, T>;
