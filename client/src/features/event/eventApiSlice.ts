import {apiSlice} from "../../app/api/apiSlice";
import {FetchArgs} from "@reduxjs/toolkit/query/react";

function formatDate(rawDate: Date, hours: number): string {
    const date = new Date(rawDate);
    date.setHours(hours);
    //
    // let datePart = [
    //     date.getMonth() + 1,
    //     date.getDate(),
    //     date.getFullYear()
    // ].map((n, i) => n.toString().padStart(i === 2 ? 4 : 2, "0")).join("-");
    // let timePart = [
    //     date.getHours(),
    //     date.getMinutes(),
    //     date.getSeconds()
    // ].map((n, i) => n.toString().padStart(2, "0")).join(":");
    // return datePart + " " + timePart;

    // console.log("ISO STRING!!!" + date.toLocaleDateString())

    return date.toISOString();
}

export const eventApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        add: builder.mutation({
            query: (eventData): FetchArgs => ({
                url: '/event/add',
                method: 'POST',
                body: {name: eventData.name, date: formatDate(eventData.date, eventData.hours)}
            })
        }),

        get: builder.mutation({
            query: (eventData): FetchArgs => ({
                url: '/event/get',
                method: 'GET',
            })
        }),
    })
});

export const {
    useAddMutation,
    useGetMutation
} = eventApiSlice;