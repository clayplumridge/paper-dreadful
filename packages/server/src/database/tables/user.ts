import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "user", schema: process.env.DATABASE_DB_NAME })
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    displayName!: string;

    @Column()
    googleUserId!: string;
}
