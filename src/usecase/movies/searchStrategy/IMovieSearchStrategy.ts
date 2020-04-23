
import { IMovie } from '../MoviesRepository';

export interface IMovieSearchStrategy {
    search(movies: IMovie[]): IMovie[];
}
