import {NextFunction, Request, Response} from "express";
import eventService from "../services/eventService";
import ApiError from "../exeptions/apiError";
import RequestService from "../services/requestService";

export interface IEventData {
    name: string;
    date: string;
    description?: string;
}

export interface IUpdateEventData {
    id: number;
    name?: string;
    description?: string;
}

class EventController {
    async addEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const {name, description, date}: IEventData = req.body;
            RequestService.checkMissingParams({name, date},
                ["date", "name"]
            );

            if(!res.locals.user) {
                return next(ApiError.UnauthorizedError());
            }

            const event = await eventService.addEvent(name, date, res.locals.user.id, description);
            return res.json(event);
        } catch (e) {
            next(e);
        }
    }

    async updateEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const {id, name, description}: IUpdateEventData = req.body;
            const userId: number = res.locals.user.id;

            RequestService.checkMissingParams({...req.body, userId: userId},
                ["id", "userId"]
            );

            const updatedEvent = await eventService.updateEvent(userId, id, name, description);
            res.json(updatedEvent);
        } catch (e) {
            next(e);
        }
    }

    async getEvents(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = res.locals.user.id;

            if(!userId) {
                next(ApiError.UnauthorizedError());
            }

            const events = await eventService.getEvents(userId);
            return res.json(events);
        }
         catch (e) {
            next(e);
        }
    }
}

export default new EventController();