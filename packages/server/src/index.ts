import express from "express";
import { createCluster } from "./util/cluster";
import { getLogger } from "./util/logger";
import { requestTime } from "./util/logger/timing";

async function initWorker() {
    const PORT = 5001;

    const app = express();
    app.use(requestTime);
    app.get("/_/debug", (req, res) => {
        res.send("Hello World!");
    });

    app.listen(PORT, () => {
        getLogger("PaperDreadful.Init").info(
            `Server successfully started on port ${PORT}`,
            "Listen"
        );
    });
}

void createCluster(initWorker);
