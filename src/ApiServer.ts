import * as bodyParser from 'body-parser';
import { Express, Request, Response } from 'express';
import { ServerConfig } from './config/ServerConfig';
import { ILogger } from './logger/ILogger';
const cors = require('cors');

export class ApiServer {
    private logger: ILogger;
    private app: Express;
    private serverConfig: ServerConfig;

    constructor(
        logger: ILogger,
        serverConfig: ServerConfig,
        app: Express,
    ) {
        this.logger = logger;
        this.serverConfig = serverConfig;
        this.app = app;
    }

    public start() {
        this.registerMiddlewares();
        this.registerRoutes();
        this.startListening();
    }

    private registerMiddlewares(): void {
        this.app.use(bodyParser.json());
        this.app.use(cors());
    }

    private registerRoutes(): void {
        this.logger.info('ApiServer', 'registerRoutes', 'Registering routes...');
        this.app.get('/api/test', (req: Request, res: Response, next: Function) => {
            res.status(200).send('Osssssssssk');
        });
        this.app.use((err: any, req: Request, res: Response, next: any) =>
            res.status(422).send({ error: err.message }));
    }

    private startListening() {
        const port = process.env.PORT || this.serverConfig.port || 8081;
        this.app.listen(port, () => {
            this.logger.info('ApiServer', 'startApp', `Server listening on ${port}`);
        });
    }
}
