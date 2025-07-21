import * as React from "react";
import { useParams } from "react-router";

import { DeckDetailsResponse } from "@/common/contracts";

import { DeckViewer } from "../components/deck/viewer";
import { LoadingPage } from "../components/frame/loading_page";
import { getRestClient } from "../rest_client";

export function DeckView() {
    const { id } = useParams();

    return (
        <LoadingPage promises={() => [
            getRestClient()
                .getDeck(Number(id)),
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
