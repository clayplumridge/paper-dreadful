import { Chip, Tooltip } from "@mui/material";
import React from "react";

import { CardCount } from "@/common/contracts";

interface PriceDisplayProps {
    card: CardCount;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = props => {
    const {card} = props;

    return (
        <Tooltip title={`${card.count} @ $${card.priceInUsd.toFixed(2)}`}>
            <Chip
                label={`$${(card.priceInUsd * card.count).toFixed(2)}`}
                size="small"
                variant="outlined"
            />
        </Tooltip>
    );
};
