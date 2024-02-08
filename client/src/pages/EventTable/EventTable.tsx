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
    reloadEvents: () => void
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

    const openModal = (day: WeekDay, hour: number) => {
        resetModal()

        // If the event is already planned for this cell, then open Edit Event window
        const isOccupied = checkTask(day.date, hour);
        if(isOccupied) {
            setIsModalOpen(true);
            setUpdateEventProps({
                day: day,
                hour: hour,
                originalName: isOccupied.name,
                originalDescription: isOccupied.description || "",
                closeModal: resetModal,
                id: isOccupied.id,
                reloadEvents
            });
        } else {
            setIsModalOpen(true);
            setAddEventProps({day, hour});
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

    return (
        <div className={cl.outer}>
            <table>
                <tbody className={cl.table}>
                    <tr>
                        <th></th>
                        {location.state.weekdays.map((el: WeekDay) =>
                            <th scope="row" key={el.name} className={el.name === location.state?.currentDay?.name ? cl.activeDay : null}>
                                {el.name}
                            </th>
                        )}
                    </tr>
                    {Array.from({ length: 24 }).fill(0).map((hour: any, index) =>
                        <tr key={index}>
                            <th>
                                {index + 1}:00
                            </th>
                            {location.state.weekdays.map((weekDay: WeekDay) =>
                                <td
                                    key={weekDay.name}
                                    onClick={() => openModal(weekDay, index + 1)}
                                >
                                    <p>
                                        {checkTask(weekDay.date, index + 1)?.name || " "}
                                    </p>
                                </td>
                            )}
                        </tr>
                    )}
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
                        />
                    </ModalWindow>
            }
        </div>
    );
};

export default EventTable;