import { Kysely, sql } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.createTable("deck")
        .addColumn("id", "serial", col => col.primaryKey())
        .addColumn("formatId", "bigint", col => col.notNull()
            .unsigned())
        .addColumn("ownerId", "bigint", col => col.notNull()
            .unsigned())
        .addForeignKeyConstraint("FK_deck_format_id", ["formatId"], "format", ["id"])
        .addForeignKeyConstraint("FK_deck_owner_id", ["ownerId"], "user", ["id"])
        .addColumn("displayName", "varchar(255)", col => col.notNull())
        .addColumn("createdAt", "timestamp", col => col.defaultTo(sql`now()`)
            .notNull())
        .addColumn("updatedAt", "timestamp", col => col.defaultTo(sql`now()`)
            .notNull())
        .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("deck")
        .execute();
}

export const migration = { up, down };
