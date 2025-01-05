import {
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
} from "@mui/material";
import { Mana } from "@saeris/react-mana";
import React from "react";

import { CardCount, DeckDetailsResponse } from "@/common/contracts";

export interface DeckViewerProps {
    deckDetails: DeckDetailsResponse;
}

export const DeckViewer: React.FC<DeckViewerProps> = props => {
    const groups = groupByCardType(props.deckDetails.cards);

    return (
        <Box sx={{ flexDirection: "row" }}>
            <List>
                {
                    Array.from(groups.entries())
                        .map(([header, cards]) =>
                            <CardGroup header={header} cards={cards} />)
                }
            </List>
        </Box>
    );
};

function groupByCardType(cards: CardCount[]) {
    return cards.reduce((map, card) => {
        let val = map.get(card.type);

        if(!val) {
            val = [];
            map.set(card.type, val);
        }

        val.push(card);

        return map;
    }, new Map<string, CardCount[]>);
}

interface CardGroupProps {
    header: string;
    cards: CardCount[];
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
            {props.cards.map(CardRow)}
        </List>
    );
};

const CardRow: React.FC<CardCount> = props => {
    return (
        <ListItem>
            <ListItemIcon>{props.count}</ListItemIcon>
            <ListItemText primary={props.displayName} />
            <ListItemIcon>
                <Mana symbol="6" cost />
                <Mana symbol="b" cost />
                <Mana symbol="b" cost />
            </ListItemIcon>
        </ListItem>
    );
};
