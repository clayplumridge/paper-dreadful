import cookieParser from "cookie-parser";
import cors from "cors";
import express, { RequestHandler } from "express";
import session from "express-session";
import passport from "passport";

import { getSessionStore, runMigrations } from "./database";
import { configure as configureEnv } from "./env";
import {
    adminRouter,
    authRouter,
    deckRouter,
    formatRouter,
} from "./routes";
import { createCluster } from "./util/cluster";
import { getLogger } from "./util/logger";
import { requestTime } from "./util/logger/timing";
import { requestId } from "./util/logger/tracing";

async function initWorker() {
    configureEnv();

    const app = express();

    app.use(requestId, requestTime);
    app.use(cors({ credentials: true, origin: process.env.CORS_ALLOWED_ORIGIN }));
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // Authn and session middleware
    app.use(
        session({
            secret: process.env.EXPRESS_SESSION_SECRET,
            resave: true,
            saveUninitialized: true,
            store: getSessionStore(),
        }) as express.RequestHandler
    );
    app.use(passport.initialize() as RequestHandler);
    app.use(passport.session());

    app.use("/admin", adminRouter());
    app.use("/auth", authRouter());
    app.use("/deck", deckRouter());
    app.use("/format", formatRouter());

    app.listen(process.env.API_SERVER_PORT, () => {
        getLogger("init")
            .info(
                `Server successfully started on port ${process.env.API_SERVER_PORT}`,
                "listen"
            );
    });
}

configureEnv();
runMigrations()
    .then(() => createCluster(initWorker, process.env.CLUSTER_SIZE))
    .catch(() => process.exit(1));

