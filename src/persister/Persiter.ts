import * as fs from 'fs';
import { inject, injectable } from 'inversify';
import { ServerConfig } from '../config/ServerConfig';
import { UnableToAccessDbFileError } from '../errors/UnableToAccessDbFileError';
import { UnableToLoadDbDataError } from '../errors/UnableToLoadDbDataError';
import { UnableToSaveDbDataError } from '../errors/UnableToSaveDbDataError';
import { ILogger } from '../logger/ILogger';
import { Types } from '../Types';
import { IDBSchema } from './IDBSchema';
import { PersiterLock } from './PersiterLock';

export interface IPersiter {
    load(): Promise<IDBSchema>;
    save(dbSchema: IDBSchema): void;
}

@injectable()
export class Persiter implements IPersiter {
    private readonly logger: ILogger;
    private readonly persiterLock: PersiterLock;
    private readonly maxFileAccessRetryCount: number = 5;
    private readonly serverConfig: ServerConfig;

    constructor(
        @inject(Types.Logger) logger: ILogger,
        @inject(Types.PersiterLock) persiterLock: PersiterLock,
        @inject(Types.ServerConfig) serverConfig: ServerConfig,
    ) {
        this.logger = logger;
        this.persiterLock = persiterLock;
        this.serverConfig = serverConfig;
    }

    public async load(): Promise<IDBSchema> {
        try {
            const data = fs.readFileSync(this.serverConfig.databaseFilePath);
            return Promise.resolve(JSON.parse(data.toString()) as IDBSchema);
        } catch (err) {
            this.logger.error('Persiter', 'load', err, 'Cannot load data from db file');
            throw new UnableToLoadDbDataError();
        }
    }

    public save(dbSchema: IDBSchema, retryCount = 0): void {
        try {
            if (!this.canAccessFile(retryCount) || this.persiterLock.locked) {
                this.logger.warn('Persiter', 'save', 'Cannot access file retry in 100ms...');
                setTimeout(() => {
                    this.save(dbSchema, retryCount + 1);
                }, 100);
                return;
            }
            this.persiterLock.lock();
            fs.writeFileSync(this.serverConfig.databaseFilePath, JSON.stringify(dbSchema));
            this.persiterLock.unlock();
        } catch (err) {
            this.logger.error('Persiter', 'load', err, 'Cannot save data to db file');
            throw new UnableToSaveDbDataError();
        }
    }

    private canAccessFile(retryCount: number): boolean {
        try {
            fs.accessSync(this.serverConfig.databaseFilePath);
            return true;
        } catch (err) {
            if (retryCount > this.maxFileAccessRetryCount) {
                this.logger.error('Persiter', 'load', err, 'Cannot lock db file within maximum retry count');
                throw new UnableToAccessDbFileError();
            }
            return false;
        }
    }
}
