import * as React from "react";

import { DeckDetailsResponse } from "@/common/contracts";
import { delayPromise } from "@/common/util/promise";

import { DeckViewer } from "../components/deck/viewer";
import { LoadingPage } from "../components/frame/loading_page";
import { getRestClient } from "../rest_client";

export function DeckView() {
    return (
        <LoadingPage promises={() => [
            delayPromise(getRestClient()
                .getDeck(3), 3000),
        ]}
        >
            {([deckResponse]) => <DeckPage deck={deckResponse} />}
        </LoadingPage>
    );
}

interface DeckPageProps {
    deck: DeckDetailsResponse;
}

function DeckPage(props: DeckPageProps) {
    return <DeckViewer deckDetails={props.deck}/>;
}
