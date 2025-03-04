import { Kysely, sql } from "kysely";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.createTable("formats")
        .addColumn("id", "serial", col => col.primaryKey())
        .addColumn("display_name", "varchar(255)", col => col.notNull())
        .addColumn("created_at", "timestamp", col => col.defaultTo(sql`now()`)
            .notNull())
        .addColumn("owner_id", "bigint", col => col.notNull()
            .unsigned())
        .addForeignKeyConstraint("FK_formats_owner", ["owner_id"], "users", ["id"])
        .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("formats")
        .execute();
}

export const migration = { up, down };
