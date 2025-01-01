import { Kysely, sql } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.createTable("card_entries")
        .addColumn("deck_id", "bigint", col => col.notNull()
            .unsigned())
        .addColumn("card_id", "bigint", col => col.notNull()
            .unsigned())
        .addPrimaryKeyConstraint("primary_key", ["deck_id", "card_id"])
        .addForeignKeyConstraint("FK_card_entries_deck_id", ["deck_id"], "decks", ["id"])
        .addForeignKeyConstraint("FK_card_entries_card_id", ["card_id"], "cards", ["id"])
        .addColumn("count", "int2", col => col.notNull())
        .addCheckConstraint("count_one_or_more", sql`count > 0`)
        .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("card_entries")
        .execute();
}

export const migration = { up, down };
