import {apiSlice} from "../../app/api/apiSlice";
import {FetchArgs} from "@reduxjs/toolkit/query/react";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: (credentials): FetchArgs => ({
                url: '/user/login',
                method: 'GET',
                params: {email: credentials.email, password: credentials.password}
            })
        }),

        registration: builder.mutation({
            query: (credentials): FetchArgs => ({
                url: '/user/registration',
                method: 'POST',
                body: {username: credentials.username, email: credentials.email, password: credentials.password}
            })
        }),

        changeColorSettings: builder.mutation({
            query: (credentials): FetchArgs => ({
                url: '/settings/change-priority-colors',
                method: 'POST',
                body: {newColors: credentials.newColors}
            })
        }),
    })
});

export const {
    useLoginMutation,
    useRegistrationMutation,
    useChangeColorSettingsMutation,
} = authApiSlice;