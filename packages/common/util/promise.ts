/**
 * Returns a new promise that will not resolve until at least delayMs has passed
 */
export async function delayPromise<T>(originalPromise: Promise<T>, delayMs: number): Promise<T> {
    const delayPromise = new Promise<void>(resolve => setTimeout(() => resolve(), delayMs));
    
    const [originalResult] = await Promise.all([originalPromise, delayPromise]);
    return originalResult;
}
