import * as fs from 'fs';
import { inject, injectable } from 'inversify';
import * as path from 'path';
import { UnableToLoadDbDataError } from '../../errors/UnableToLoadDbDataError';
import { ILogger } from '../../logger/ILogger';
import { Types } from '../../Types';
import { IDBSchema } from './MoviesRepository';

export interface IPersiter {
    load(): Promise<IDBSchema>;
    save(dbSchema: IDBSchema): void;
}

@injectable()
export class Persiter implements IPersiter {
    private readonly moviesPath = path.join(__dirname, '..', '..', '..', 'db', 'db.json');
    private readonly logger: ILogger;

    constructor(
        @inject(Types.Logger) logger: ILogger,
    ) {
        this.logger = logger;
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
    public save(dbSchema: IDBSchema): void {
        try {
            fs.writeFileSync(this.moviesPath, JSON.stringify(dbSchema));
        } catch (err) {
            console.log(err);
        }
    }

}
