import * as yup from 'yup';
import { AbstractHttpInput } from '../../../http/AbstractHttpInput';

export class GetByGenreAndDurationInput extends AbstractHttpInput {
    protected readonly schema: any;

    constructor(
        public genres?: string[],
        public duration?: number,
    ) {
        super();
        this.schema = yup.object().shape({
            genres: yup.array().of(yup.string()),
            duration: yup.number(),
        });
    }
}
