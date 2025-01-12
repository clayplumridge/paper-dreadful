import {
    Box,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Tooltip,
} from "@mui/material";
import { Mana } from "@saeris/react-mana";
import React from "react";

import { CardCount, DeckDetailsResponse } from "@/common/contracts";

import { parseManaCost, parseManaCostToCmc, sortByCmc } from "../util/mana";
import { CurveGraph } from "./curve";

export interface DeckViewerProps {
    deckDetails: DeckDetailsResponse;
}

export const DeckViewer: React.FC<DeckViewerProps> = props => {
    const [currentCardImage, setCurrentCardImage] = React.useState(props.deckDetails.cards[0].imageUrl ?? ".png");

    const groups = groupByCardType(props.deckDetails.cards);

    return (
        <Box className="flex-column">
            <Box className="flex-row flex-grow">
                <img className="hovered-card" src={currentCardImage} />
                <List className="flex-column flex-grow deck-viewer-list">
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
                </List>
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
    const manaSymbols = parseManaCost(card.manaCost);

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
            <ListItemIcon className="manacost-container" sx={{ justifyContent: "flex-end" }}>
                {manaSymbols.map(symbol => 
                    <Mana cost symbol={symbol} />)}
            </ListItemIcon>
            <ListItemIcon sx={{ justifyContent: "flex-end", justifySelf: "flex-end", marginLeft: "0.25em" }}>
                <Tooltip title={`${card.count} @ $${card.priceInUsd.toFixed(2)}`}>
                    <Chip
                        label={`$${(card.priceInUsd * card.count).toFixed(2)}`}
                        size="small"
                        variant="outlined"
                    />
                </Tooltip>
            </ListItemIcon>
        </ListItem>
    );
};
