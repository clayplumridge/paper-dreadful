import {
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import React from "react";

import { CardCount, DeckDetailsResponse } from "@/common/contracts";

import { parseManaCostToCmc, sortByCmc } from "../../util/mana";
import { ManaCost } from "../card/mana_cost";
import { PriceDisplay } from "../card/price";
import { CurveGraph } from "./curve";

export interface DeckViewerProps {
    deckDetails: DeckDetailsResponse;
}

const cardAspectRatio = 1.395;
const cardWidth = 250;
const cardHeight = cardWidth * cardAspectRatio;

const CardDisplay = styled("img")(() => ({
    alignSelf: "center",
    objectFit: "contain",
    width: cardWidth,
}));

const DeckViewerList = styled(List)(() => ({
    alignContent: "flex-start",
    maxHeight: cardHeight * 2,
    "> ul": {
        marginRight: "2em",
        minWidth: 400,
    },
}));

export function DeckViewer(props: DeckViewerProps) {
    const [currentCardImage, setCurrentCardImage] = React.useState(props.deckDetails.cards[0].imageUrl ?? ".png");

    const totalPrice = "$" +
        props.deckDetails.cards.reduce((prev, curr) => {
            return prev + curr.count * curr.priceInUsd;
        }, 0)
            .toFixed(2);
    const title = `${props.deckDetails.displayName}`;

    const groups = groupByCardType(props.deckDetails.cards);

    return (
        <Box className="flex-column">
            <Typography variant="h2">{title}</Typography>
            <Box className="flex-row flex-grow">
                <Box className="flex-column">
                    <Typography variant="subtitle1">
                        {totalPrice}
                    </Typography>
                    <CardDisplay src={currentCardImage} />
                    <CurveGraph
                        cards={props.deckDetails.cards}
                        hideLegend
                        width={cardWidth}
                    />
                </Box>
                <DeckViewerList className="flex-column flex-grow">
                    {
                        Array.from(groups.entries())
                            .map(([header, cards]) =>
                                (
                                    <CardGroup
                                        cards={sortByCmc(cards)}
                                        header={header}
                                        key={header}
                                        onCardHover={card => setCurrentCardImage(card.imageUrl)}
                                    />
                                ))
                    }
                </DeckViewerList>
            </Box>
        </Box>
    );
}

interface CardCountWithCmc extends CardCount {
    cmc: number;
}

function groupByCardType(cards: CardCount[]) {
    return cards.reduce((map, card) => {
        let val = map.get(card.type);

        if(!val) {
            val = [];
            map.set(card.type, val);
        }

        val.push({ ...card, cmc: parseManaCostToCmc(card.manaCost) });

        return map;
    }, new Map<string, CardCountWithCmc[]>);
}

interface CardGroupProps {
    header: string;
    cards: CardCount[];
    onCardHover?: (card: CardCount) => void;
}

function CardGroup(props: CardGroupProps) {
    const subheaderId = `${props.header}-list-subheader`;

    return (
        <List
            aria-labelledby={subheaderId}
            dense
            key={subheaderId}
            subheader={
                <ListSubheader id={subheaderId}>{props.header}</ListSubheader>
            }
            sx={{ maxWidth: "360px" }}
        >
            {props.cards.map(card => (
                <CardRow
                    card={card}
                    key={card.displayName}
                    onHover={props.onCardHover}
                />
            ))}
        </List>
    );
}

interface CardRowProps {
    card: CardCount;
    onHover?: (card: CardCount) => void;
}

function CardRow(props: CardRowProps) {
    const {card, onHover} = props;

    return (
        <ListItem slotProps={{
            root: {
                onMouseOver: () => onHover?.(card),
                onTouchStart: () => onHover?.(card),
            },
        }}
        >
            <ListItemIcon>{card.count}</ListItemIcon>
            <ListItemText primary={card.displayName} />
            <ListItemIcon sx={{ justifyContent: "flex-end "}}>
                <ManaCost manaCost={card.manaCost} />
            </ListItemIcon>
            <ListItemIcon sx={{ justifyContent: "flex-end", marginLeft: "0.25em" }}>
                <PriceDisplay card={card} />
            </ListItemIcon>
        </ListItem>
    );
}
