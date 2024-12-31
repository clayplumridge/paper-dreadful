/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* Disabled because knex doesn't see our env.ts file with the type descriptors, so it can't coalsece to number. */
import dotenv from "dotenv";
import { Knex } from "knex";

// Uses path relative to this file
dotenv.config({ path: "../../.env" });

const config: Knex.Config = {
    client: "mysql2",
    connection: {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT as unknown as number,
        database: process.env.DATABASE_DB_NAME,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
    },
    migrations: {
        directory: "./migrations",
    },
};

module.exports = config;
