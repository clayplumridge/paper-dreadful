import { Kysely, sql } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.createTable("cardPrice")
        .addColumn("cardId", "bigint", col => col.notNull()
            .unsigned())
        .addColumn("formatId", "bigint", col => col.notNull()
            .unsigned())
        .addPrimaryKeyConstraint("primary_key", ["formatId", "cardId"])
        .addForeignKeyConstraint("FK_card_price_card_id", ["cardId"], "card", ["id"])
        .addForeignKeyConstraint("FK_card_price_format_id", ["formatId"], "format", ["id"])
        .addColumn("priceInUSD", "integer", col => col.notNull())
        .addCheckConstraint("price_greater_than_zero", sql`priceInUSD > 0`)
        .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("cardPrice")
        .execute();
}

export const migration = { up, down };
