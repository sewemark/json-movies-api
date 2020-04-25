import { injectable } from 'inversify';

@injectable()
export class PersiterLock {
    private _locked = false;

    public get locked() {
        return this._locked;
    }

    public lock() {
        this._locked = true;
    }

    public unlock() {
        this._locked = false;
    }
}
