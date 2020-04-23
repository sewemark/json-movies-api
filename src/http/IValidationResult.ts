import { IValidationErrorResult } from './IValidationErrorResult';

export interface IValidationResult {
    valid: boolean;
    errorResults?: IValidationErrorResult[];
}
