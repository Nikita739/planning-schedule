import {NextFunction, Request, Response} from "express";
import eventService from "../services/eventService";
import ApiError from "../exeptions/apiError";
import RequestService from "../services/requestService";
import {statfsSync} from "fs";

export interface IEventData {
    name: string;
    date: string;
    description?: string;
    endDate?: string;
    priority?: 1 | 2 | 3;
    repeat?: "weekly" | "monthly";
}

export interface IUpdateEventData {
    id: number;
    name?: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    priority?: 1 | 2 | 3;
}

export interface IDeleteEventData {
    id: number;
}

class EventController {
    async addEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const {name, description, date, endDate, priority, repeat}: IEventData = req.body;
            RequestService.checkMissingParams({name, date},
                ["date", "name"]
            );

            if(!res.locals.user) {
                return next(ApiError.UnauthorizedError());
            }

            const event = await eventService.addEvent(name, date, res.locals.user.id, description, endDate, priority, "weekly");
            return res.json(event);
        } catch (e) {
            next(e);
        }
    }

    async updateEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const {id, name, description, startTime, endTime, priority}: IUpdateEventData = req.body;
            const userId: number = res.locals.user.id;

            RequestService.checkMissingParams({...req.body, userId: userId},
                ["id", "userId"]
            );

            const updatedEvent = await eventService.updateEvent(userId, id, name, description, startTime, endTime, priority);
            res.json(updatedEvent);
        } catch (e) {
            next(e);
        }
    }

    async deleteEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const {id}: IDeleteEventData = req.body;
            const userId: number = res.locals.user.id;

            RequestService.checkMissingParams({...req.body, userId: userId},
                ["id", "userId"]
            );

            const deletedEvent = await eventService.deleteEvent(userId, id);
            res.json(deletedEvent);
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

    async getRepeatedEvents(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = res.locals.user.id;

            if(!userId) {
                next(ApiError.UnauthorizedError());
            }

            const repeatedEvents = await eventService.getRepeatedEvents(userId);
            return res.json(repeatedEvents);
        } catch (e) {
            next(e);
        }
    }
}

export default new EventController();