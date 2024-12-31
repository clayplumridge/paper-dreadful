import { Kysely, sql } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.createTable("user")
        .addColumn("id", "serial", col => col.primaryKey())
        .addColumn("displayName", "varchar(255)", col => col.notNull())
        .addColumn("googleUserId", "varchar(255)", col => col.notNull())
        .addColumn("created_at", "timestamp", col => col.defaultTo(sql`now()`)
            .notNull())
        .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("user")
        .execute();
}

export const migration = { up, down };
