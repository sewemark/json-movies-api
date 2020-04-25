import { inject, injectable } from 'inversify';
import { UnableToCommitChanges } from '../../errors/UnableToCommitChanges';
import { ILogger } from '../../logger/ILogger';
import { Types } from '../../Types';
import { CreateMovieInput } from './CreateMovieInput';
import { IPersiter } from './Persiter';

export interface IDBSchema {
    movies: IMovie[];
    genres: string[];
}

export interface IMovie {
    genres: string[];
    title: string;
    year: number;
    runtime: number;
    director: string;
    actors: string;
    plot: string;
    posterUrl: string;
}

export interface IMoviesRepository {
    init(): Promise<void>;
    create(createMovieInput: CreateMovieInput): Promise<void>;
    find(): Promise<IMovie[]>;
    movieGenres(): Promise<string[]>;
}

@injectable()
export class MoviesRepository {
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

    public async create(createMovieInput: CreateMovieInput): Promise<void> {
        try {
            if (!this.inited) {
                await this.init();
            }
            this.movies.push(createMovieInput.serialize());
            await this.persiter.save({
                movies: this.movies,
                genres: this.genres,
            });
        } catch (err) {
            this.logger.error('MoviesRepository', 'create', err, `Unable to create new movie ${createMovieInput}`);
            throw new UnableToCommitChanges();
        }
    }

    public async find(): Promise<IMovie[]> {
        if (!this.inited) {
            await this.init();
        }
        return this.movies;
    }

    public async movieGenres(): Promise<string[]> {
        if (!this.inited) {
            await this.init();
        }
        return this.genres;
    }
}
