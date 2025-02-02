import {
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
} from "@mui/material";
import { styled } from "@mui/system";
import React from "react";

import { CardCount, DeckDetailsResponse } from "@/common/contracts";

import { ManaCost } from "../components/card/mana_cost";
import { PriceDisplay } from "../components/card/price";
import { parseManaCostToCmc, sortByCmc } from "../util/mana";
import { CurveGraph } from "./curve";

export interface DeckViewerProps {
    deckDetails: DeckDetailsResponse;
}

const cardAspectRatio = 1.395;
const cardWidth = 200;
const cardHeight = cardWidth * cardAspectRatio;

const CardDisplay = styled("img")(() => ({
    marginRight: "2em",
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

export const DeckViewer: React.FC<DeckViewerProps> = props => {
    const [currentCardImage, setCurrentCardImage] = React.useState(props.deckDetails.cards[0].imageUrl ?? ".png");

    const groups = groupByCardType(props.deckDetails.cards);

    return (
        <Box className="flex-column">
            <Box className="flex-row flex-grow">
                <CardDisplay src={currentCardImage} />
                <DeckViewerList className="flex-column flex-grow">
                    {
                        Array.from(groups.entries())
                            .map(([header, cards]) =>
                                (
                                    <CardGroup
                                        cards={sortByCmc(cards)}
                                        header={header}
                                        onCardHover={card => setCurrentCardImage(card.imageUrl)}
                                    />
                                ))
                    }
                </DeckViewerList>
            </Box>
            <Box className="flex-row align-center">
                <CurveGraph cards={props.deckDetails.cards} />
            </Box>
        </Box>
    );
};

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

const CardGroup: React.FC<CardGroupProps> = props => {
    const subheaderId = `${props.header}-list-subheader`;

    return (
        <List
            aria-labelledby={subheaderId}
            dense
            subheader={
                <ListSubheader id={subheaderId}>{props.header}</ListSubheader>
            }
            sx={{ maxWidth: "360px" }}
        >
            {props.cards.map(card => <CardRow card={card} onHover={props.onCardHover} />)}
        </List>
    );
};

interface CardRowProps {
    card: CardCount;
    onHover?: (card: CardCount) => void;
}

const CardRow: React.FC<CardRowProps> = props => {
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
};
