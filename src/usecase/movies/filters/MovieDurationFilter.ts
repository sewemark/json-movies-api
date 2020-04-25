import { IMovie } from '../../../models/IMovie';
import { IMovieFilter } from './IMovieFilter';

export class MovieDurationFilter implements IMovieFilter {
    private range: number;
    private duration: number;
    private DEFAULT_RANGE = 10;

    constructor(duration: number, range?: number) {
        this.duration = duration;
        this.range = range ? range : this.DEFAULT_RANGE;
    }

    public filter(movie: IMovie): boolean {
        return movie.runtime <= Number(this.duration) + this.range
            && movie.runtime >= Number(this.duration) - this.range;
    }
}
