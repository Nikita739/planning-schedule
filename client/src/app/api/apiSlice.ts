import {BaseQueryApi, createApi, FetchArgs, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {setCredentials, logOut, IUser} from "../../features/auth/authSlice";
import {QueryArgs} from "@testing-library/react";
import {RootState} from "../store";

interface GetState {
    getState: () => any
}

interface IRefreshResultsUnknown {
    data?: IRefreshResultsData | unknown;
}

interface IRefreshResults {
    data?: IRefreshResultsData;
}

interface IRefreshResultsData {
    accessToken: string;
    refreshToken: string;
    user: IUser;
}

//@ts-ignore
const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:4000/api/v1',
    credentials: 'include',
    prepareHeaders: (headers, {getState}: any) => {
        // const token = getState()?.auth?.token;
        const token = (getState() as RootState).auth.accessToken
        console.log("TOKEN ----------------- " + token)
        if(token) {
            console.log("SET HEADER AUTH TO: " + token)
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    }
});

const baseQueryWithReauth = async (args: FetchArgs, api: BaseQueryApi, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions);

    if(result?.error?.status === 401) {
        console.log("Sending refresh token");
        // Send refresh token to get new access token
        const refreshResult: IRefreshResultsUnknown = await baseQuery('/user/refresh', api, extraOptions);

        if(refreshResult.data) {
            // Store the new token
            // @ts-ignore
            api.dispatch(setCredentials({ user: refreshResult.data!.user, accessToken: refreshResult.data!.accessToken }));
            // retry the original query with new access token
            result = await baseQuery(args, api, extraOptions);
        } else {
            //@ts-ignore
            api.dispatch(logOut(api.getState()));
        }
    }

    return result;
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({})
});