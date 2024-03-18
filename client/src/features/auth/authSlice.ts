import {Action, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";

export interface IUser {
    id: number;
    username: string;
    email: string;
}

export interface ISettings {
    priorityColors: string[]
}

export interface IAuthState {
    user: IUser | null;
    accessToken: string | null;
    settings: ISettings | null
}

const initialState: IAuthState = {
    user: null,
    accessToken: null,
    settings: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<IAuthState>) => {
            console.log("TEST =================================")

            const { user, accessToken, settings } = action.payload;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('accessToken', accessToken || "");
            localStorage.setItem('settings', JSON.stringify(settings));

            console.log(settings);

            state.user = user;
            state.accessToken = accessToken;
            state.settings = settings;
        },
        logOut: (state) => {
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('settings');
            state.user = null;
            state.accessToken = null;
            state.settings = null;
        },
        changeSettings: (state, action: PayloadAction<ISettings>) => {

            const settings = action.payload;
            localStorage.setItem('settings', JSON.stringify(settings));

            console.log("YE HAAAAAAAAAAAAAA")
            console.log(settings);
            state.settings = settings;
        },
    },
});

const exportActions = {
    setCredentials: authSlice.actions.setCredentials,
    logOut: authSlice.actions.logOut,
    changeSettings: authSlice.actions.changeSettings
};

export const { setCredentials, logOut, changeSettings } = exportActions;


export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.accessToken;
export const selectSettings = (state: RootState) => state.auth.settings;