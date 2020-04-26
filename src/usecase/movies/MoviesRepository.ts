import { inject, injectable } from 'inversify';
import { UnableToCommitChanges } from '../../errors/UnableToCommitChangesError';
import { ILogger } from '../../logger/ILogger';
import { IMovie } from '../../models/IMovie';
import { IPersiter } from '../../persister/Persiter';
import { Types } from '../../Types';
import { IMoviesRepository } from './IMoviesRepository';
import { CreateMovieInput } from './inputs/CreateMovieInput';

@injectable()
export class MoviesRepository implements IMoviesRepository {
    private readonly logger: ILogger;
    private readonly persiter: IPersiter;
    private movies: IMovie[];
    private genres: string[];
    private inited: boolean;

    constructor(
        @inject(Types.Logger) logger: ILogger,
        @inject(Types.Persiter) persiter: IPersiter,
    ) {
        this.logger = logger;
        this.persiter = persiter;
        this.inited = false;
    }

    public async init(): Promise<void> {
        const dbSchema = await this.persiter.load();
        this.movies = dbSchema.movies;
        this.genres = dbSchema.genres;
        this.inited = true;
    }

    public async create(createMovieInput: CreateMovieInput): Promise<IMovie> {
        try {
            await this.init();
            const newMovie = createMovieInput.serialize();
            this.movies.push(newMovie);
            await this.persiter.save({
                movies: this.movies,
                genres: this.genres,
            });
            return newMovie;
        } catch (err) {
            this.logger.error('MoviesRepository', 'create', err, `Unable to create new movie ${createMovieInput}`);
            throw new UnableToCommitChanges();
        }
    }

    public async find(): Promise<IMovie[]> {
        await this.init();
        return this.movies;
    }

    public async movieGenres(): Promise<string[]> {
        if (!this.inited) {
            await this.init();
        }
        return this.genres;
    }
}
