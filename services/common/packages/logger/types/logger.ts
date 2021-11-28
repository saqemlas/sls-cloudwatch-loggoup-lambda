import {Logger} from 'winston';

export interface Log {
    debug: (msg: string, data?: Record<string, unknown> | undefined) => Logger;
    info: (msg: string, data?: Record<string, unknown> | undefined) => Logger;
    warn: (msg: string, data?: Record<string, unknown> | undefined) => Logger;
    error: (msg: string, data?: Record<string, unknown> | undefined) => Logger;
    winston: Logger;
}

export interface LoggingOptions {
    utilLogsLevel?: string;
}
