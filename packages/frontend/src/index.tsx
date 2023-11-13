import * as React from "react";
import { createRoot } from "react-dom/client";
import { RestApi } from "./rest";
import { useEffectAsync } from "./hooks";
import { SOME_NUMBER } from "@/common/constant";

const App: React.FC<unknown> = () => {
    useEffectAsync(async () => {
        const result = await RestApi.getDeck();
        console.log(result.data);
    }, []);

    return <div>Hello World! {SOME_NUMBER}</div>;
};

const container = document.getElementById("react-root")!;
const root = createRoot(container);

root.render(<App />);
