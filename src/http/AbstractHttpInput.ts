import { IValidableInput } from './IValidableInput';
import { IValidationErrorResult } from './IValidationErrorResult';
import { IValidationResult } from './IValidationResult';

export abstract class AbstractHttpInput implements IValidableInput {
    protected abstract readonly schema: any;

    public async validate(): Promise<IValidationResult> {
        try {
            await this.schema.validate(this, { abortEarly: false });
            return Promise.resolve({
                valid: true,
            });
        } catch (err) {
            return Promise.resolve({
                valid: false,
                errorResults: err.inner.map((innerError: any) => ({
                    fieldName: innerError.path,
                    message: innerError.message,
                } as IValidationErrorResult)),
            });
        }
    }
}
