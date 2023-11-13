import express from "express";
import passport from "passport";
import { Strategy as GoogleOauthStrategy } from "passport-google-oauth20";

declare global {
    namespace Express {
        interface User {
            id: string;
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
                scope: ["openid"]
            },
            (accessToken, refreshToken, profile, done) => {
                done(null, { id: profile.id });
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        if (typeof id === "string") {
            done(null, { id });
        } else {
            done("Failed to deserialize user: ID is not a string");
        }
    });

    router.get("/login-with-google", passport.authenticate("google"));

    router.get(
        "/login-with-google-callback",
        passport.authenticate("google", {
            successRedirect: "http://localhost:5001/deck",
            failureRedirect: "hell.gov"
        })
    );

    return router;
}
