import { IMovie } from '../models/IMovie';

export interface IDBSchema {
    movies: IMovie[];
    genres: string[];
}
