import {
    Button,
    Container,
    createTheme,
    CssBaseline,
    ThemeProvider,
} from "@mui/material";
import axios from "axios";
import * as React from "react";
import { createRoot } from "react-dom/client";

import {
    CreateDeckRequest,
    CreateDeckResponse,
    CreateFormatRequest,
    DeckDetailsResponse,
} from "@/common/contracts";

import { DeckViewer } from "./deck/viewer";

axios.defaults.withCredentials = true;

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const App: React.FC<unknown> = () => {
    const [displayText, setDisplayText] = React.useState<string>("");
    const [deckDetails, setDeckDetails] = React.useState<DeckDetailsResponse>();

    async function createDeck() {
        const result = await tryCreateDeck();
        setDisplayText(JSON.stringify(result));
    }

    async function createFormat() {
        const result = await tryCreateFormat();
        setDisplayText(JSON.stringify(result));
    }

    async function doLogin() {
        window.location.href = "http://localhost:5001/auth/login-with-google";
    }

    async function fetchDeck() {
        const result = await tryGetDeck();
        setDeckDetails(result.data);
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Container maxWidth="xl">
                <Button onClick={() => void createFormat()} variant="outlined">
                    Create Format
                </Button>
                <Button onClick={() => void createDeck()} variant="outlined">
                    Create Deck
                </Button>
                <Button onClick={() => void doLogin()} variant="outlined">
                    Login
                </Button>
                <Button onClick={() => void fetchDeck()} variant="outlined">
                    Fetch deck
                </Button>
                <div>{displayText}</div>

                {deckDetails && <DeckViewer deckDetails={deckDetails}/> }
            </Container>
        </ThemeProvider>
    );
};

function tryCreateDeck() {
    return axios.post<CreateDeckResponse>("http://localhost:5001/deck/create", {
        body:
            "4 Archon of Cruelty\n" +
            "4 Persist\n" +
            "4 Monastery Swiftspear\n" +
            "2 Lightning Bolt\n" +
            "4 Mishra's Bauble\n",
        displayName: "The Deckeroni",
        formatId: 1,
    } satisfies CreateDeckRequest);
}

function tryCreateFormat() {
    return axios.post<CreateFormatRequest>("http://localhost:5001/format/create", {
        bannedCardNames: ["Hypergenesis"],
        displayName: "Test Format",
    } satisfies CreateFormatRequest);
}

function tryGetDeck() {
    return axios.get<DeckDetailsResponse>("http://localhost:5001/deck/3");
}

const container = document.getElementById("react-root")!;
const root = createRoot(container);

root.render(<App />);
