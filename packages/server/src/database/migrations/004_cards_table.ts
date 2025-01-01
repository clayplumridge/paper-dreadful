import { Kysely } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.createTable("cards")
        .addColumn("id", "serial", col => col.primaryKey())
        .addColumn("display_name", "varchar(255)", col => col.notNull())
        .addColumn("image_url", "varchar(255)", col => col.notNull())
        .addColumn("scryfall_url", "varchar(255)", col => col.notNull())
        .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("cards")
        .execute();
}

export const migration = { up, down };
