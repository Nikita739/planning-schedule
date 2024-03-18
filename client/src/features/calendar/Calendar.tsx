import React, {useState} from 'react';
import {DateCalendar} from "@mui/x-date-pickers";
import {useNavigate} from "react-router-dom";
import calendarService from "./calendarService";

export interface WeekDay {
    date: Date;
    name: string;
}

const Calendar = () => {
    const navigate = useNavigate();

    const goToTable = (value: any): void => {
        const date: Date = new Date(value.$d);
        const weekdays: WeekDay[] = calendarService.getWeekdaysWithDate(date);

        const currentDay = calendarService.getDayInfoFromDate(date);
        navigate('/event-table', {state: {weekdays: weekdays, currentDay: currentDay}});
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