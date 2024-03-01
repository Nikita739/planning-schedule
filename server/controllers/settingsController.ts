import {NextFunction, Request, Response} from "express";
import RequestService from "../services/requestService";
import settingsService from "../services/settingsService";

class SettingsController {
    async changePriorityColors(req: Request, res: Response, next: NextFunction) {
        try {
            const {newColors} = req.body;
            const userId = res.locals.user.id;

            RequestService.checkMissingParams({...req.body, userId: userId},
                ["userId", "newColors"]
            );

            return await settingsService.changePriorityColors(userId, newColors);
        } catch (e) {
            next(e);
        }
    }
}

export default new SettingsController();