import cluster from "cluster";
import { inspect } from "util";

export const enum TraceLevel {
    Debug = "debug",
    Error = "error",
    Info = "info",
    Timing = "timing",
    Warn = "warn",
}

/**
 * Formal spec of a single log; used by auxiliary handlers (eg. writing to logs)
 */
export interface Trace {
    action: string;
    area: string;
    level: TraceLevel;
    nodeClusterId: string;
    payload: unknown;
    timestamp: number;
}

export interface TimingPayload {
    data?: Record<string, unknown>;
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
    startTiming: (data?: Record<string, unknown>, action?: string) => Timing;

    scope: (action: string) => ScopedLogger;
}

export interface Timing {
    addData: (data: Record<string, unknown>) => Timing;
    submit: () => void;
}

/** A Logger that's been scoped to a specific Action. */
export interface ScopedLogger {
    debug: (payload: unknown) => void;
    error: (payload: unknown) => void;
    info: (payload: unknown) => void;
    timing: (payload: TimingPayload) => void;
    warn: (payload: unknown) => void;
    startTiming: (data?: Record<string, unknown>) => Timing;
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

    constructor(private readonly area: string, private readonly traceHandler?: (trace: Trace) => void) {
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

        this.traceHandler?.({
            action,
            area: this.area,
            level: level,
            nodeClusterId,
            payload,
            timestamp,
        });
    }

    public startTiming(data?: Record<string, unknown>, action?: string) {
        const startMs = Date.now();
        const payload: Omit<TimingPayload, "duration" | "end"> = { start: new Date(startMs), data };

        const timing = {
            addData: (newData: Record<string, unknown>) => {
                payload.data = {...(payload.data ?? {}), ...newData };
                return timing;
            },
            submit: () => {
                const endMs = Date.now();
                const duration = endMs - startMs;
                this.timing({...payload, end: new Date(endMs), duration }, action);
            },
        };

        return timing;
    }

    scope(action: string): ScopedLogger {
        return {
            debug: (payload: unknown) => this.debug(payload, action),
            error: (payload: unknown) => this.error(payload, action),
            info: (payload: unknown) => this.info(payload, action),
            timing: (payload: TimingPayload) => this.timing(payload, action),
            warn: (payload: unknown) => this.warn(payload, action),
            startTiming: (data?: Record<string, unknown>) => this.startTiming(data, action),
        };
    }
}
