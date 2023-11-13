import React, { DependencyList } from "react";

export type AsyncEffectCallback = () => Promise<void>;

export function useEffectAsync(
    effect: AsyncEffectCallback,
    inputs: DependencyList
) {
    return React.useEffect(() => {
        void effect();
    }, inputs);
}
