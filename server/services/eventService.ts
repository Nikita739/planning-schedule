import models, {IRepeatWeekly} from "../models/models";
import ApiError from "../exeptions/apiError";

const {Event, RepeatWeekly} = models;

class EventService {
    async addEvent(name: string, date: string, userId: number, description?: string, endDate?: string, priority?: 1 | 2 | 3, repeat?: "weekly" | "monthly") {
        const eventWithSameDate = await Event.findOne({
            where: {
                date: date
            }
        });

        if(eventWithSameDate) {
            throw ApiError.BadRequest("Event is already planned for this time");
        }

        const parsedDate: Date = this.parseDate(date);
        parsedDate.setHours(parsedDate.getHours() + 1);

        //@ts-ignore
        const event = await Event.create({
            date: date,
            name: name,
            userId: userId,
            description: description,
            endDate: endDate || parsedDate.toISOString(),
            priority: priority
        });

        // Repeat event every week
        if(repeat === "weekly") {
            const repeatWeekly = await this.repeatEvent(event.id, event.userId, this.parseDate(date));
        }

        return event;
    }

    async repeatEvent(eventId: number, userId: number, eventDate: Date): Promise<IRepeatWeekly> {
        const day = eventDate.getDay();
        const hour = eventDate.getHours();

        //@ts-ignore
        return await RepeatWeekly.create({
            day: day,
            hour: hour,
            eventId: eventId,
            userId: userId
        });
    }

    async updateEvent(userId: number, eventId: number, name?: string, description?: string, startTime?: string, endTime?: string, priority?: 1 | 2 | 3) {
        const event = await Event.findOne({where: {id: eventId, userId: userId}});
        if(!event) {
            throw ApiError.BadRequest("Event with this id and userId is not found");
        }

        name && (event.name = name);
        description && (event.description = description);
        startTime && (event.date = startTime);
        endTime && (event.endDate = endTime);
        priority && (event.priority = priority);

        await event.save();
        return event;
    }

    async deleteEvent(userId: number, eventId: number) {
        const event = await Event.findOne({where: {id: eventId, userId: userId}});
        if(!event) {
            throw ApiError.BadRequest("Event with this id and userId is not found");
        }

        await event.destroy();
        return event;
    }

    async getEvents(userId: number) {
        return await Event.findAll({
            where: {userId: userId}
        });
    }

    async getRepeatedEvents(userId: number) {
        return await RepeatWeekly.findAll({where: {userId: userId}});
    }

    parseDate(date: string): Date {
        return new Date(date);
    }
}

export default new EventService();