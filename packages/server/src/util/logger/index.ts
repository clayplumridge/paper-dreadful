import cluster from "cluster";
import { inspect } from "util";

export const enum TraceLevel {
    Debug = "debug",
    Error = "error",
    Info = "info",
    Timing = "timing",
    Warn = "warn",
}

export interface Trace {
    action: string;
    area: string;
    level: TraceLevel;
    nodeClusterId: string;
    payload: unknown;
    timestamp: number;
}

export interface TimingPayload {
    [extraProps: string]: unknown;
    duration: number;
    end: Date;
    start: Date;
}

export interface Logger {
    debug: (payload: unknown, action?: string) => void;
    error: (payload: unknown, action?: string) => void;
    info: (payload: unknown, action?: string) => void;
    timing: (payload: TimingPayload, action?: string) => void;
    warn: (payload: unknown, action?: string) => void;
}

const memoizedLoggers: Record<string, Logger> = {};
export function getLogger(area: string): Logger {
    if (!memoizedLoggers[area]) {
        memoizedLoggers[area] = new LoggerImpl(area);
    }
    return memoizedLoggers[area];
}

const consoleLogMap: Record<TraceLevel, (message: string) => void> = {
    debug: console.log,
    error: console.error,
    info: console.log,
    timing: console.log,
    warn: console.warn,
};

class LoggerImpl implements Logger {
    private readonly allowedActions: Set<string> | undefined;

    constructor(private readonly area: string) {
        const allowedActionsConfigValue =
            process.env[`LOGGER_ALLOWED_ACTIONS_FOR_AREA_${area}`];

        if (allowedActionsConfigValue) {
            this.allowedActions = new Set(
                allowedActionsConfigValue.split(",")
                    .map(x => x.toLowerCase())
            );
        }
    }

    public debug = (payload: unknown, action?: string) =>
        this.trace(TraceLevel.Debug, action, payload);
    public info = (payload: unknown, action?: string) =>
        this.trace(TraceLevel.Info, action, payload);
    public timing = (payload: TimingPayload, action?: string) =>
        this.trace(TraceLevel.Timing, action, payload);
    public warn = (payload: unknown, action?: string) =>
        this.trace(TraceLevel.Warn, action, payload);
    public error = (payload: unknown, action?: string) =>
        this.trace(TraceLevel.Error, action, payload);

    private trace(
        level: TraceLevel,
        action: string | undefined,
        payload: unknown
    ) {
        const timestamp = Date.now();
        const nodeClusterId = cluster.isPrimary
            ? "primary"
            : `worker-${cluster.worker?.id}`;

        action = action ?? "log";

        if (
            this.allowedActions &&
            !this.allowedActions.has(action.toLowerCase())
        ) {
            return;
        }

        // Using inspect instead of JSON.stringify because inspect doesn't throw on circular references, just handles them
        consoleLogMap[level](
            `[${new Date(
                timestamp
            )
                .toLocaleString()}][${level}][${nodeClusterId}][${
                this.area
            }][${action}] ${inspect(payload)}`
        );
    }
}
