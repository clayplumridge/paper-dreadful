import * as React from "react";

export interface LoadingProps<T extends readonly unknown[] | []> {
    children: LoadingChildFunction<T>;
    loadingComponent?: React.ReactNode;
    promises: () => T;
}

type ResultType<T extends readonly unknown[] | []> = {-readonly [P in keyof T]: Awaited<T[P]>};
export type LoadingChildFunction<T extends readonly unknown[] | []> = (results: ResultType<T>) => React.ReactNode;

export function Loading<T extends readonly unknown[] | []>(props: LoadingProps<T>) {
    const [promiseResults, setPromiseResults] = React.useState<ResultType<T> | undefined>(undefined);

    React.useEffect(() => {
        // Need to make sure we clear things out before changing
        setPromiseResults(undefined);
        Promise.all(props.promises())
            .then(setPromiseResults);

    }, [props.promises]);
    
    if(promiseResults) {
        return props.children(promiseResults);
    } else {
        return props.loadingComponent;
    }
}
