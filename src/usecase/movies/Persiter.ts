import * as fs from 'fs';
import { inject, injectable } from 'inversify';
import * as path from 'path';
import { UnableToLoadDbDataError } from '../../errors/UnableToLoadDbDataError';
import { UnableToSaveDbDataError } from '../../errors/UnableToSaveDbDataError';
import { IMessageBus } from '../../infrastructure/IMessageBus';
import { ILogger } from '../../logger/ILogger';
import { Types } from '../../Types';
import { IDBSchema } from './MoviesRepository';
import { PersiterLock } from './PersiterLock';

export interface IPersiter {
    load(): Promise<IDBSchema>;
    save(dbSchema: IDBSchema): void;
}

@injectable()
export class Persiter implements IPersiter {
    private readonly moviesPath = path.join(__dirname, '..', '..', '..', 'db', 'db.json');
    private readonly logger: ILogger;
    private readonly messageBus: IMessageBus;
    private readonly persiterLock: PersiterLock;
    private readonly maxFileAccessRetryCount: number = 5;
    constructor(
        @inject(Types.Logger) logger: ILogger,
        @inject(Types.MessageBus) messageBus: IMessageBus,
        @inject(Types.PersiterLock) persiterLock: PersiterLock,
    ) {
        this.logger = logger;
        this.messageBus = messageBus;
        this.persiterLock = persiterLock;
    }

    public async load(): Promise<IDBSchema> {
        try {
            const data = fs.readFileSync(this.moviesPath);
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
            this.messageBus.emit('LockDbFile');
            fs.writeFileSync(this.moviesPath, JSON.stringify(dbSchema));
            this.messageBus.emit('UnlockDbFile');
        } catch (err) {
            this.logger.error('Persiter', 'load', err, 'Cannot load data from db file');
            throw new UnableToSaveDbDataError();
        }
    }

    private canAccessFile(retryCount: number): boolean {
        try {
            fs.accessSync(this.moviesPath);
            return true;
        } catch (err) {
            if (retryCount > this.maxFileAccessRetryCount) {
                throw new UnableToSaveDbDataError();
            }
            return false;
        }
    }
}
