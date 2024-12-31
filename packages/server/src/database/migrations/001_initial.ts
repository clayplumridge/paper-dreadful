import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .createTable("user", table => {
            table.increments("id", { primaryKey: true });
            table.string("displayName", 255)
                .notNullable();
            table.string("googleUserId", 255)
                .notNullable();
        } )
        .createTable("card", table => {
            table.increments("id", { primaryKey: true });
            table.string("displayName", 255)
                .notNullable();
            table.string("imageUrl", 255)
                .notNullable();
            table.string("scryfallUrl", 255)
                .notNullable();
        })
        .createTable("format", table => {
            table.increments("id", { primaryKey: true });
        })
        .createTable("cardprice", table => {
            // Columns
            table.integer("cardId")
                .notNullable()
                .unsigned();
            table.integer("formatId")
                .notNullable()
                .unsigned();
            table.decimal("priceInUSD")
                .notNullable();

            // Keys
            table.primary(["cardId", "formatId"]);
            table.foreign("cardId")
                .references("id")
                .inTable("card");
            table.foreign("formatId")
                .references("id")
                .inTable("format");
        })
        .createTable("deck", table => {
            // Columns
            table.increments("id", { primaryKey: true });
            table.string("name", 255)
                .notNullable();
            table.integer("formatId")
                .notNullable()
                .unsigned();
            table.integer("ownerId")
                .notNullable()
                .unsigned();

            // Keys
            table.foreign("formatId")
                .references("id")
                .inTable("format");
            table.foreign("ownerId")
                .references("id")
                .inTable("user");
        })
        .createTable("cardentry", table => {
            // Columns
            table.integer("deckId")
                .notNullable()
                .unsigned();
            table.integer("cardId")
                .notNullable()
                .unsigned();
            table.decimal("count")
                .notNullable();

            // Keys
            table.primary(["deckId", "cardId"]);
            table.foreign("deckId")
                .references("id")
                .inTable("deck");
            table.foreign("cardId")
                .references("id")
                .inTable("card");
        });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("user")
        .dropTableIfExists("card")
        .dropTableIfExists("cardEntry")
        .dropTableIfExists("cardPrice")
        .dropTableIfExists("deck")
        .dropTableIfExists("format");
}
