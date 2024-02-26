import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import {WeekDay} from "../../features/calendar/Calendar";
import cl from './EventTable.module.css';
import ModalWindow from "../../components/ModalWindow/ModalWindow";
import AddEvent from "../../components/AddEvent/AddEvent";
import {ScheduleEvent} from "../../features/event/eventService";
import {useGetEventsMutation} from "../../features/event/eventApiSlice";
import EditEvent from "../../components/EditEvent/EditEvent";

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

const EventTable = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [addEventProps, setAddEventProps] = useState<AddEventProps | null>(null);
    const [updateEventProps, setUpdateEventProps] = useState<UpdateEventProps | null>(null);

    const [events, setEvents] = useState<ScheduleEvent[]>([]);

    const location = useLocation();

    const [getEvents, {isLoading}] = useGetEventsMutation();

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

    const generateP = (date: Date, hour: number) => {
        const res = checkTask(date, hour);
        return res !== null ? res.name : " ";
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












    const rows = [];

    for (let hour = 1; hour <= 24; hour++) {
        const cells: TableCell[] = [];

        for (let i = 0; i < 7; i++) {
            let day: WeekDay = location.state.weekdays[i];

            const event = events.find(event => {
                const eventDay = event.date.getDay();
                const eventHour = event.date.getHours();
                const eventHourEnd = event.endDate.getHours();

                const dayDate = new Date(day.date);
                dayDate.setHours(hour);

                return (hour >= eventHour && hour < eventHourEnd) && (dayDate >= event.date && dayDate <= event.endDate);
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
                rowspan: rowspan
            });
        }

        rows.push(
            <tr key={hour}>
                <th>{hour}:00</th>
                {cells.map(el =>
                    <td
                        key={`${el.day}-${el.hour}`}
                        className={cl[el.className]}
                        onClick={() => openModal(location.state.weekdays[el.day], el.hour, el.event || null)}
                        rowSpan={el.rowspan}
                    >
                        {el.event ? el.event.name : ''}
                    </td>
                )}
            </tr>
        );
    }


    return (
        <div className={cl.outer}>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        {location.state.weekdays.map((el: WeekDay) =>
                            <th scope="row" key={el.name} className={el.name === location.state?.currentDay?.name ? cl.activeDay : null}>
                                {el.name}
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
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