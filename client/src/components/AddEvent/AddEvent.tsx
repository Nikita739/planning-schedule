import React, {useState} from 'react';
import {WeekDay} from "../../features/calendar/Calendar";
import {useAddMutation} from "../../features/event/eventApiSlice";
import {ScheduleEvent} from "../../pages/EventTable/EventTable";
import eventService from "../../features/event/eventService";
import cl from './AddEvent.module.css';
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";

interface Props {
    day: WeekDay | null,
    hour: number | null,
    addEvent: (event: ScheduleEvent) => void
}

const AddEvent = ({day, hour, addEvent}: Props) => {
    const [name, setName] = useState<string>("");

    const [add, {isLoading}] = useAddMutation();

    const submit = async (): Promise<void> => {
        // Submit event
        if(day && hour) {
            try {
                const eventData: ScheduleEvent = eventService.serverResponseToEventData(
                    await add({name: name, date: day.date, hours: hour}).unwrap()
                );

                // Event added successfully
                addEvent(eventData);
                console.log(eventData.date);
            } catch (err: any) {
                console.log(err);
            }
        }
    }

    return (
        <div>
            <div className={cl.contentBlock}>
                <p>Day: {day?.name}</p>
                <p>Hour: {hour}</p>
            </div>

            <div className={cl.contentBlock}>
                <Input
                    placeholder="Give a name for your event"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
            </div>
            <div className={cl.contentBlock}>
                <Button
                    onClick={submit}
                >
                    Submit
                </Button>
            </div>
        </div>
    );
};

export default AddEvent;