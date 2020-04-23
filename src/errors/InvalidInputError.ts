import { IValidationErrorResult } from '../http/IValidationErrorResult';

export class InvalidInputError extends Error {
    public readonly validationErrors: IValidationErrorResult[];

    constructor(validationErrors: IValidationErrorResult[]) {
        super();
        this.validationErrors = validationErrors;
    }
}
