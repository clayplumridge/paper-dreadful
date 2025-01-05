import dotenv from "dotenv";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            API_SERVER_PORT: number;
            CLUSTER_SIZE: number;
            CORS_ALLOWED_ORIGIN: string;
            DATABASE_HOST: string;
            DATABASE_PORT: number;
            DATABASE_USERNAME: string;
            DATABASE_PASSWORD: string;
            DATABASE_DB_NAME: string;
            EXPRESS_SESSION_SECRET: string;
            GOOGLE_OAUTH_CLIENT_ID: string;
            GOOGLE_OAUTH_SECRET: string;
        }
    }
}

export function configure() {
    dotenv.config();
}
