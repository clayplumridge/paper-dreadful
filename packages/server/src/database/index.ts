import MySqlStoreCreator from "express-mysql-session";
import * as session from "express-session";
import { knex } from "knex";
import * as mysql2 from "mysql2/promise";

import { DatabaseClient } from "./client";
import * as config from "./knexfile";

function memo<T>(func: () => T): () => T {
    let memoVal: T | undefined;

    return () => {
        if(!memoVal) {
            memoVal = func();
        }
        return memoVal;
    }
}

const getDatabaseConnection = memo(() =>  {
    return mysql2.createPool({
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        database: process.env.DATABASE_DB_NAME,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
    }) as mysql2.Connection;
});

export const getDatabaseClient = memo(() => {
    return new DatabaseClient(() => knex<{}, unknown[]>(config));
});

const StoreTemplate = MySqlStoreCreator(session);
export const getSessionStore = memo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new StoreTemplate({}, getDatabaseConnection() as any) as session.Store; 
})
