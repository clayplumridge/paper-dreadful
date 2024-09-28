import { Logger } from "typeorm";
import { getLogger } from "../util/logger";

export function dbLogger(): Logger {
    const internalLogger = getLogger("Database");

    return {
        logQuery(query, parameters) {
            internalLogger.debug({ query, parameters }, "Query");
        },
        logQueryError(error, query, parameters) {
            internalLogger.error({ error, query, parameters }, "QueryError");
        },
        logQuerySlow(time, query, parameters) {
            internalLogger.warn({ time, query, parameters }, "QuerySlow");
        },
        logSchemaBuild(message) {
            internalLogger.info({ message }, "SchemaBuild");
        },
        logMigration(message) {
            internalLogger.info({ message }, "Migration");
        },
        log(level, message) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const payload = { message };

            switch (level) {
                case "log":
                    internalLogger.debug(payload, "Log");
                    break;
                case "info":
                    internalLogger.info(payload, "Log");
                    break;
                case "warn":
                    internalLogger.warn(payload, "Log");
                    break;
            }
        }
    };
}
