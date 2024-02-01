import React, {useState} from 'react';
import {DateCalendar} from "@mui/x-date-pickers";
import {useNavigate} from "react-router-dom";

export interface WeekDay {
    date: Date;
    name: string;
}

const Calendar = () => {
    const navigate = useNavigate();

    const goToTable = (value: any): void => {
        const date: Date = new Date(value.$d);
        const weekdays: WeekDay[] = getWeekdaysWithDate(date);

        const weekdaysArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        navigate('/event-table', {state: {weekdays: weekdays, currentDay: {date: date, name: weekdaysArray[date.getDay()]}}});
    }

    function getWeekdaysWithDate(date: Date): WeekDay[] {
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const result: WeekDay[] = [];

        const dayOfWeek = date.getDay();

        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - dayOfWeek);

        const endOfWeek = new Date(date);
        endOfWeek.setDate(date.getDate() + (6 - dayOfWeek));

        for (let d = new Date(startOfWeek); d <= endOfWeek; d.setDate(d.getDate() + 1)) {
            result.push({ name: weekdays[d.getDay()], date: new Date(d) });
        }

        return result;
    }

    return (
        <div>
            <DateCalendar
                onChange={(newValue) => goToTable(newValue)}
            />
        </div>
    );
};

export default Calendar;