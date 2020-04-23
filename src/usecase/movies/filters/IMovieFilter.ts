import { IMovie } from '../MoviesRepository';

export interface IMovieFilter {
    filter(movie: IMovie): boolean;
}
