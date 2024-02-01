import React from 'react';
import {useLocation} from "react-router-dom";
import {WeekDay} from "../../features/calendar/Calendar";
import cl from './EventTable.module.css';

const EventTable = () => {
    const location = useLocation();

    // Mock server response
    const serverResponse = [
        {
            name: "Do homework",
            date: new Date(),
            hour: 12
        },
        {
            name: "TEST",
            date: new Date(),
            hour: 14
        },
    ];

    const checkTask = (date: Date, hour: number) => {
        const filteredResponse = serverResponse.filter((el) => el.date.getDate() === date.getDate() && el.hour === hour);

        if(filteredResponse.length !== 0) {
            return filteredResponse;
        }

        return null;
    }

    const generateP = (date: Date, hour: number) => {
        console.log(date, hour);

        const res = checkTask(date, hour);
        return res !== null ? res[0].name : " ";
    }

    return (
        <div>
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
                                <td key={weekDay.name}>
                                    <p>
                                        {generateP(weekDay.date, index + 1) || "Error"}
                                    </p>
                                </td>
                            )}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default EventTable;