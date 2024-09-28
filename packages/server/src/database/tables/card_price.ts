import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Card } from "./card";
import { Format } from "./format";

@Entity({ name: "cardprice", schema: process.env.DATABASE_DB_NAME })
export class CardPrice {
    @PrimaryColumn()
    cardId!: number;

    @ManyToOne(() => Card)
    @JoinColumn({ name: "cardId" })
    card!: Card;

    @PrimaryColumn()
    formatId!: number;

    @ManyToOne(() => Format, format => format.cardPrices)
    @JoinColumn({ name: "formatId" })
    format!: Format;

    @Column()
    priceInUSD!: number;
}
