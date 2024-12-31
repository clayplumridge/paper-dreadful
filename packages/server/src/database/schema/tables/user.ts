import { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface UserTable {
    id: Generated<number>;
    displayName: string;
    googleUserId: string;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
