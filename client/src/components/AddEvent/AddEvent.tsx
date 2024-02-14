import React, {useState} from 'react';
import {WeekDay} from "../../features/calendar/Calendar";
import {useAddEventMutation} from "../../features/event/eventApiSlice";
import {ScheduleEvent} from "../../features/event/eventService";
import cl from './AddEvent.module.css';
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";
import Textarea from "../../UI/Textarea/Textarea";

interface Props {
    day: WeekDay | null,
    hour: number | null,
    addEventToResponse: (event: ScheduleEvent) => void,
    closeModal: () => any
}

const AddEvent = ({day, hour, addEventToResponse, closeModal}: Props) => {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const [addEvent, {isLoading}] = useAddEventMutation();

    const submit = async (): Promise<void> => {
        // Submit event
        if(day && hour) {
            try {
                const eventData: ScheduleEvent = await addEvent({name: name, date: day.date, hour: hour, description: description}).unwrap();

                // Event added successfully
                addEventToResponse(eventData);
                closeModal();
                console.log(eventData.date);
            } catch (err: any) {
                console.log(err);
            }
        }
    }

    return (
        <div className={cl.outer}>
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
                <Textarea
                    placeholder="Give a description for your event (optional)"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                />
            </div>
            <div className={cl.contentBlock}>
                <div className={cl.actions}>
                    <Button
                        onClick={submit}
                    >
                        Submit
                    </Button>
                    <Button
                        onClick={() => closeModal()}
                    >
                        Close
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default AddEvent;