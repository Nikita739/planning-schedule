export interface EventServerResponse {
    name: string,
    description?: string,
    date: string,
    id: number
}

export interface ScheduleEvent {
    name: string,
    date: Date,
    hour: number,
    description?: string,
    id: number
}

export interface RequestScheduleEvent {
    name: string,
    date: Date,
    hour: number,
    description?: string,
}

class EventService {
    serverResponseToEventData(res: EventServerResponse): ScheduleEvent {
        const date = new Date(res.date);
        const hour = date.getHours();

        return {
            name: res.name,
            date: date,
            hour: hour,
            description: res.description,
            id: res.id
        };
    }
}

export default new EventService();