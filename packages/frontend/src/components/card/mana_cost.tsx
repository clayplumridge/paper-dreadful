import { styled } from "@mui/material";
import { Mana } from "@saeris/react-mana";
import React from "react";

import { parseManaCost } from "../../util/mana";

const ManaCostContainer = styled("div")(() => ({
    "> :not(:first-child)": {
        marginLeft: "0.25em",
    },
}));

export interface ManaCostProps {
    manaCost: string;
}

export const ManaCost: React.FC<ManaCostProps> = props => {
    const manaSymbols = parseManaCost(props.manaCost);

    return (
        <ManaCostContainer>
            {manaSymbols.map(symbol => 
                <Mana cost symbol={symbol} />)}
        </ManaCostContainer>
    );
};
