import {ScheduleEvent} from "../../pages/EventTable/EventTable";

interface EventServerResponse {
    name: string,
    date: string
}

class EventService {
    serverResponseToEventData(res: EventServerResponse): ScheduleEvent {
        const date = new Date(res.date);
        const hour = date.getHours();

        return {
            name: res.name,
            date: date,
            hour: hour
        };
    }
}

export default new EventService();