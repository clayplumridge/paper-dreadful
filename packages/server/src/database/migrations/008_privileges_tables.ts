import { Kysely } from "kysely";

import { PRIVILEGES } from "../privileges";
import { Database, NewPrivilege } from "../schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.createTable("privileges")
        .addColumn("id", "serial", col => col.primaryKey())
        .addColumn("display_name", "varchar(255)", col => col.notNull())
        .execute();

    await db.schema.createTable("user_privileges")
        .addColumn("user_id", "bigint", col => col.notNull()
            .unsigned())
        .addColumn("privilege_id", "bigint", col => col.notNull()
            .unsigned())
        .addPrimaryKeyConstraint("primary_key", ["user_id", "privilege_id"])
        .addForeignKeyConstraint("FK_user_privileges_user_id", ["user_id"], "users", ["id"])
        .addForeignKeyConstraint("FK_user_privileges_privilege_id", ["privilege_id"], "privileges", ["id"])
        .execute();

    const castDb = db as Kysely<Database>;
    await castDb.insertInto("privileges")
        .ignore()
        .values(Object.entries(PRIVILEGES)
            .map(toDbPrivilege))
        .execute();
}

function toDbPrivilege([displayName, id]: [string, number]): NewPrivilege {
    return { id, displayName };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("user_privileges")
        .execute();
    await db.schema.dropTable("privileges")
        .execute();
}

export const migration = { up, down };
