export class HttpError {
    private _responseCode: number;
    private _errorCode: string;
    private _message: any;

    constructor(responseCode: number, errorCode: string, message: any) {
        this._responseCode = responseCode;
        this._errorCode = errorCode;
        this._message = message;
    }

    public get responseCode(): number {
        return this._responseCode;
    }

    public serialize(): any {
        return {
            status: 'error',
            error: this._errorCode,
            message: this._message,
        };
    }
}
