import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { ILogger } from '../../logger/ILogger';
import { Types } from '../../Types';
import { CreateMovieInput } from './CreateMovieInput';

export interface IUseCaseResult {
    result: boolean;
    data?: any;
    errors?: any;
}

export interface IMoviesUseCase {
    create(movieInput: CreateMovieInput): Promise<IUseCaseResult>;

}

@injectable()
export class MoviesUseCase implements IMoviesUseCase {
    private readonly logger: ILogger;

    constructor(@inject(Types.Logger) logger: ILogger) {
        this.logger = logger;
    }

    public async create(movieInput: CreateMovieInput): Promise<IUseCaseResult> {
        return Promise.resolve({
            result: true,
        });
    }
}
