import * as React from "react";
import { createRoot } from "react-dom/client";

const App: React.FC<unknown> = () => {
    return <div>Hello World!</div>;
};

const container = document.getElementById("react-root")!;
const root = createRoot(container);

root.render(<App />);
