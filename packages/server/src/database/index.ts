import cluster from "cluster";
import MySqlStoreCreator from "express-mysql-session";
import * as session from "express-session";
import { promises as fs } from "fs";
import {
    CamelCasePlugin,
    FileMigrationProvider,
    Kysely,
    Migrator,
    MysqlDialect,
} from "kysely";
import * as mysql2 from "mysql2";
import * as path from "path";
import { inspect } from "util";

import { getLogger } from "../util/logger";
import { DatabaseClient } from "./client";
import { DB } from "./schema/schema_gen";

export { DatabaseClient };

function memo<T>(func: () => T): () => T {
    let memoVal: T | undefined;

    return () => {
        if(!memoVal) {
            memoVal = func();
        }
        return memoVal;
    };
}

const getDatabaseConnection = memo(() =>  {
    getLogger("database")
        .info("Creating database connection pool", "pool");
    return mysql2.createPool({
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        database: process.env.DATABASE_DB_NAME,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
    });
});

const getDatabaseDialect = memo(() => {
    getLogger("database")
        .info("Creating database dialect", "dialect");
    return new MysqlDialect({pool: async () => getDatabaseConnection()});
});

const getKysely = memo(() => {
    getLogger("database")
        .info("Creating Kysely instance", "kysely");
    return new Kysely<DB>({dialect: getDatabaseDialect(), plugins: [new CamelCasePlugin({})] });
});

export const getDatabaseClient = memo(() => {
    return new DatabaseClient(getKysely());
});

const StoreTemplate = MySqlStoreCreator(session);
export const getSessionStore = memo(() => {
    getLogger("database")
        .info("Creating session store", "session");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new StoreTemplate({}, getDatabaseConnection() as any) as session.Store; 
});

export async function runMigrations() {
    if(!cluster.isPrimary) {
        return;
    }

    const logger = getLogger("database");
    logger.info("Starting db migration", "migration");

    const db = getKysely();
    const migrationFolder = path.join(__dirname, "migrations");
    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
            fs,
            path,
            migrationFolder,
        }),
    });

    logger.info(`Running migrator against ${migrationFolder}`, "migration");
    const { error, results } = await migrator.migrateToLatest();
    logger.info("Migrator complete", "migration");
    results?.forEach(it => {
        if(it.status =="Success") {
            logger.info(`Successfully executed migration ${it.migrationName}`, "migration");
        } else if(it.status == "Error") {
            logger.error(`Failed to execute migration ${it.migrationName}`, "migration");
        }
    });

    if(error) {
        await db.destroy();
        logger.error(`Database migration failed with error ${inspect(error)}`, "migration");
        throw new Error("Database migration failed");
    }
}
