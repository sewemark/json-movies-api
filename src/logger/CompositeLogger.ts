import { ILogger } from './ILogger';

export class CompositeLogger implements ILogger {
    private loggers: ILogger[];

    constructor(loggers: ILogger[]) {
        this.loggers = loggers;
    }

    public info(className: string, method: string, message: string | object) {
        this.loggers.forEach((logger: ILogger) => {
            logger.info(className, method, message);
        });
    }

    public warn(className: string, method: string, message: string | object) {
        this.loggers.forEach((logger: ILogger) => {
            logger.warn(className, method, message);
        });
    }

    public error(className: string, method: string, error: any, message?: string | object) {
        this.loggers.forEach((logger: ILogger) => {
            logger.error(className, method, error, message);
        });
    }

    public trace(className: string, method: string, error: Error, message?: string | object): void {
        this.loggers.forEach((logger: ILogger) => {
            logger.trace(className, method, error, message);
        });
    }

    public debug(className: string, method: string, error: Error, message?: string | object): void {
        this.loggers.forEach((logger: ILogger) => {
            logger.debug(className, method, error, message);
        });
    }

    public fatal(className: string, method: string, error: Error, message?: string | object): void {
        this.loggers.forEach((logger: ILogger) => {
            logger.fatal(className, method, error, message);
        });
    }
}