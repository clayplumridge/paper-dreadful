import { Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CardPrice } from "./card_price";

@Entity({ name: "format", schema: process.env.DATABASE_DB_NAME })
export class Format {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToMany(() => CardPrice, cardPrice => cardPrice.format)
    cardPrices!: CardPrice[];
}
