import {NextFunction, Request, Response} from 'express';
import ApiError from "../exeptions/apiError";
import RequestService from "../services/requestService";
import authService from "../services/authService";

class UserController {
    registration(req: Request, res: Response, next: NextFunction): void {
        try {
            const {username, email, password} = req.body;

            // Check for missing parameters
            // const paramsCheck = RequestService.checkMissingParams(req.body,
            //     ["username", "email", "password"]
            // );
            // if(paramsCheck) {
            //     return next(ApiError.BadRequest("Some parameters missing", paramsCheck));
            // }

            const result = authService.registration(username, email, password);

            res.send("REGISTRATION");
        } catch (e) {
            next(e);
        }
    }

    login(req: Request, res: Response): void {
        res.send("LOGIN");
    }
}

export default new UserController();