import * as fs from 'fs';
import { injectable } from 'inversify';
import Pino from 'pino';
import 'reflect-metadata';
import { ILogger } from './ILogger';

@injectable()
export class FileLogger implements ILogger {
    private pinoLogger: any;

    constructor(filePath: string) {
        
        this.pinoLogger = Pino(fs.createWriteStream(filePath, { flags: 'w' }));
    }

    public info(className: string, method: string, message: string | object) {
        this.pinoLogger.info(`[${className}@${method}] ${JSON.stringify(message)}`);
    }

    public warn(className: string, method: string, message: string | object) {
        this.pinoLogger.warn(`[${className}@${method}] ${JSON.stringify(message)}`);
    }

    public error(className: string, method: string, error: any, message?: string | object) {
        this.pinoLogger.error(`[${className}@${method}] ${JSON.stringify(error)} ${JSON.stringify(message)}`);
    }

    public trace(className: string, method: string, error: Error, message?: string | object): void {
        this.pinoLogger.trace(`[${className}@${method}] ${JSON.stringify(error)} ${JSON.stringify(message)}`);
    }

    public debug(className: string, method: string, error: Error, message?: string | object): void {
        this.pinoLogger.debug(`[${className}@${method}] ${JSON.stringify(error)} ${JSON.stringify(message)}`);
    }

    public fatal(className: string, method: string, error: Error, message?: string | object): void {
        this.pinoLogger.fatal(`[${className}@${method}] ${JSON.stringify(error)} ${JSON.stringify(message)}`);
    }
}
