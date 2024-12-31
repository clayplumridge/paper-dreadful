import { Knex } from "knex";

interface User {
    id: number;
    displayName: string;
    googleUserId: string;
}

export class DatabaseClient {
    user = new UserRepo(this.getKnex);

    constructor(private readonly getKnex: () => Knex) {}
}

class UserRepo {
    constructor(private readonly getKnex: () => Knex) {}

    private query() {
        return this.getKnex()
            .queryBuilder()
            .table('user');
    }

    getById(id: number): Promise<User | undefined> {
        return this.query()
            .where("id", id)
            .first();
    }

    getByGoogleUserId(id: string): Promise<User | undefined> {
        return this.query()
            .where("googleUserId", id)
            .first();
    }

    async create(details: Omit<User, "id">): Promise<User> {
        await this.query()
            .insert(details);
        // Since we just inserted we know it'll retrieve successfully
        return this.getByGoogleUserId(details.googleUserId) as Promise<User>;
    }
}
