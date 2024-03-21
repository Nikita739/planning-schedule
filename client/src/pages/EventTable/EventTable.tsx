import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import {WeekDay} from "../../features/calendar/Calendar";
import cl from './EventTable.module.css';
import ModalWindow from "../../components/ModalWindow/ModalWindow";
import AddEvent from "../../components/AddEvent/AddEvent";
import {ScheduleEvent} from "../../features/event/eventService";
import {useGetEventsMutation} from "../../features/event/eventApiSlice";
import EditEvent from "../../components/EditEvent/EditEvent";
import {
    selectSettings,
    ISettings
} from "../../features/auth/authSlice";
import {store} from "../../app/store";
import SelectPriorityColors from "../../components/SelectPriorityColors/SelectPriorityColors";
import Button from "../../UI/Button/Button";
import calendarService from "../../features/calendar/calendarService";

interface AddEventProps {
    day: WeekDay,
    hour: number
}

interface UpdateEventProps {
    day: WeekDay | null,
    hour: number | null,
    originalName: string,
    originalDescription: string,
    closeModal: () => any,
    id: number,
    reloadEvents: () => void,
    hasOccurred?: boolean,
    endDate: Date
}

interface TableCell {
    className: string;
    day: number;
    hour: number;
    event?: ScheduleEvent;
    rowspan?: number;
}

const defaultPriorityColors: string[] = ["green", "yellow", "red"];

const initTableCells = (weekdays: WeekDay[], events: ScheduleEvent[], openModal: (day: WeekDay, hour: number, occupied: null | ScheduleEvent) => void,
                        priorityColors: string[] = defaultPriorityColors): any[] => {
    const isEveryWeek = true;



    const rows = [];

    for (let hour = 1; hour <= 24; hour++) {
        const cells: TableCell[] = [];

        for (let i = 0; i < 7; i++) {
            let day: WeekDay = weekdays[i];

            const event = events.find(event => {
                const dayDate = new Date(day.date);
                dayDate.setHours(hour);

                // return (hour >= eventHour && hour < eventHourEnd) && (dayDate >= event.date && dayDate <= event.endDate);
                return isEventInRange(event.date, event.endDate, dayDate, hour, isEveryWeek);
            });

            let rowspan = 1;
            if (event) {
                const eventStartDate = new Date(event.date);
                const eventStartHour = eventStartDate.getHours();
                const eventEndDate = new Date(event.endDate);
                const eventEndHour = eventEndDate.getHours();

                // If the current hour is the start hour of the event, calculate rowspan
                if (hour === eventStartHour) {
                    rowspan = 24 - eventStartHour;
                    if (eventEndHour < 24) {
                        rowspan = Math.min(rowspan, eventEndHour - eventStartHour);
                    }
                } else {
                    // Skip cells that are not the start hour of the event
                    continue;
                }
            }

            const className = event ? 'event-cell' : '';


            cells.push({
                day: i,
                hour: hour,
                className: className,
                event: event,
                rowspan: rowspan,
            });
        }

        rows.push(
            <tr key={hour}>
                <th>{hour}:00</th>
                {cells.map(el =>
                    <td
                        key={`${el.day}-${el.hour}`}
                        className={[cl[el.className]].join(" ")}
                        style={{backgroundColor: el.event?.priority && priorityColors[el.event?.priority - 1]}}
                        onClick={() => openModal(weekdays[el.day], el.hour, el.event || null)}
                        rowSpan={el.rowspan}
                    >
                        {el.event ? el.event.name : ''}
                    </td>
                )}
            </tr>
        );
    }

    return rows;
}

function isEventInRange(startDate: Date, endDate: Date, currentDate: Date, currentHour: number, isEveryWeek: boolean) {
    let startTimestamp = startDate.getTime();
    let endTimestamp = endDate.getTime();
    let currentTimestamp = currentDate.getTime();

    // Check if current date is within the event's start and end dates
    if (currentTimestamp >= startTimestamp && currentTimestamp <= endTimestamp) {
        // Check if the current hour is within the event's start and end hours
        if (currentTimestamp === startTimestamp && currentHour < startDate.getHours()) {
            // If the current date is the same as the event's start date and the current hour is before the event's start hour
            return false;
        }
        if (currentTimestamp === endTimestamp && currentHour > endDate.getHours()) {
            // If the current date is the same as the event's end date and the current hour is after the event's end hour
            return false;
        }
        // Otherwise, the event is within the time range
        return true;
    }

    // If the current date is outside the event's start and end dates
    return false;
}

// function isEventInRange(startDate: Date, endDate: Date, currentDate: Date, currentHour: number, repeatWeek: boolean) {
//     const startTimestamp = startDate.getTime();
//     const endTimestamp = endDate.getTime();
//     const currentTimestamp = currentDate.getTime();
//
//     // If repeatWeek is true, check if the current day and time fall within the weekly range
//     if (repeatWeek) {
//         // Calculate the difference in milliseconds between the current date and the start date
//         const timeDiff = currentTimestamp - startTimestamp;
//
//         // Calculate the number of milliseconds in a week
//         const oneWeek = 7 * 24 * 60 * 60 * 1000;
//
//         // Adjust the current date to the nearest occurrence of the event based on the start date
//         const adjustedCurrentTimestamp = startTimestamp + Math.floor(timeDiff / oneWeek) * oneWeek;
//
//         // Check if the adjusted current date is within the event's start and end dates
//         if (adjustedCurrentTimestamp >= startTimestamp && adjustedCurrentTimestamp <= endTimestamp) {
//             // Check if the current hour is within the event's start and end hours
//             const adjustedCurrentDate = new Date(adjustedCurrentTimestamp);
//             if (adjustedCurrentDate.getHours() === currentHour) {
//                 return true;
//             }
//         }
//
//         return false;
//     }
//
//     // Check if current date is within the event's start and end dates
//     if (currentTimestamp >= startTimestamp && currentTimestamp <= endTimestamp) {
//         // Check if the current hour is within the event's start and end hours
//         if (currentTimestamp === startTimestamp && currentHour < startDate.getHours()) {
//             // If the current date is the same as the event's start date and the current hour is before the event's start hour
//             return false;
//         }
//         if (currentTimestamp === endTimestamp && currentHour > endDate.getHours()) {
//             // If the current date is the same as the event's end date and the current hour is after the event's end hour
//             return false;
//         }
//         // Otherwise, the event is within the time range
//         return true;
//     }
//
//     // If the current date is outside the event's start and end dates
//     return false;
// }

interface WeekInfo {
    weekdays: WeekDay[],
    currentDay: WeekDay
}

const EventTable = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [addEventProps, setAddEventProps] = useState<AddEventProps | null>(null);
    const [updateEventProps, setUpdateEventProps] = useState<UpdateEventProps | null>(null);

    const [events, setEvents] = useState<ScheduleEvent[]>([]);

    const location = useLocation();

    const [weekInfo, setWeekInfo]= useState<WeekInfo>(location.state);

    const [getEvents] = useGetEventsMutation();

    const [settings, setSettings] = useState<ISettings | null>(selectSettings(store.getState()));
    const priorityColors = settings?.priorityColors;

    const priorityColorsChanged = () => {
        setSettings(selectSettings(store.getState()));
    }

    useEffect(() => {
        reloadEvents().then();
    }, []);

    const reloadEvents = async () => {
        try {
            const events: ScheduleEvent[] = await getEvents({}).unwrap();
            setEvents(events);
        } catch (e) {
            console.log(e)
        }
    }

    const checkTask = (date: Date, hour: number): ScheduleEvent | null => {
        const filteredResponse = events.filter((el) => el.date.getDate() === date.getDate() && el.hour === hour);

        if(filteredResponse.length !== 0) {
            return filteredResponse[0];
        }

        return null;
    }

    const openModal = (day: WeekDay, hour: number, occupied: null | ScheduleEvent): void => {
        resetModal()

        // If the event is already planned for this cell, then open Edit Event window
        if(occupied?.date) {
            const eventDate = new Date(occupied.date);
            eventDate.setHours(hour);

            if(occupied) {
                setIsModalOpen(true);
                setUpdateEventProps({
                    day: day,
                    hour: occupied.hour,
                    originalName: occupied.name,
                    originalDescription: occupied.description || "",
                    closeModal: resetModal,
                    id: occupied.id,
                    reloadEvents,
                    hasOccurred: new Date() > eventDate,
                    endDate: occupied.endDate
                });
            }
        } else if(!occupied) {
            const cellDate = new Date(day.date);
            cellDate.setHours(hour);

            if(new Date() <= cellDate) {
                setIsModalOpen(true);
                setAddEventProps({day, hour});
            }
        }
    }

    const resetModal = (): void => {
        setIsModalOpen(false);
        setAddEventProps(null);
        setUpdateEventProps(null);
    }

    const addEvent = (newEvent: ScheduleEvent): void => {
        setEvents([...events, newEvent]);
    }

    const moveWeekdays = (velocity: number = 0) => {
        velocity = Math.round(velocity);

        // Add the velocity * days to the date
        const updatedDay = weekInfo.currentDay.date;
        updatedDay.setDate(updatedDay.getDate() + velocity);

        const newWeekDays = calendarService.getWeekdaysWithDate(updatedDay);
        setWeekInfo({
            weekdays: newWeekDays,
            currentDay: calendarService.getDayInfoFromDate(updatedDay)
        });
    }

    const rows = initTableCells(weekInfo.weekdays, events, openModal, priorityColors);

    return (
        <div className={cl.outer}>
            <div>
                <SelectPriorityColors onChange={priorityColorsChanged} />
            </div>

            <div className={cl.tableWrapper}>
                <div className={cl.dayControlWrapper}>
                    <Button
                        onClick={() => moveWeekdays(-7)}
                    >
                        Previous week
                    </Button>
                    <Button
                        onClick={() => moveWeekdays(-1)}
                    >
                        Previous day
                    </Button>
                </div>
                <table>
                    <thead>
                    <tr>
                        <th></th>
                        {weekInfo.weekdays.map((el: WeekDay) =>
                            <th scope="row" key={el.name} className={el.name === weekInfo?.currentDay?.name ? cl.activeDay : null}>
                                <p>
                                    {el.date.toJSON().slice(0,10).split('-').reverse().join('.')}
                                </p>
                                <p>{el.name}</p>
                            </th>
                        )}
                    </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                <div className={cl.dayControlWrapper}>
                    <Button
                        onClick={() => moveWeekdays(7)}
                    >
                        Next week
                    </Button>
                    <Button
                        onClick={() => moveWeekdays(1)}
                    >
                        Next day
                    </Button>
                </div>
            </div>

            {isModalOpen && addEventProps
                &&
                    <ModalWindow setIsOpen={setIsModalOpen}>
                        <AddEvent
                            day={addEventProps?.day || null}
                            hour={addEventProps?.hour || null}
                            addEventToResponse={addEvent}
                            closeModal={() => setIsModalOpen(false)}
                        />
                    </ModalWindow>
            }
            {isModalOpen && updateEventProps
                &&
                    <ModalWindow setIsOpen={setIsModalOpen}>
                        <EditEvent
                            day={updateEventProps.day}
                            hour={updateEventProps.hour}
                            originalName={updateEventProps.originalName}
                            originalDescription={updateEventProps.originalDescription}
                            closeModal={updateEventProps.closeModal}
                            id={updateEventProps.id}
                            reloadEvents={updateEventProps.reloadEvents}
                            hasOccurred={updateEventProps.hasOccurred}
                            endDate={updateEventProps.endDate}
                        />
                    </ModalWindow>
            }
        </div>
    );
};

export default EventTable;