import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Deck } from "./index";

@Entity({ name: "user", schema: process.env.DATABASE_DB_NAME })
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    displayName!: string;

    @Column()
    googleUserId!: string;

    @OneToMany(() => Deck, deck => deck.owner)
    decks!: Deck[];
}
