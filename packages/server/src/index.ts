import cookieParser from "cookie-parser";
import express from "express";
import session from "express-session";
import passport from "passport";

import { SAMPLE_DECK } from "@/common/contracts/samples";

import { getSessionStore, runMigrations } from "./database";
import { configure as configureEnv } from "./env";
import { router as authRouter } from "./routes/auth";
import { createCluster } from "./util/cluster";
import { getLogger } from "./util/logger";
import { requestTime } from "./util/logger/timing";
import { requestId } from "./util/logger/tracing";

async function initWorker() {
    configureEnv();

    const app = express();

    app.use(requestId, requestTime);
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));

    // Authn and session middleware
    app.use(
        session({
            secret: process.env.EXPRESS_SESSION_SECRET,
            resave: true,
            saveUninitialized: true,
            store: getSessionStore(),
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    app.use("/auth", authRouter());

    app.get("/deck", (req, res) => {
        res.json(SAMPLE_DECK);
    });

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

