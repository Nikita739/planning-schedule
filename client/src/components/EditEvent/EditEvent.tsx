import {WeekDay} from "../../features/calendar/Calendar";
import {ScheduleEvent} from "../../features/event/eventService";
import React, {useState} from "react";
import cl from "../AddEvent/AddEvent.module.css";
import Input from "../../UI/Input/Input";
import Textarea from "../../UI/Textarea/Textarea";
import Button from "../../UI/Button/Button";
import {useUpdateEventMutation} from "../../features/event/eventApiSlice";

interface Props {
    day: WeekDay | null,
    hour: number | null,
    originalName: string,
    originalDescription?: string,
    closeModal: () => any,
    id: number,
    reloadEvents: () => void
}

const EditEvent = ({day, hour, closeModal, id, originalDescription = "", originalName, reloadEvents}: Props) => {
    const [name, setName] = useState<string>(originalName || "");
    const [description, setDescription] = useState<string>(originalDescription || "");

    const [updateEvent, {isLoading}] = useUpdateEventMutation();

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

    return (
        <div>
            <div className={cl.contentBlock}>
                <p>Day: {day?.name}</p>
                <p>Hour: {hour}</p>
            </div>

            <div className={cl.contentBlock}>
                <Input
                    placeholder="Edit event name..."
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
            </div>
            <div className={cl.contentBlock}>
                <Textarea
                    placeholder="Edit event description..."
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                />
            </div>
            <div className={cl.contentBlock}>
                <Button
                    onClick={save}
                >
                    Save
                </Button>
            </div>
        </div>
    );
};

export default EditEvent;