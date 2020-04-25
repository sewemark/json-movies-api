import { EventEmitter } from 'events';
import { Container } from 'inversify';
import { MoviesController } from './http/MoviesController';
import { IMessageBus } from './infrastructure/IMessageBus';
import { ILogger } from './logger/ILogger';
import { Logger } from './logger/Logger';
import { Types } from './Types';
import { IMoviesRepository, MoviesRepository } from './usecase/movies/MoviesRepository';
import { IMoviesUseCase, MoviesUseCase } from './usecase/movies/MoviesUseCase';
import { IPersiter, Persiter } from './usecase/movies/Persiter';
import { PersiterLock } from './usecase/movies/PersiterLock';
import { MoviesSearchStrategyProvider } from './usecase/movies/searchStrategy/MoviesSearchStrategyProvider';

export function initContainer(): Container {
    const container = new Container();
    registerDependencies(container);
    return container;
}

function registerDependencies(container: Container): void {
    container.bind<PersiterLock>(Types.PersiterLock).to(PersiterLock).inSingletonScope();
    container.bind<ILogger>(Types.Logger).to(Logger);
    container.bind<IMoviesUseCase>(Types.MoviesUseCase).to(MoviesUseCase);
    container.bind<MoviesController>(Types.MoviesController).to(MoviesController);
    container.bind<IPersiter>(Types.Persiter).to(Persiter);
    container.bind<IMoviesRepository>(Types.MoviesRespository).to(MoviesRepository);
    container.bind<MoviesSearchStrategyProvider>(Types.MoviesSearchStrategyProvider).to(MoviesSearchStrategyProvider);
    const eventEmitter = new EventEmitter();
    container.bind<IMessageBus>(Types.MessageBus).toConstantValue(eventEmitter);
}
