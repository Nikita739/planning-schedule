export interface RequestScheduleEvent {
    name: string,
    date: Date,
    endDate?: Date,
    endHour?: number
    hour: number,
    description?: string,
    priority?: number;
}

export interface ScheduleEvent {
    name: string,
    date: Date,
    endDate: Date
    hour: number,
    description?: string,
    id: number,
    priority: 1 | 2 | 3
}

export interface EventServerResponse {
    name: string,
    description?: string,
    date: string,
    endDate: Date,
    id: number,
    priority: 1 | 2 | 3
}

class EventService {
    serverResponseToEventData(res: EventServerResponse): ScheduleEvent {
        const date = new Date(res.date);
        const endDate = new Date(res.endDate);
        const hour = date.getHours();

        return {
            name: res.name,
            date: date,
            hour: hour,
            description: res.description,
            id: res.id,
            endDate: endDate,
            priority: res.priority
        };
    }
}

export default new EventService();