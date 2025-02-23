import SearchIcon from "@mui/icons-material/Search";
import {
    Box,
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
import { useSearchParams } from "react-router";

import { FormatBase, FormatDetailsResponse, FormatSearchResponse } from "@/common/contracts";

import { LoadingPage } from "../components/frame/loading_page";
import { getRestClient } from "../rest_client";

export function CreateDeckView() {
    const [searchParams] = useSearchParams();
    const formatId = Number(searchParams.get("format"));

    if(formatId) {
        return (
            <LoadingPage promises={() => [
                getRestClient()
                    .getFormat(formatId),
            ]}
            >
                {([formatDetailsResponse]) => <CreateDeckPage formatDetails={formatDetailsResponse} />}
            </LoadingPage>
        );
    } else {
        return <CreateDeckPage />;
    }
}

interface CreateDeckPageProps {
    formatDetails?: FormatDetailsResponse;
}

function CreateDeckPage(props: CreateDeckPageProps) {
    return (
        <Box className="flex-column flex-grow">
            <FormatPicker initialFormat={props.formatDetails} />
            <TextField label="Deck Name" />
            <TextField
                label="Cards"
                multiline
                rows={10}
            />
        </Box>
    ); 
}

interface FormatPickerProps {
    initialFormat?: FormatBase;
    onChange?: (format: FormatBase) => void;
}

function FormatPicker(props: FormatPickerProps) {
    const [selectedOption, setSelectedOption] = React.useState<FormatBase | undefined>(props.initialFormat);
    const [searchResponse, setSearchResponse] = React.useState<FormatSearchResponse | undefined>(undefined);
    const searchId = React.useRef<number>(0);

    const doSearch = React.useMemo(
        () =>
            debounce(async (searchString: string) => {
                setSearchResponse(undefined);
                const thisSearchId = searchId.current + 1;
                searchId.current = thisSearchId;

                const result = await getRestClient()
                    .searchFormats(searchString);

                // If a new search was started before this one finished, ignore the result
                if(thisSearchId == searchId.current) {
                    if(selectedOption && !result.find(x => x.formatId === selectedOption?.formatId)) {
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

        const formatBase = searchResponse.find(x => x.formatId === id);

        if(!formatBase) {
            // TODO: Handle error condition
            return;
        }
        setSelectedOption(formatBase);
        props.onChange?.(formatBase);
    }

    React.useEffect(() => {
        doSearch("");
    }, []);

    return (
        <FormControl fullWidth>
            <InputLabel id="format-picker-label">Format</InputLabel>
            <Select
                MenuProps={{ autoFocus: false }}
                label="Format"
                labelId="format-picker-label"
                onChange={e => onChange(e.target.value as number)}
                // This prevents rendering empty string in Select's value
                // if search text would exclude currently selected option.
                renderValue={() => selectedOption?.displayName}
                value={selectedOption?.formatId ?? ""}
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
                {selectedOption && <MenuItem key={"selected"} value={selectedOption.formatId}>{selectedOption.displayName}</MenuItem>}
                {searchResponse
                    ? searchResponse.filter(x => x.formatId !== selectedOption?.formatId)
                        .map((option, i) => <MenuItem key={i} value={option.formatId}>{option.displayName}</MenuItem>)
                    : <LinearProgress />}
            </Select>
        </FormControl>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => any>(func: T, ms: number): (...funcArgs: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    return( ...args: Parameters<T>[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => void func(args), ms);
    };
}
