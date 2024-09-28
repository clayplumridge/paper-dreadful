import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "card", schema: process.env.DATABASE_DB_NAME })
export class Card {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    displayName!: string;

    @Column()
    imageUrl!: string;

    @Column()
    scryfallUrl!: string;
}
