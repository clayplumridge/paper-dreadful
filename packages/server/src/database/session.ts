import * as session from "express-session";
import MySqlStoreCreator from "express-mysql-session";
import * as mysql2 from "mysql2/promise";

const StoreTemplate = MySqlStoreCreator(session);

export function createSessionStore(): session.Store {
    const connection = mysql2.createPool({
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        database: process.env.DATABASE_DB_NAME,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new StoreTemplate({}, connection as any);
}
