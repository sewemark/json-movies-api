import { IMovie } from '../../../models/IMovie';
import { IMovieFilter } from '../filters/IMovieFilter';
import { IMovieSearchStrategy } from './IMovieSearchStrategy';

export class RandomSearchStrategy implements IMovieSearchStrategy {
    private filters: IMovieFilter[];

    constructor(filters: IMovieFilter[]) {
        this.filters = filters;
    }

    public search(movies: IMovie[]): IMovie[] {
        const filteredMovies = this.applyFilters(movies);
        const randomIndex = this.randomNumber(0, filteredMovies.length);
        if (filteredMovies[randomIndex]) {
            return [filteredMovies[randomIndex]];
        } else {
            return null;
        }
    }

    private applyFilters(movies: IMovie[]): IMovie[] {
        return movies.filter((movie: IMovie) =>
            this.filters.reduce((prev: boolean, curr: IMovieFilter) => {
                return prev && curr.filter(movie);
            }, true));
    }

    private randomNumber(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }
}
