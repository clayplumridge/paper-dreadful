type NoNullKeys<T> = { [K in keyof T]: NoNullKeys<Exclude<T[K], null>> };
export function nonNullKeys<T>(promise: Promise<T[]>): Promise<NoNullKeys<T>[]>;
export function nonNullKeys<T>(promise: Promise<T>): Promise<NoNullKeys<T>>;
export function nonNullKeys<T>(arr: T[]): NoNullKeys<T>[];
export function nonNullKeys<T>(obj: T): NoNullKeys<T>;
export function nonNullKeys(obj: unknown) {
    return obj;
}

type AllConcreteKeys<T> = NoNullKeys<Required<T>>;
export function allConcreteKeys<T>(promise: Promise<T[]>): Promise<AllConcreteKeys<T>[]>;
export function allConcreteKeys<T>(promise: Promise<T>): Promise<AllConcreteKeys<T>>;
export function allConcreteKeys<T>(arr: T[]): AllConcreteKeys<T>[];
export function allConcreteKeys<T>(obj: T): AllConcreteKeys<T>;
export function allConcreteKeys(obj: unknown) {
    return obj;
}

export type Unpromise<T> = T extends Promise<infer U> ? U : T;
