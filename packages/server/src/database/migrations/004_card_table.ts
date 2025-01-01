import { Kysely } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.createTable("card")
        .addColumn("id", "serial", col => col.primaryKey())
        .addColumn("displayName", "varchar(255)", col => col.notNull())
        .addColumn("imageUrl", "varchar(255)", col => col.notNull())
        .addColumn("scryfallUrl", "varchar(255)", col => col.notNull())
        .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("card")
        .execute();
}

export const migration = { up, down };
