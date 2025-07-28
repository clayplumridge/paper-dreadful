import { styled } from "@mui/material";
import { Mana } from "@saeris/react-mana";
import React from "react";

import { parseManaCost } from "../../util/mana";

const ManaCostContainer = styled("div")(() => ({
    "> :not(:first-child)": {
        marginLeft: "0.25em",
    },
    display: "flex",
    flexGrow: 1,
    justifyContent: "flex-end",
}));

export interface ManaCostProps {
    manaCost: string;
}

export function ManaCost(props: ManaCostProps) {
    const manaSymbols = parseManaCost(props.manaCost);

    return (
        <ManaCostContainer>
            {manaSymbols.map((symbol, idx) => (
                <Mana
                    cost
                    key={idx}
                    symbol={symbol}
                />
            ))}
        </ManaCostContainer>
    );
}
