import {WeekDay} from "../../features/calendar/Calendar";
import {ScheduleEvent} from "../../features/event/eventService";
import React, {useState} from "react";
import cl from "./EditEvent.module.css";
import Input from "../../UI/Input/Input";
import Textarea from "../../UI/Textarea/Textarea";
import Button from "../../UI/Button/Button";
import {useUpdateEventMutation, useDeleteEventMutation} from "../../features/event/eventApiSlice";
import SelectTimeRange from "../SelectTimeRange/SelectTimeRange";

interface Props {
    day: WeekDay | null,
    hour: number | null,
    originalName: string,
    originalDescription?: string,
    closeModal: () => any,
    id: number,
    reloadEvents: () => void,
    hasOccurred?: boolean,
    endDate: Date
}

const EditEvent = ({day, hour, closeModal, id, originalDescription = "", originalName, reloadEvents, hasOccurred = false, endDate}: Props) => {
    const [name, setName] = useState<string>(originalName || "");
    const [description, setDescription] = useState<string>(originalDescription || "");

    const [startTime, setStartTime] = useState<number>(hour || 0);
    const [endTime, setEndTime] = useState<number>(endDate.getHours());

    const [updateEvent, {isLoading}] = useUpdateEventMutation();
    const [deleteEvent] = useDeleteEventMutation();

    const getStartTimeMin = (): number => {
        const now = new Date();
        const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        let daySelectedWithoutTime = day?.date;

        if (day?.date) {
            daySelectedWithoutTime = new Date(Date.UTC(day.date.getUTCFullYear(), day.date.getUTCMonth(), day.date.getUTCDate() + 1));
        }

        // @ts-ignore
        return today >= daySelectedWithoutTime ? new Date().getHours() : 1;
    }

    const haveValuesChanged = (): boolean => {
        if(originalName !== name) return true;
        if(originalDescription !== description) return true;

        return false;
    }

    const save = async () => {
        try {
            const startDate = day?.date ? new Date(day?.date) : undefined;
            startDate?.setHours(startTime);

            const endDate = day?.date ? new Date(day?.date) : undefined;
            endDate?.setHours(endTime);

            const eventData: ScheduleEvent = await updateEvent({name: name, description: description, id: id, startDate, endDate}).unwrap();

            // Event added successfully
            reloadEvents();
            closeModal();
            console.log(eventData.date);
        } catch (err: any) {
            console.log(err);
        }
    }

    const deleteEventFromTable = async () => {
        try {
            const eventData: ScheduleEvent = await deleteEvent({id: id}).unwrap();

            // Event deleted successfully
            reloadEvents();
            closeModal();
        } catch (err: any) {
            console.log(err);
        }
    }

    return (
        <div className={cl.outer}>
            <div className={cl.contentBlock}>
                <p>Day: {day?.name}</p>
                <p>Start time: {hour}:00</p>
                <p>End time: {endDate.getHours()}:00</p>
            </div>

            <SelectTimeRange
                setStartTime={setStartTime}
                setEndTime={setEndTime}
                startTime={startTime}
                endTime={endTime}
                min={getStartTimeMin()}
            />

            <div className={cl.contentBlock}>
                <Input
                    placeholder="Edit event name..."
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    disabled={hasOccurred}
                />
            </div>
            <div className={cl.contentBlock}>
                <Textarea
                    placeholder="Edit event description..."
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    disabled={hasOccurred}
                />
            </div>
            <div className={cl.contentBlock}>
                <div className={cl.actions}>
                    {!hasOccurred
                    &&
                    <Button
                        onClick={save}
                    >
                        Save
                    </Button>
                    }
                    <Button onClick={deleteEventFromTable}>
                        Delete event
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

export default EditEvent;