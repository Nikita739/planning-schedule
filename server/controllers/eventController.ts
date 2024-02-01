import {NextFunction, Request, Response} from "express";
import eventService from "../services/eventService";
import {IUserDto} from "../dtos/userDto";
import {AuthRequest} from "../middleware/authMiddleware";
import ApiError from "../exeptions/apiError";
import RequestService from "../services/requestService";

export interface IEventData {
    name: string;
    date: Date;
}

class EventController {
    async addEvent(req: Request, res: Response, next: NextFunction) {
        try {
            let {name, date}: IEventData = req.body;

            date = new Date();

            RequestService.checkMissingParams({name, date},
                ["date", "name"]
            );

            if(!res.locals.user) {
                return next(ApiError.UnauthorizedError());
            }

            const event = await eventService.addEvent(name, date, res.locals.user.id);
            return res.json(event);
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