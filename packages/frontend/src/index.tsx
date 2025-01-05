import axios from "axios";
import * as React from "react";
import { createRoot } from "react-dom/client";

import { CreateDeckRequest, CreateDeckResponse, CreateFormatRequest } from "@/common/contracts";

axios.defaults.withCredentials = true;

const App: React.FC<unknown> = () => {
    const [displayText, setDisplayText] = React.useState<string>("");

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

    return <div>
        <button onClick={() => void createFormat()}>
            Create Format
        </button>
        <button onClick={() => void createDeck()}>
            Create Deck
        </button>
        <button onClick={() => void doLogin()}>
            Login
        </button>
        <div>{displayText}</div>
    </div>;
};

function tryCreateDeck() {
    return axios.post<CreateDeckResponse>("http://localhost:5001/deck/create", {
        body:
            "4 Archon of Cruelty\n" +
            "4 Persist",
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

const container = document.getElementById("react-root")!;
const root = createRoot(container);

root.render(<App />);
