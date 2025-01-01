import { Kysely, sql } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.createTable("cardentry")
        .addColumn("deckId", "bigint", col => col.notNull()
            .unsigned())
        .addColumn("cardId", "bigint", col => col.notNull()
            .unsigned())
        .addPrimaryKeyConstraint("primary_key", ["deckId", "cardId"])
        .addForeignKeyConstraint("FK_card_entry_deck_id", ["deckId"], "deck", ["id"])
        .addForeignKeyConstraint("FK_card_entry_card_id", ["cardId"], "card", ["id"])
        .addColumn("count", "int2", col => col.notNull())
        .addCheckConstraint("count_one_or_more", sql`count > 0`)
        .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("cardentry")
        .execute();
}

export const migration = { up, down };
