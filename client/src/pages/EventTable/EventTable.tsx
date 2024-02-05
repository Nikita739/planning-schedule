import React, {useState} from 'react';
import {useLocation} from "react-router-dom";
import {WeekDay} from "../../features/calendar/Calendar";
import cl from './EventTable.module.css';
import ModalWindow from "../../components/ModalWindow/ModalWindow";
import AddEvent from "../../components/AddEvent/AddEvent";

interface ModalProps {
    day: WeekDay,
    hour: number
}

export interface ScheduleEvent {
    name: string,
    date: Date,
    hour: number
}

const EventTable = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalProps, setModalProps] = useState<ModalProps | null>(null);
    const [events, setEvents] = useState<ScheduleEvent[]>([]);

    const location = useLocation();

    const checkTask = (date: Date, hour: number) => {
        const filteredResponse = events.filter((el) => el.date.getDate() === date.getDate() && el.hour === hour);

        if(filteredResponse.length !== 0) {
            return filteredResponse;
        }

        return null;
    }

    const generateP = (date: Date, hour: number) => {
        const res = checkTask(date, hour);
        return res !== null ? res[0].name : " ";
    }

    const openModal = (day: WeekDay, hour: number) => {
        setIsModalOpen(true);
        setModalProps({day, hour});
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
                                        {generateP(weekDay.date, index + 1) || "Error"}
                                    </p>
                                </td>
                            )}
                        </tr>
                    )}
                </tbody>
            </table>
            {isModalOpen && modalProps
                &&
                    <ModalWindow setIsOpen={setIsModalOpen}>
                        <AddEvent
                            day={modalProps.day || null}
                            hour={modalProps.hour || null}
                            addEvent={addEvent}
                        />
                    </ModalWindow>
            }
        </div>
    );
};

export default EventTable;