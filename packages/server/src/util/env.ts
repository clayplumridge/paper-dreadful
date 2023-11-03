import dotenv from "dotenv";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            API_SERVER_PORT: number;
            GOOGLE_OAUTH_CLIENT_ID: string;
            GOOGLE_OAUTH_SECRET: string;
        }
    }
}

export function configure() {
    dotenv.config();
}
