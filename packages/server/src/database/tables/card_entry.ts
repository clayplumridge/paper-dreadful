import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Card } from "./card";
import { Deck } from "./deck";

@Entity({ name: "cardentry", schema: process.env.DATABASE_DB_NAME })
export class CardEntry {
    @PrimaryColumn()
    deckId!: number;

    @ManyToOne(() => Deck, deck => deck.cardEntries)
    @JoinColumn({ name: "deckId" })
    deck!: Deck;

    @PrimaryColumn()
    cardId!: number;

    @ManyToOne(() => Card)
    @JoinColumn({ name: "cardId" })
    card!: Card;

    @Column()
    count!: number;
}
