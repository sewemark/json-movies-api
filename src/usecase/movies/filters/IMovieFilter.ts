import { IMovie } from '../../../models/IMovie';

export interface IMovieFilter {
    filter(movie: IMovie): boolean;
}
