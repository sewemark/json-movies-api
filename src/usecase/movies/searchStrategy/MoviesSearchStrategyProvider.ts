import { injectable } from 'inversify';
import { IMovieFilter } from '../filters/IMovieFilter';
import { GetByGenreAndDurationInput } from '../inputs/GetByGenreAndDurationInput';
import { GenreSearchStrategy } from './GenreSearchStrategy';
import { IMovieSearchStrategy } from './IMovieSearchStrategy';
import { RandomSearchStrategy } from './RandomSearchStrategy';

@injectable()
export class MoviesSearchStrategyProvider {
    public provide(input: GetByGenreAndDurationInput, filters: IMovieFilter[]): IMovieSearchStrategy {
        if (input.genres && input.genres.length > 0) {
            return new GenreSearchStrategy(input.genres, filters);
        } else {
            return new RandomSearchStrategy(filters);
        }
    }
}
