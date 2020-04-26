import { IMovie } from '../../../models/IMovie';
import { IMovieFilter } from '../filters/IMovieFilter';
import { IMovieSearchStrategy } from './IMovieSearchStrategy';

export class GenreSearchStrategy implements IMovieSearchStrategy {
    private genres: string[];
    private filters: IMovieFilter[];

    constructor(genres: string[], filters: IMovieFilter[]) {
        this.genres = genres;
        this.filters = filters;
    }

    public search(movies: IMovie[]): any {
        const result = {} as any;
        movies.forEach((movie: IMovie) => {
            const numberOfMatchingGenres = this.getNumberOfMatchingGenres(movie);
            if (this.areFiltersSatisfied(movie) && this.isMatchedGenreNumberSatisfied(movie, numberOfMatchingGenres)
            ) {
                if (!result.hasOwnProperty(numberOfMatchingGenres)) {
                    result[numberOfMatchingGenres] = [];
                }
                result[numberOfMatchingGenres].push(movie);
            }
        });
        return this.sortResultMovies(result);
    }

    private isMatchedGenreNumberSatisfied(movie: IMovie, numberOfMatchingGenres: number): boolean {
        return numberOfMatchingGenres > 0 && numberOfMatchingGenres === movie.genres.length;
    }

    private getNumberOfMatchingGenres(movie: IMovie): number {
        return movie.genres.reduce((prev, curr) => {
            return this.genres.includes(curr) ? prev + 1 : prev;
        }, 0);
    }

    private areFiltersSatisfied(movie: IMovie): boolean {
        return this.filters.reduce((prev: boolean, curr: IMovieFilter) => {
            return prev && curr.filter(movie);
        }, true);
    }

    private sortResultMovies(result: any) {
        const orderdMoviesResult: IMovie[] = [];
        const keys = Object.keys(result).sort((a, b) => Number(b) - Number(a));
        keys.forEach((key) => {
            orderdMoviesResult.push(...result[key]);
        });
        return orderdMoviesResult;
    }
}
