import models from "../models/models";
import ApiError from "../exeptions/apiError";

const {Event} = models;

class EventService {
    async addEvent(name: string, date: Date, userId: number) {
        const eventWithSameDate = await Event.findOne({
            where: {
                date: date
            }
        });

        if(eventWithSameDate) {
            throw ApiError.BadRequest("Event is already planned for this time");
        }

        return await Event.create({
            date: this.formatDate(date),
            name: name,
            userId: userId
        });
    }

    async getEvents(userId: number) {
        return await Event.findAll({
            where: {userId: userId}
        });
    }

    formatDate(date: Date): string {
        let datePart = [
            date.getMonth() + 1,
            date.getDate(),
            date.getFullYear()
        ].map((n, i) => n.toString().padStart(i === 2 ? 4 : 2, "0")).join("-");
        let timePart = [
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        ].map((n, i) => n.toString().padStart(2, "0")).join(":");
        return datePart + " " + timePart;
    }
}

export default new EventService();