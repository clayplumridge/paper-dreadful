import { Autocomplete, Box, TextField } from "@mui/material";
import * as React from "react";

import { CardSearchSuccessResponse } from "@/common/contracts/card";
import { debounce } from "@/common/util";
import { Unarray } from "@/common/util/typings";

import { ManaCost } from "../card/mana_cost";
import { PriceDisplay } from "../card/price";

export interface DeckEditorProps {
    cards?: CardElement[];
    formatId?: number;
    onCardAdded?: (card: CardElement, count: number) => void;
}

export function DeckEditor(props: DeckEditorProps) {
    const [card, setCard] = React.useState<CardElement | undefined>();

    const search = (searchText: string) => {
        console.log(searchText, props.formatId);
        return Promise.resolve({ cards: [
            {
                cardId: "123",
                displayName: "Archon of Cruelty",
                imageUrl: "",
                manaCost:"{8}{B}{B}",
                priceInUsd: 1.23,
            },
        ] });
    };

    return (
        <Box flexDirection="column">
            <Row
                card={card}
                count={3}
                onChange={setCard}
                search={search}
            />
        </Box>
    );
}


type CardElement = Unarray<CardSearchSuccessResponse["cards"]>;

interface RowProps {
    card?: CardElement;
    count?: number;
    onChange?: (newCard: CardElement, newCount: number) => void;
    search: (cardName: string) => Promise<CardSearchSuccessResponse>;
}

function Row(props: RowProps) {
    const [inputValue, setInputValue] = React.useState<string>("");
    const [count, setCount] = React.useState<number>(0);
    const [searchResponse, setSearchResponse] = React.useState<CardSearchSuccessResponse | undefined>(undefined);
    const searchId = React.useRef<number>(0);

    const debouncedSearch = React.useMemo(
        () => 
            debounce((cardName: string) => {
                if(cardName === "") {
                    return { cards: [] };
                }
            
                return props.search(cardName);
            }, 400),
        []
    );

    const onInputChange = React.useMemo(() => async (text: string) => {
        setInputValue(text);
        const segments = text.split(" ");
        const count = Number(segments[0]);
        const cardName = segments.slice(isNaN(count) ? 0 : 1)
            .join(" ")
            .trim();

        setSearchResponse(undefined);
        const thisSearchId = searchId.current + 1;
        searchId.current = thisSearchId;

        const result = cardName === "" ? { cards:[] } : await debouncedSearch(cardName);

        // If a new search was started before this one finished, ignore the result
        if(thisSearchId == searchId.current) {
            setSearchResponse(result);
        }
        setCount(isNaN(count) ? 1 : count);
    }, []);

    const onChange = (newVal: CardElement) => {
        props.onChange?.(newVal, count);
    };

    console.log(searchResponse);

    return (
        <Autocomplete
            filterOptions={x => x}
            getOptionLabel={(e => e.displayName)}
            onChange={(ev, newValue) => newValue && onChange(newValue)}
            onInputChange={(ev, newValue) => void onInputChange(newValue)}
            options={searchResponse?.cards ?? []}
            renderInput={params => (
                <TextField
                    {...params}
                    InputProps={
                        {
                            ...params.InputProps,
                            endAdornment:
                            <>
                                {params.InputProps.endAdornment}
                                {
                                    props.card && 
                                <>
                                    <ManaCost manaCost={props.card.manaCost} />
                                    <Box sx={{ marginLeft: "0.25em" }}>
                                        <PriceDisplay card={{...props.card, count}} />
                                    </Box>
                                </>
                                }
                            </>,
                        }
                    }
                    fullWidth
                    value={inputValue}
                    variant="standard"
                />
            )}
        />
    );
}
