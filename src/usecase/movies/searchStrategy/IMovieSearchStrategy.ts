
import { IMovie } from '../../../models/IMovie';

export interface IMovieSearchStrategy {
    search(movies: IMovie[]): IMovie[];
}
