import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import { Frame } from "./components/frame";
import { CreateDeckView } from "./views/create_deck";
import { DeckView } from "./views/deck";
import { TestView } from "./views/test_view";

function App() {
    return (
        <Frame>
            <BrowserRouter>
                <Routes>
                    <Route element={<TestView />} path="test" />
                    <Route element={<CreateDeckView />} path="deck/create" />
                    <Route element={<DeckView />} path="deck/:id" />
                </Routes>
            </BrowserRouter>
        </Frame>
    );
}

const container = document.getElementById("react-root")!;
const root = createRoot(container);

root.render(<App />);
