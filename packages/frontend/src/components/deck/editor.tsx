import { Box, TextField } from "@mui/material";
import * as React from "react";

import { debounce } from "@/common/util";

import { ManaCost } from "../card/mana_cost";
import { PriceDisplay } from "../card/price";

export function DeckEditor() {
    return (
        <Box flexDirection="column">
            <Row search={async val => {
                console.log(`Searching for ${val}`);
                return { manaCost: "WUBRGGGGGGGGGGG", priceInUsd: 1.23 };
            }}
            />
        </Box>
    );
}

interface RowProps {
    initialSearchResult?: SearchResult;
    initialValue?: string;
    search: (searchText: string) => Promise<SearchResult | undefined>;
}

interface SearchResult {
    manaCost: string;
    priceInUsd: number;
}

function Row(props: RowProps) {
    const [value, setValue] = React.useState(props.initialValue ?? "");
    const [searchResult, setSearchResult] = React.useState<SearchResult | undefined>(props.initialSearchResult);
    const [count, setCount] = React.useState<number>(0);

    const doSearch = React.useMemo(() => debounce(async (text: string) => {
        const segments = text.split(" ");
        const count = Number(segments[0]);
        const cardName = segments.slice(1)
            .join(" ")
            .trim();
            
        const result = await props.search(cardName);
        setSearchResult(result);
        setCount(count);
    }, 400), []);

    function handleChange(newText: string) {
        setValue(newText);
        doSearch(newText);
    }

    return (
        <TextField
            fullWidth
            onChange={e => handleChange(e.target.value)}
            size="small"
            slotProps={{
                input: {
                    endAdornment: searchResult && <>
                        <ManaCost manaCost={searchResult.manaCost} />
                        <Box sx={{ marginLeft: "0.25em" }}>
                            <PriceDisplay card={{...searchResult, count}} />
                        </Box>
                    </>,
                },
            }}
            value={value}
            variant="standard"
        />
    );
}
