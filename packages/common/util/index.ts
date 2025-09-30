import { Resolver } from "./promise";
import { Unpromise } from "./typings";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(func: T, ms: number): (...funcArgs: Parameters<T>) => Promise<Unpromise<ReturnType<T>>> {
    let timeoutId: ReturnType<typeof setTimeout>;
    let resolver = new Resolver<Unpromise<ReturnType<T>>>();

    return( ...args: Parameters<T>[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            resolver.resolve(func(...args)); 
            resolver = new Resolver();
        }, ms);
        return resolver.promise;
    };
}
