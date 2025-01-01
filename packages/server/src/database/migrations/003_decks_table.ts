import { Kysely, sql } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.createTable("decks")
        .addColumn("id", "serial", col => col.primaryKey())
        .addColumn("format_id", "bigint", col => col.notNull()
            .unsigned())
        .addColumn("owner_id", "bigint", col => col.notNull()
            .unsigned())
        .addForeignKeyConstraint("FK_decks_format_id", ["format_id"], "formats", ["id"])
        .addForeignKeyConstraint("FK_decks_owner_id", ["owner_id"], "users", ["id"])
        .addColumn("display_name", "varchar(255)", col => col.notNull())
        .addColumn("created_at", "timestamp", col => col.defaultTo(sql`now()`)
            .notNull())
        .addColumn("updated_at", "timestamp", col => col.defaultTo(sql`now()`)
            .notNull())
        .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("decks")
        .execute();
}

export const migration = { up, down };
