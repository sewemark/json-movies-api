import * as yup from 'yup';
import { setLocale } from 'yup';

setLocale({
    number: {
        max: 'Maksymalny rozmiar pola ${max}',
    },
});

export interface IValidationResult {
    valid: boolean;
    errorResult?: IValidationErrorResult[];
}

export interface IValidationErrorResult {
    filedName: string;
    message: string;
}

export interface IValidableInput {
    validate(): Promise<IValidationResult>;
}

export class CreateMovieInput implements IValidableInput {
    private readonly schema: any;

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
    }

    public async validate(): Promise<IValidationResult> {
        try {
            this.schema.validate(this);
            return Promise.resolve({
                valid: true,
            });
        } catch (err) {
            console.log(err);
            return Promise.resolve({
                valid: false,

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