import { UserTable } from "./tables/user";

export * from "./tables/user";

export interface Database {
    user: UserTable;
}
