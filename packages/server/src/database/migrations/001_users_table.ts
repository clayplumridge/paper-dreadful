import { Kysely, sql } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.createTable("users")
        .addColumn("id", "serial", col => col.primaryKey())
        .addColumn("display_name", "varchar(255)", col => col.notNull())
        .addColumn("google_user_id", "varchar(255)", col => col.notNull())
        .addColumn("created_at", "timestamp", col => col.defaultTo(sql`now()`)
            .notNull())
        .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("users")
        .execute();
}

export const migration = { up, down };
