import express from "express";
import { createCluster } from "./util/cluster";
import { getLogger } from "./util/logger";
import { requestTime } from "./util/logger/timing";
import { SAMPLE_DECK } from "@/common/contracts/samples";

const PORT = 5001;

async function initWorker() {
    const app = express();
    app.use(requestTime);

    app.get("/_/debug", (req, res) => {
        res.send("Hello World!");
    });

    app.get("/deck", (req, res) => {
        res.json(SAMPLE_DECK);
    });

    app.listen(PORT, () => {
        getLogger("PaperDreadful.Init").info(
            `Server successfully started on port ${PORT}`,
            "Listen"
        );
    });
}

void createCluster(initWorker);
