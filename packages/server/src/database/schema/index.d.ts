import { Insertable, Selectable, Updateable } from "kysely";

import {
    Ban as SchemaBan,
    Card as SchemaCard,
    CardEntry as SchemaCardEntry,
    CardPrice as SchemaCardPrice,
    DB as Database,
    Deck as SchemaDeck,
    Format as SchemaFormat,
    User as SchemaUser,
} from "./schema_gen";

export {Database};

export type Card = Selectable<SchemaCard>;
export type NewCard = Insertable<SchemaCard>;
export type CardUpdate = Updateable<SchemaCard>;

export type CardEntry = Selectable<SchemaCardEntry>;
export type NewCardEntry = Insertable<SchemaCardEntry>;
export type CardEntryUpdate = Updateable<SchemaCardEntry>;

export type CardPrice = Selectable<SchemaCardPrice>;
export type NewCardPrice = Insertable<SchemaCardPrice>;
export type CardPriceUpdate = Updateable<CardPrice>;

export type Deck = Selectable<SchemaDeck>;
export type NewDeck = Insertable<SchemaDeck>;
export type DeckUpdate = Updateable<SchemaDeck>;

export type Format = Selectable<SchemaFormat>;
export type NewFormat = Insertable<SchemaFormat>;
export type FormatUpdate = Updateable<SchemaFormat>;

export type User = Selectable<SchemaUser>;
export type NewUser = Insertable<SchemaUser>;
export type UserUpdate = Updateable<SchemaUser>;

export type Ban = Selectable<SchemaBan>;
export type NewBan = Insertable<SchemaBan>;
