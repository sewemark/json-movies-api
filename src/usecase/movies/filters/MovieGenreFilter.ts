import { IMovie } from '../MoviesRepository';
import { IMovieFilter } from './IMovieFilter';

export interface IMovieSearchStrategy {
    search(movies: IMovie[]): IMovie[];
}

export class MovieSearchStrategy implements IMovieSearchStrategy {
    private genres: string[];
    private filters: IMovieFilter[];

    constructor(genres: string[], filters: IMovieFilter[]) {
        this.genres = genres;
        this.filters = filters;
    }

    public search(movies: IMovie[]): any {
        const result = {} as any;
        const results: IMovie[] = [];
        movies.forEach((movie: IMovie) => {
            const shouldContinue = this.filters.reduce((prev: boolean, curr: IMovieFilter) => {
                return prev && curr.filter(movie);
            }, true);
            if (shouldContinue) {
                const howMany = movie.genres.reduce((prev, curr) => {
                    return this.genres.includes(curr) ? prev + 1 : prev;
                }, 0);
                if (howMany > 0) {
                    if (!result.hasOwnProperty(howMany)) {
                        result[howMany] = [];
                    }
                    result[howMany].push(movie);
                }
            }
        });
        const keys = Object.keys(result).sort((a, b) => Number(a) - Number(b));
        keys.forEach((key) => {
            results.push(...result[key]);
        });
        return results;
    }
}
