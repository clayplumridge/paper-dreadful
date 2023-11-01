import * as React from "react";
import { createRoot } from "react-dom/client";
import { SOME_NUMBER } from "@/common/constant";

const App: React.FC<unknown> = () => {
    return <div>Hello World! {SOME_NUMBER}</div>;
};

const container = document.getElementById("react-root")!;
const root = createRoot(container);

root.render(<App />);
