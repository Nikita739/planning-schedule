import {Action, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";

export interface IUser {
    id: number;
    username: string;
    email: string;
}

export interface IAuthState {
    user: IUser | null;
    accessToken: string | null;
}

const initialState: IAuthState = {
    user: null,
    accessToken: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<IAuthState>) => {
            const { user, accessToken } = action.payload;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('accessToken', accessToken || "");
            state.user = user;
            state.accessToken = accessToken;
        },
        logOut: (state) => {
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            state.user = null;
            state.accessToken = null;
        }
    },
});

const exportActions = {
    setCredentials: authSlice.actions.setCredentials,
    logOut: authSlice.actions.logOut
};

export const { setCredentials, logOut } = exportActions;


export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.accessToken;