import models from "../models/models";
import ApiError from "../exeptions/apiError";

const {Event} = models;

class EventService {
    async addEvent(name: string, date: string, userId: number, description?: string) {
        const eventWithSameDate = await Event.findOne({
            where: {
                date: date
            }
        });

        if(eventWithSameDate) {
            throw ApiError.BadRequest("Event is already planned for this time");
        }

        return await Event.create({
            date: date,
            name: name,
            userId: userId,
            description: description
        });
    }

    async getEvents(userId: number) {
        return await Event.findAll({
            where: {userId: userId}
        });
    }
}

export default new EventService();