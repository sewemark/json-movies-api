import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { InvalidInputError } from '../errors/InvalidInputError';
import { UnableToLoadDbDataError } from '../errors/UnableToLoadDbDataError';
import { ILogger } from '../logger/ILogger';
import { Types } from '../Types';
import { CreateMovieInput } from '../usecase/movies/inputs/CreateMovieInput';
import { GetByGenreAndDurationInput } from '../usecase/movies/inputs/GetByGenreAndDurationInput';
import { MoviesUseCase } from '../usecase/movies/MoviesUseCase';
import { HttpError } from './HttpError';

@injectable()
export class MoviesController {
    protected readonly logger: ILogger;
    protected readonly moviesUseCase: MoviesUseCase;

    constructor(
        @inject(Types.Logger) logger: ILogger,
        @inject(Types.MoviesUseCase) moviesUseCase: MoviesUseCase,
    ) {
        this.logger = logger;
        this.moviesUseCase = moviesUseCase;
    }

    public async get(req: Request, res: Response): Promise<void> {
        try {
            this.logger.info('MoviesController', 'get', 'Getting movies');
            const query = req.query as any;
            const useCaseResponse = await this.moviesUseCase.getAllByGenreAndDuration(
                new GetByGenreAndDurationInput(query.genres, query.duration));
            this.logger.info('MoviesController', 'get', 'Successfuly obtained movies');
            res.status(200).json(useCaseResponse.data);
        } catch (err) {
            this.logger.error('MoviesController', 'get', err, 'Unable to obtain get movies result');
            const httpError = this.getHttpError(err);
            res.status(httpError.responseCode).send(httpError.serialize());
        }
    }

    public async post(req: Request, res: Response): Promise<void> {
        try {
            this.logger.info('MoviesController', 'post', 'Creating new movie');
            const createMovieInput = new CreateMovieInput(
                req.body.genres,
                req.body.title,
                req.body.year,
                req.body.runtime,
                req.body.director,
                req.body.actors,
                req.body.plot,
                req.body.posterUrl,
            );
            const useCaseResponse = await this.moviesUseCase.create(createMovieInput);
            this.logger.info('MoviesController', 'post', 'Successfuly created new movie');
            res.status(201).send(useCaseResponse.data);
        } catch (err) {
            this.logger.error('MoviesController', 'post', err, 'Unable to create new movie');
            const httpError = this.getHttpError(err);
            res.status(httpError.responseCode).send(httpError.serialize());
        }
    }

    private getHttpError(err: any): HttpError {
        switch (err.constructor) {
            case InvalidInputError:
                return new HttpError(400, '400.1', (err as InvalidInputError).validationErrors);
            case UnableToLoadDbDataError:
                return new HttpError(500, '500.1', 'Unable to access db');
            default:
                return new HttpError(500, '500', {});
        }
    }
}
