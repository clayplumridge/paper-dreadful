// Disabling promise checks to allow async/await in void functions that use 'done'
// Makes writing handlers for passport way easier
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import passport from "passport";
import { Strategy as GoogleOauthStrategy } from "passport-google-oauth20";

import { getDatabaseClient } from "../database";
import { getLogger } from "../util/logger";

declare global {
    namespace Express {
        interface User {
            id: number;
            displayName: string;
        }
    }
}

export function router() {
    const router = express.Router();

    passport.use(
        new GoogleOauthStrategy(
            {
                clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
                clientSecret: process.env.GOOGLE_OAUTH_SECRET,
                callbackURL:
                    "http://localhost:5001/auth/login-with-google-callback",
                scope: ["openid"],
            },
            async (accessToken, refreshToken, profile, done) => {
                const userRepo = getDatabaseClient().users;
                let user = await userRepo.byGoogleUserId(profile.id);

                if (!user) {
                    user = await userRepo.create({
                        googleUserId: profile.id,
                        displayName: "Yeets McGee",
                    });

                    getLogger("auth")
                        .info(`Created new user with display name ${user.displayName}`, "newuser");
                }

                done(null, { id: user.id, displayName: user.displayName });
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        if (typeof id === "number") {
            const user = await getDatabaseClient()
                .users
                .byId(id);

            if (!user) {
                throw new Error(
                    "Failed to deserialize user; ID not found in database"
                );
            }

            done(null, { id, displayName: user.displayName });
        } else {
            done("Failed to deserialize user: ID is not a number");
        }
    });

    router.get("/login-with-google", passport.authenticate("google"));

    router.get(
        "/login-with-google-callback",
        passport.authenticate("google", {
            successRedirect: "/deck",
            failureRedirect: "hell.gov",
        })
    );

    return router;
}
