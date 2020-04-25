import * as path from 'path';
import { ILogger } from '../logger/ILogger';

export class ServerConfig {
    private _port: number = 8080;
    private _databaseFilePath: string = path.join(__dirname, '..', '..', 'db', 'db.json');
    private logger: ILogger;

    public get port(): number {
        return this._port;
    }

    public get databaseFilePath(): string {
        return this._databaseFilePath;
    }

    constructor(logger: ILogger) {
        this.logger = logger;
    }

    public serialize(): any {
        return {
            port: this.port,
            databaseFilePath: this.databaseFilePath,
        };
    }

    public deserialize(config: any): void {
        if (config.port && Number.isInteger(config.port) && Number(config.port) < Number.MAX_SAFE_INTEGER) {
            this._port = config.port;
        } else {
            this.logger.info(
                'ServerConfig',
                'deserialize',
                `Invalid port value ${config.port}, using default value ${this.port}`,
            );
        }

        if (config.databaseFilePath && typeof config.databaseFilePath === 'string') {
            this._databaseFilePath = config.databaseFilePath;
        } else {
            this.logger.info(
                'ServerConfig',
                'deserialize',
                `Invalid database file path value ${config.databaseFilePath},
                 using default value ${this.databaseFilePath}`,
            );
        }
    }
}
