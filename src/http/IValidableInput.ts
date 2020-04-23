import { IValidationResult } from './IValidationResult';

export interface IValidableInput {
    validate(): Promise<IValidationResult>;
}
