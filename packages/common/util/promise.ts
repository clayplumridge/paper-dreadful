/**
 * Returns a new promise that will not resolve until at least delayMs has passed
 */
export async function delayPromise<T>(originalPromise: Promise<T>, delayMs: number): Promise<T> {
    const delayPromise = new Promise<void>(resolve => setTimeout(() => resolve(), delayMs));
    
    const [originalResult] = await Promise.all([originalPromise, delayPromise]);
    return originalResult;
}

export class Resolver<T> {
    promise: Promise<T>;

    private resolveInternal?: (res: T) => void;
    private rejectInternal?: (error: unknown) => void;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolveInternal = resolve;
            this.rejectInternal = reject;
        });
    }

    resolve(val: T) {
        if(!this.resolveInternal) {
            throw new Error("Attempting to resolve a resolver before resolveInternal is set");
        }

        this.resolveInternal(val);
    }

    reject(err: unknown) {
        if(!this.rejectInternal) {
            throw new Error("Attempting to reject a resolver before rejectInternal is set");
        }

        this.rejectInternal(err);
    }
}
