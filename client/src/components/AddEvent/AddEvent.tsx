import React, {useEffect, useState} from 'react';
import {WeekDay} from "../../features/calendar/Calendar";
import {useAddEventMutation} from "../../features/event/eventApiSlice";
import {ScheduleEvent} from "../../features/event/eventService";
import cl from './AddEvent.module.css';
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";
import Textarea from "../../UI/Textarea/Textarea";
import SelectTime, {TimeBoundaries} from "../SelectTime/SelectTime";

interface Props {
    day: WeekDay | null,
    hour: number | null,
    addEventToResponse: (event: ScheduleEvent) => void,
    closeModal: () => any
}

const AddEvent = ({day, hour, addEventToResponse, closeModal}: Props) => {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const [startTime, setStartTime] = useState<number>(hour || 1);
    const [endTime, setEndTime] = useState<number>(startTime + 1);

    const [startTimeBoundaries, setStartTimeBoundaries] = useState<TimeBoundaries>({
        min: 1
    });
    const [endTimeBoundaries, setEndTimeBoundaries] = useState<TimeBoundaries>({
        min: startTime + 1
    });

    const [addEvent, {isLoading}] = useAddEventMutation();

    useEffect(() => {
        setEndTimeBoundaries({
            max: endTimeBoundaries?.max,
            min: startTime + 1,
        });
    }, [startTime]);

    useEffect(() => {
        const now = new Date();
        const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        let daySelectedWithoutTime = day?.date;

        if (day?.date) {
            daySelectedWithoutTime = new Date(Date.UTC(day.date.getUTCFullYear(), day.date.getUTCMonth(), day.date.getUTCDate() + 1));
        }

        console.log(daySelectedWithoutTime);

        // @ts-ignore
        const startMin = today >= daySelectedWithoutTime ? new Date().getHours() : 1;

        setStartTimeBoundaries({
            min: startMin
        });
    }, []);

    const submit = async (): Promise<void> => {
        // Submit event
        if(day && hour) {
            try {
                const eventData: ScheduleEvent = await addEvent({name: name, date: day.date, hour: startTime, description: description, endHour: endTime}).unwrap();

                // Event added successfully
                addEventToResponse(eventData);
                closeModal();
                console.log(eventData.date);
            } catch (err: any) {
                console.log(err);
            }
        }
    }

    const onStartTimeChange = (num: number) => {
        setStartTime(num);
        if(num >= endTime) {
            console.log("HERE!!!")
            setEndTime(num + 1);
        }
    }

    const onEndTimeChange = (num: number) => {
        setEndTime(num);
    }

    return (
        <div className={cl.outer}>
            <div className={cl.contentBlock}>
                <p>Day: {day?.name}</p>
                <p>Hour: {hour}</p>
            </div>

            <p>Start time:</p>
            <SelectTime
                onChange={onStartTimeChange}
                className={cl.timeSelect}
                value={startTime}
                boundaries={startTimeBoundaries}
            />

            <p>End time:</p>
            <SelectTime
                onChange={onEndTimeChange}
                className={cl.timeSelect}
                value={endTime}
                boundaries={endTimeBoundaries}
            />

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