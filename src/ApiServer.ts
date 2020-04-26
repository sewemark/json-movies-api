import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { Express, Request, Response } from 'express';
import { ServerConfig } from './config/ServerConfig';
import { MoviesController } from './http/MoviesController';
import { ILogger } from './logger/ILogger';

export class ApiServer {
    private logger: ILogger;
    private app: Express;
    private serverConfig: ServerConfig;
    private moviesController: MoviesController;

    constructor(
        logger: ILogger,
        serverConfig: ServerConfig,
        app: Express,
        moviesController: MoviesController,
    ) {
        this.logger = logger;
        this.serverConfig = serverConfig;
        this.app = app;
        this.moviesController = moviesController;
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
        this.app.get('/_health', (req: Request, res: Response, next: any) => {
            res.status(200).send('ok');
        });
        this.app.get('/movies', this.moviesController.get.bind(this.moviesController));
        this.app.post('/movies', this.moviesController.post.bind(this.moviesController));
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
