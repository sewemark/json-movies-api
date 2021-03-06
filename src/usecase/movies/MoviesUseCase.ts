import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { InvalidInputError } from '../../errors/InvalidInputError';
import { ILogger } from '../../logger/ILogger';
import { Types } from '../../Types';
import { MovieDurationFilter } from './filters/MovieDurationFilter';
import { IMoviesRepository } from './IMoviesRepository';
import { CreateMovieInput } from './inputs/CreateMovieInput';
import { GetByGenreAndDurationInput } from './inputs/GetByGenreAndDurationInput';
import { IUseCaseResult } from './IUseCaseResult';
import { MoviesSearchStrategyProvider } from './searchStrategy/MoviesSearchStrategyProvider';

export interface IMoviesUseCase {
    create(movieInput: CreateMovieInput): Promise<IUseCaseResult>;
    getAllByGenreAndDuration(getByGenresAndDurationInput: GetByGenreAndDurationInput): Promise<IUseCaseResult>;
}

@injectable()
export class MoviesUseCase implements IMoviesUseCase {

    private readonly logger: ILogger;
    private readonly moviesRepository: IMoviesRepository;
    private readonly moviesSearchStrategyProvider: MoviesSearchStrategyProvider;
    constructor(
        @inject(Types.Logger) logger: ILogger,
        @inject(Types.MoviesRespository) moviesRepository: IMoviesRepository,
        @inject(Types.MoviesSearchStrategyProvider) moviesSearchStrategyProvider: MoviesSearchStrategyProvider,
    ) {
        this.logger = logger;
        this.moviesRepository = moviesRepository;
        this.moviesSearchStrategyProvider = moviesSearchStrategyProvider;
    }

    public async getAllByGenreAndDuration(input: GetByGenreAndDurationInput): Promise<IUseCaseResult> {
        const validationResult = await input.validate();
        if (!validationResult.valid) {
            this.logger.warn('MoviesUseCase', 'getAllByGenreAndDuration', 'Invalid input data provided');
            throw new InvalidInputError(validationResult.errorResults);
        }

        const filters = [];
        if (input.duration) {
            filters.push(new MovieDurationFilter(input.duration));
        }
        const movies = await this.moviesRepository.find();
        const searchStrategy = this.moviesSearchStrategyProvider.provide(input, filters);
        const data = searchStrategy.search(movies);
        return Promise.resolve({
            success: true,
            data,
        } as IUseCaseResult);
    }

    public async create(movieInput: CreateMovieInput): Promise<IUseCaseResult> {
        const movieGenres = await this.moviesRepository.movieGenres();
        const validationResult = await movieInput.validate();
        const valuesValidationResult = await movieInput.validateValues(movieGenres);

        if (!validationResult.valid || !valuesValidationResult.valid) {
            this.logger.warn('MoviesUseCase', 'create', 'Invalid movie input schema data');
            throw new InvalidInputError([...validationResult.errorResults || [],
            ...valuesValidationResult.errorResults || []]);
        }
        try {
            const createdMovie = await this.moviesRepository.create(movieInput);
            return Promise.resolve({
                success: true,
                data: createdMovie,
            });
        } catch (err) {
            this.logger.error('MoviesUseCase', 'create', err, `Unable to create movie`);
            throw err;
        }
    }
}
