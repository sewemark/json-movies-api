import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ILogger } from '../logger/ILogger';
import { Types } from '../Types';
import { CreateMovieInput } from '../usecase/movies/CreateMovieInput';
import { MoviesUseCase } from '../usecase/movies/MoviesUseCase';

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

    public get(req: Request, res: Response): void {
        res.status(200).send('ok2');
    }

    public post(req: Request, res: Response): void {
        const result = this.moviesUseCase.create(new CreateMovieInput(
            req.body.genres,
            req.body.title,
            req.body.year,
            req.body.runtime,
            req.body.director,
            req.body.actors,
            req.body.plot,
            req.body.posterUrl,
        ));
        res.status(200).send('Okejka');
    }
}