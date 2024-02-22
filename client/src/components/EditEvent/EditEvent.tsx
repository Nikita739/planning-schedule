import {WeekDay} from "../../features/calendar/Calendar";
import {ScheduleEvent} from "../../features/event/eventService";
import React, {useState} from "react";
import cl from "./EditEvent.module.css";
import Input from "../../UI/Input/Input";
import Textarea from "../../UI/Textarea/Textarea";
import Button from "../../UI/Button/Button";
import {useUpdateEventMutation, useDeleteEventMutation} from "../../features/event/eventApiSlice";

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

    const [updateEvent, {isLoading}] = useUpdateEventMutation();
    const [deleteEvent] = useDeleteEventMutation();

    const haveValuesChanged = (): boolean => {
        if(originalName !== name) return true;
        if(originalDescription !== description) return true;

        return false;
    }

    const save = async () => {
        try {
            const eventData: ScheduleEvent = await updateEvent({name: name, description: description, id: id}).unwrap();

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