import "reflect-metadata";
import { DataSource } from "typeorm";
import { getLogger } from "../util/logger";
import { User } from "./tables/user";
import { dbLogger } from "./logger";

let dataSource: DataSource;
export async function initializeDatabaseConnection() {
    if (!dataSource) {
        dataSource = new DataSource({
            type: "mysql",
            host: "localhost",
            port: process.env.DATABASE_PORT,
            database: process.env.DATABASE_DB_NAME,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            logging: true,
            logger: dbLogger(),
            synchronize: true,
            entities: [User]
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
