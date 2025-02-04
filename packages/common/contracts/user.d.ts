export interface LoggedInUserResponse {
    type: "loggedin";
    user: {
        id: number;
        displayName: string;
    }
}

export interface LoggedOutUserResponse {
    type: "loggedout";
}

export type CurrentUserResponse = LoggedInUserResponse | LoggedOutUserResponse;
