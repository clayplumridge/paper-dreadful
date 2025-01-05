import { Kysely } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.createTable("cards")
        .addColumn("scryfall_id", "varchar(36)", col => col.primaryKey())
        .addColumn("display_name", "varchar(255)", col => col.notNull())
        .addColumn("image_url", "varchar(255)", col => col.notNull())
        .addColumn("scryfall_url", "varchar(255)", col => col.notNull())
        .addColumn("color_identity", "varchar(5)", col => col.notNull())
        .addColumn("mana_cost", "varchar(255)", col => col.notNull())
        .execute();

    await db.schema.createIndex("IDX_cards_card_name")
        .on("cards")
        .column("display_name")
        .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("cards")
        .execute();
}

export const migration = { up, down };
