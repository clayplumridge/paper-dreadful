// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(func: T, ms: number): (...funcArgs: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    return( ...args: Parameters<T>[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => void func(...args), ms);
    };
}
