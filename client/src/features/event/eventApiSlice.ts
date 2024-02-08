import {apiSlice} from "../../app/api/apiSlice";
import {FetchArgs} from "@reduxjs/toolkit/query/react";
import eventService, {EventServerResponse, RequestScheduleEvent, ScheduleEvent} from "./eventService";

function formatDate(rawDate: Date, hours: number): string {
    const date = new Date(rawDate);
    date.setHours(hours);

    return date.toISOString();
}

export const eventApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        addEvent: builder.mutation({
            query: (eventData: RequestScheduleEvent): FetchArgs => ({
                url: '/event/add',
                method: 'POST',
                body: {name: eventData.name, date: formatDate(eventData.date, eventData.hour), description: eventData.description}
            }),

            transformResponse(result: EventServerResponse): ScheduleEvent {
                return eventService.serverResponseToEventData(result);
            }
        }),

        updateEvent: builder.mutation({
            query: (eventData: {name?: string, description?: string, id: number}): FetchArgs => ({
                url: '/event/update',
                method: 'POST',
                body: {name: eventData.name, description: eventData.description, id: eventData.id}
            }),

            transformResponse(result: EventServerResponse): ScheduleEvent {
                return eventService.serverResponseToEventData(result);
            }
        }),

        getEvents: builder.mutation({
            query: (eventData): FetchArgs => ({
                url: '/event/get',
                method: 'GET',
            }),

            transformResponse(result: EventServerResponse[]): ScheduleEvent[] {
                const newArray: ScheduleEvent[] = [];

                for(let i = 0; i < result.length; i++) {
                    newArray.push(eventService.serverResponseToEventData(result[i]));
                }

                return newArray;
            }
        }),
    })
});

export const {
    useAddEventMutation,
    useGetEventsMutation,
    useUpdateEventMutation
} = eventApiSlice;