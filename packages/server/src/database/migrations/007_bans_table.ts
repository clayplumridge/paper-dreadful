import { Kysely } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.createTable("bans")
        .addColumn("id", "serial", col => col.primaryKey())
        .addColumn("format_id", "bigint", col => col.notNull()
            .unsigned())
        .addColumn("card_id", "varchar(36)", col => col.notNull())
        .addColumn("reasoning", "varchar(1000)")
        .addForeignKeyConstraint("FK_bans_card_id", ["card_id"], "cards", ["scryfall_id"])
        .addForeignKeyConstraint("FK_bans_format_id", ["format_id"], "formats", ["id"])
        .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("formats")
        .execute();
}

export const migration = { up, down };
