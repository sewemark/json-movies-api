import { Container } from 'inversify';
import { MoviesController } from './http/MoviesController';
import { ILogger } from './logger/ILogger';
import { Logger } from './logger/Logger';
import { Types } from './Types';
import { IMoviesUseCase, MoviesUseCase } from './usecase/movies/MoviesUseCase';

export function initContainer(): Container {
    const container = new Container();
    registerDependencies(container);
    return container;
}

function registerDependencies(container: Container): void {
    container.bind<ILogger>(Types.Logger).to(Logger);
    container.bind<IMoviesUseCase>(Types.MoviesUseCase).to(MoviesUseCase);
    container.bind<MoviesController>(Types.MoviesController).to(MoviesController);
}
