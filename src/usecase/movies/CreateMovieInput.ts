import { uuid } from 'uuidv4';
import * as yup from 'yup';
import { setLocale } from 'yup';
import { AbstractHttpInput } from '../../http/AbstractHttpInput';
import { IValidationErrorResult } from '../../http/IValidationErrorResult';
import { IValidationResult } from '../../http/IValidationResult';

setLocale({
    number: {
        max: 'Max field size ${max}',
    },
});

export class CreateMovieInput extends AbstractHttpInput {
    public id: string;
    protected readonly schema: any;

    constructor(
        public genres: string[],
        public title: string,
        public year: number,
        public runtime: number,
        public director: string,
        public actors: string,
        public plot: string,
        public posterUrl: string,
    ) {
        super();
        this.schema = yup.object().shape({
            genres: yup.array().of(yup.string()),
            title: yup.string().required().max(255),
            year: yup.number().required().min(1895),
            runtime: yup.number().required(),
            director: yup.string().required().max(255),
            actors: yup.string(),
            plot: yup.string(),
            posterUrl: yup.string().url(),
        });
        this.id = uuid();
    }

    public serialize(): any {
        return {
            id: this.id,
            genres: this.genres,
            title: this.title,
            year: this.year,
            runtime: this.runtime,
            director: this.director,
            actors: this.actors,
            plot: this.plot,
            posterUrl: this.posterUrl,
        };
    }

    public validateValues(movieGenres: string[]): Promise<IValidationResult> {
        const validGenres = this.genres.reduce((prev: boolean, current: string) => {
            return prev && movieGenres.includes(current);
        }, true);
        if (!validGenres) {
            return Promise.resolve({
                valid: false,
                errorResults: [{
                    fieldName: 'genres',
                    message: 'genre must be one of predefined values',
                } as IValidationErrorResult],
            });
        } else {
            return Promise.resolve({
                valid: true,
            });
        }
    }
}

/*
- a list of genres (only predefined ones from db file) (required, array of predefined strings)
- title (required, string, max 255 characters)
- year (required, number)
- runtime (required, number)
- director (required, string, max 255 characters)
- actors (optional, string)
- plot (optional, string)
- posterUrl (optional, string)
*/
