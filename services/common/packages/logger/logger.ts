import {createLogger, format, Logger, transports} from 'winston';
import {Context} from 'aws-lambda';
import {Log, LoggingOptions} from './types/logger';
import {EnvironmentVars} from '../environmentVars';

declare const process: EnvironmentVars;

const baseLogger: Logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.IS_LOCAL ? format.combine(format.colorize(), format.align(), format.simple()) : format.json(),
    transports: [
        new transports.Console(),
    ],
});

const wrapLogger = (logger: Logger): Log => ({
    debug: (msg: string, data?: Record<string, unknown>): Logger => logger.debug(msg, {data}),
    info: (msg: string, data?: Record<string, unknown>): Logger => logger.info(msg, {data}),
    warn: (msg: string, data?: Record<string, unknown>): Logger => logger.warn(msg, {data}),
    error: (msg: string, data?: Record<string, unknown>): Logger => logger.error(msg, {data}),
    winston: logger,
});

export const setupLogger = (context?: Context, options?: LoggingOptions): void => {
    baseLogger.defaultMeta = {requestId: context?.awsRequestId};

    if (options?.utilLogsLevel) {
        baseLogger.level = options.utilLogsLevel;
    }
};

export const logger: Log = wrapLogger(baseLogger.child({}));
