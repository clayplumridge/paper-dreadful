import {
    AppBar as MuiAppBar,
    Avatar,
    Box,
    Button,
    IconButton,
    Menu,
    MenuItem,
    styled,
    Toolbar,
    Typography,
} from "@mui/material";
import React from "react";

import { LoggedInUserResponse } from "@/common/contracts";

import { getRestClient } from "../../rest_client";
import { Loading } from "../util/loading";

const UserContainer = styled(Box)(() => ({
    display: "flex",
    flexDirection: "row",
    marginLeft: "auto",
    "> :not(:first-child)": {
        marginLeft: "0.25em",
    },
}));

export function AppBar() {
    return (
        <MuiAppBar position="static">
            <Toolbar>
                <Typography>
                    Paper Dreadful
                </Typography>
                <UserSection />
            </Toolbar>
        </MuiAppBar>
    );
}

function UserSection() {
    return (
        <UserContainer>
            <Loading promises={() => [
                getRestClient()
                    .getCurrentUser(),
            ]}
            >
                {
                    ([response]) => response.type === "loggedin"
                        ? <UserDetails response={response} />
                        : <LoginButton />
                }
            </Loading>
        </UserContainer>
    );
}

interface UserDetailsProps {
    response: LoggedInUserResponse;
}

function UserDetails(props: UserDetailsProps) {
    const { user } = props.response;
    const [menuAnchorEl, setMenuAnchorEl] = React.useState<HTMLElement | null>(null);

    const handleLogout = React.useCallback(() => {
        getRestClient()
            .logout()
            .then(() => location.reload());
    }, []);

    return(
        <>
            <IconButton onClick={ev => setMenuAnchorEl(ev.currentTarget)}>
                <Avatar alt={user.displayName} />
            </IconButton>
            <Menu
                anchorEl={menuAnchorEl}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                id="menu-user-appbar"
                onClose={() => setMenuAnchorEl(null)}
                open={Boolean(menuAnchorEl)}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <MenuItem key="profile">
                    <Typography>Profile</Typography>
                </MenuItem>
                <MenuItem key="logout" onClick={handleLogout}>
                    <Typography>Logout</Typography>
                </MenuItem>
            </Menu>
        </>
    );
}

function LoginButton() {
    return <Button color="inherit" href="http://localhost:5001/auth/login-with-google">Login</Button>;
}
