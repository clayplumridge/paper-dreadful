import {
    Box,
    ListItemText,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";
import * as React from "react";
import { useSearchParams } from "react-router";

import { FormatBase, FormatDetailsResponse } from "@/common/contracts";

import { LoadingPage } from "../components/frame/loading_page";
import { SelectSearch } from "../components/select_search";
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
    return (
        <SelectSearch
            initialValue={props.initialFormat}
            onChange={props.onChange}
            renderMenuItem={format =>
                /* Needs to be called as a function, not JSX as Select relies on having direct MenuItem children */
                FormatRow({ format })}
            search={searchText => getRestClient()
                .searchFormats(searchText)}
            valueToDisplayText={x => x.displayName}
            valueToId={x => x.id}
        />
    );
}

interface FormatRowProps {
    format: FormatBase;
}

function FormatRow(props: FormatRowProps) {
    const { format } = props;
    return (
        <MenuItem key={format.id} value={format.id}>
            <ListItemText>{format.displayName}</ListItemText>
            <Typography sx={{ color: "text.secondary" }} variant="body2">
                {new Date(format.createdAt)
                    .toLocaleDateString()}
            </Typography>
        </MenuItem>
    );
}
