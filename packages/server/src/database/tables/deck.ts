import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CardEntry, Format, User } from "./index";

@Entity({ name: "deck", schema: process.env.DATABASE_DB_NAME })
export class Deck {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Format)
    format!: Format;

    @ManyToOne(() => CardEntry)
    cardEntries!: CardEntry[];

    @ManyToOne(() => User)
    owner!: User;

    @Column()
    name!: string;
}
