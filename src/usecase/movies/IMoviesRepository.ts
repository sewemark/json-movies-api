import { IMovie } from '../../models/IMovie';
import { CreateMovieInput } from './inputs/CreateMovieInput';

export interface IMoviesRepository {
    init(): Promise<void>;
    create(createMovieInput: CreateMovieInput): Promise<void>;
    find(): Promise<IMovie[]>;
    movieGenres(): Promise<string[]>;
}
