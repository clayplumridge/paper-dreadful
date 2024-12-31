import cluster from "cluster";
import os from "os";

import { getLogger } from "../logger";

export async function createCluster(
    initWorker: () => Promise<void>,
    workers?: number
) {
    const logger = getLogger("cluster");

    if (cluster.isPrimary) {
        logger.info(`Primary process ${process.pid} started`);

        workers = workers ?? os.cpus().length;
        logger.info(`Creating a Node cluster with ${workers} workers`);
        for (let i = 0; i < workers; i++) {
            cluster.fork();
        }

        cluster.on("exit", worker => {
            logger.info(`Worker ${worker.id} died; replacing`);
            cluster.fork();
        });
    } else {
        await initWorker();
        logger.info(
            `Successfully started worker ${cluster.worker?.id ?? "unknown"}`
        );
    }
}
