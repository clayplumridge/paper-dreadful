import SearchIcon from "@mui/icons-material/Search";
import {
    FormControl,
    InputAdornment,
    InputLabel,
    LinearProgress,
    ListSubheader,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import * as React from "react";

import { debounce } from "@/common/util";

interface SelectSearchProps<T> {
    initialValue?: T;
    onChange?: (newValue: T) => void;
    renderMenuItem?: (value: T) => React.ReactNode;
    search: (searchText: string) => Promise<T[]>;
    valueToDisplayText: (val: T) => string;
    valueToId: (val: T) => string | number;
}

export function SelectSearch<T>(props: SelectSearchProps<T>) {
    const { valueToDisplayText, valueToId } = props;
    const [selectedOption, setSelectedOption] = React.useState<T | undefined>(props.initialValue);
    const [searchResponse, setSearchResponse] = React.useState<T[] | undefined>(undefined);
    const searchId = React.useRef<number>(0);

    const doSearch = React.useMemo(
        () =>
            debounce(async (searchString: string) => {
                setSearchResponse(undefined);
                const thisSearchId = searchId.current + 1;
                searchId.current = thisSearchId;

                const result = await props.search(searchString);

                // If a new search was started before this one finished, ignore the result
                if(thisSearchId == searchId.current) {
                    const selectedId = selectedOption && valueToId(selectedOption);
                    if(selectedOption && !result.find(x => valueToId(x) === selectedId)) {
                        result.unshift(selectedOption);
                    }
                    setSearchResponse(result);
                }
            }, 200),
        []
    );

    function onChange(id: number | null) {
        if(!searchResponse) {
            // TODO: Handle error conditions
            return;
        }

        const newSelectedOption = searchResponse.find(x => valueToId(x) === id);

        if(!newSelectedOption) {
            // TODO: Handle error condition
            return;
        }
        setSelectedOption(newSelectedOption);
        props.onChange?.(newSelectedOption);
    }

    React.useEffect(() => {
        doSearch("");
    }, []);

    const selectedId = selectedOption && valueToId(selectedOption);

    function renderMenuItem(item: T) {
        return props.renderMenuItem ? props.renderMenuItem(item) : <MenuItem key={valueToId(item)} value={valueToId(item)}>{valueToDisplayText(item)}</MenuItem>;
    }

    return (
        <FormControl fullWidth>
            <InputLabel id="select-label">Format</InputLabel>
            <Select
                MenuProps={{ autoFocus: false }}
                label="Format"
                labelId="select-label"
                onChange={e => onChange(e.target.value as number)}
                // This prevents rendering empty string in Select's value
                // if search text would exclude currently selected option.
                renderValue={() => selectedOption && valueToDisplayText(selectedOption)}
                value={selectedId ?? ""}
            >
                {/* TextField is put into ListSubheader so that it doesn't
              act as a selectable item in the menu
              i.e. we can click the TextField without triggering any selection.*/}
                <ListSubheader>
                    <TextField
                        autoFocus
                        fullWidth
                        onChange={e => doSearch(e.target.value)}
                        onKeyDown={e => {
                            if(e.key !== "Escape") {
                            // Prevents autoselecting item while typing (default Select behaviour)
                                e.stopPropagation();
                            }
                        }}
                        placeholder="Type to search..."
                        size="small"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}}
                    />
                </ListSubheader>

                { /* Always include the selected value if there is one, even if we're loading new values */}
                {selectedOption && renderMenuItem(selectedOption)}
                {searchResponse
                    ? searchResponse.filter(x => valueToId(x) !== selectedId)
                        .map(option => renderMenuItem(option))
                    : <LinearProgress />}
            </Select>
        </FormControl>
    );
}
