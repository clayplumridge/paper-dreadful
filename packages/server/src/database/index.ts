import { DataSource } from "typeorm";
import { getLogger } from "../util/logger";
import { Card, CardEntry, CardPrice, Deck, Format, User } from "./tables";
import { dbLogger } from "./logger";

let dataSource: DataSource;
export async function initializeDatabaseConnection() {
    if (!dataSource) {
        dataSource = new DataSource({
            type: "mysql",
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT,
            database: process.env.DATABASE_DB_NAME,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            logging: true,
            logger: dbLogger(),
            synchronize: true,
            entities: [CardEntry, CardPrice, Card, Deck, Format, User]
        });

        await dataSource.initialize();
        getLogger("Database").debug("Database initialized successfully");
    }
}

export function getDatabaseClient() {
    if (!dataSource) {
        throw new Error(
            "Unable to get Database Client; connection not yet initialized. " +
                "Did you remember to call initializeDatabaseConnection() during express startup?"
        );
    }

    return {
        user() {
            return dataSource.getRepository(User);
        }
    };
}
