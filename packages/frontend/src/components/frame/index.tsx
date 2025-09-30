import {
    Container,
    createTheme,
    CssBaseline,
    styled,
    ThemeProvider,
} from "@mui/material";
import * as React from "react";

import {AppBar} from "./header";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const PageContainer = styled(Container)(() => ({
    paddingTop: "1em",
}));

export function Frame(props: React.PropsWithChildren<{}>) {
    const {children} = props;

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <AppBar />
            <PageContainer maxWidth="xl">
                {children}
            </PageContainer>
        </ThemeProvider>
    );
}
