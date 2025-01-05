import { Kysely, sql } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.createTable("card_prices")
        .addColumn("card_id", "varchar(36)", col => col.notNull())
        .addColumn("format_id", "bigint", col => col.notNull()
            .unsigned())
        .addPrimaryKeyConstraint("primary_key", ["card_id", "format_id"])
        .addForeignKeyConstraint("FK_card_prices_card_id", ["card_id"], "cards", ["scryfall_id"])
        .addForeignKeyConstraint("FK_card_prices_format_id", ["format_id"], "formats", ["id"])
        .addColumn("price_in_usd", "decimal(7, 2)", col => col.notNull())
        .addCheckConstraint("price_greater_than_zero", sql`price_in_usd > 0`)
        .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("card_prices")
        .execute();
}

export const migration = { up, down };
