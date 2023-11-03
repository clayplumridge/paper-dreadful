import express from "express";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";

import { createCluster } from "./util/cluster";
import { getLogger } from "./util/logger";
import { requestTime } from "./util/logger/timing";
import { router as authRouter } from "./routes/auth";
import { configure as configureEnv } from "./util/env";
import { SAMPLE_DECK } from "@/common/contracts/samples";

async function initWorker() {
    configureEnv();

    const app = express();

    app.use(requestTime);
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));

    // Authn and session middleware
    app.use(
        session({
            secret: "keyboard cat",
            resave: true,
            saveUninitialized: true
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    app.use("/auth", authRouter());

    app.get("/deck", (req, res) => {
        res.json(SAMPLE_DECK);
    });

    app.listen(process.env.API_SERVER_PORT, () => {
        getLogger("PaperDreadful.Init").info(
            `Server successfully started on port ${process.env.API_SERVER_PORT}`,
            "Listen"
        );
    });
}

// TODO: Remove worker limit once a shared store is setup
void createCluster(initWorker, 1);
