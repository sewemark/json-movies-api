import * as fs from 'fs';
import { Container } from 'inversify';
import * as path from 'path';
import { ServerConfig } from './config/ServerConfig';
import { MoviesController } from './http/MoviesController';
import { CompositeLogger } from './logger/CompositeLogger';
import { FileLogger } from './logger/FileLogger';
import { ILogger } from './logger/ILogger';
import { Logger } from './logger/Logger';
import { IPersiter, Persiter } from './persister/Persiter';
import { PersiterLock } from './persister/PersiterLock';
import { Types } from './Types';
import { IMoviesRepository } from './usecase/movies/IMoviesRepository';
import { MoviesRepository } from './usecase/movies/MoviesRepository';
import { IMoviesUseCase, MoviesUseCase } from './usecase/movies/MoviesUseCase';
import { MoviesSearchStrategyProvider } from './usecase/movies/searchStrategy/MoviesSearchStrategyProvider';

export function initContainer(config: ServerConfig): Container {
    const container = new Container();
    registerDependencies(container, config);
    return container;
}

function configureLogger(): ILogger {
    const logsPath = path.join('.', 'logs');
    fs.mkdirSync(logsPath, { recursive: true });
    const fileLogger = new FileLogger(path.join(logsPath, 'logs.log'));
    const logger = new Logger();
    return new CompositeLogger([logger, fileLogger]);
}

function registerDependencies(container: Container, conifg: ServerConfig): void {
    const logger = configureLogger();
    container.bind<ILogger>(Types.Logger).toConstantValue(logger);
    container.bind<ServerConfig>(Types.ServerConfig).toConstantValue(conifg);
    container.bind<PersiterLock>(Types.PersiterLock).to(PersiterLock).inSingletonScope();
    container.bind<IMoviesUseCase>(Types.MoviesUseCase).to(MoviesUseCase);
    container.bind<MoviesController>(Types.MoviesController).to(MoviesController);
    container.bind<IPersiter>(Types.Persiter).to(Persiter);
    container.bind<IMoviesRepository>(Types.MoviesRespository).to(MoviesRepository);
    container.bind<MoviesSearchStrategyProvider>(Types.MoviesSearchStrategyProvider).to(MoviesSearchStrategyProvider);
}
