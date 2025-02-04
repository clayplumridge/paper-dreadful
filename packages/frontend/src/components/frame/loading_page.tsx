import { LinearProgress } from "@mui/material";
import * as React from "react";

import { Loading, LoadingProps } from "../util/loading";

export type LoadingPageProps<T extends readonly unknown[] | []> = Omit<LoadingProps<T>, "loadingComponent">

type ResultType<T extends readonly unknown[] | []> = {-readonly [P in keyof T]: Awaited<T[P]>};
export type LoadingChildFunction<T extends readonly unknown[] | []> = (results: ResultType<T>) => React.ReactNode;

export function LoadingPage<T extends readonly unknown[] | []>(props: LoadingPageProps<T>) {
    return (
        <Loading {...props} loadingComponent={<LinearProgress color="secondary" />} />
    );
}
