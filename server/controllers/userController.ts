import {NextFunction, Request, Response} from 'express';
import ApiError from "../exeptions/apiError";
import RequestService from "../services/RequestService";

class UserController {
    registration(req: Request, res: Response, next: NextFunction): void {
        try {
            const {testParam} = req.params;

            const paramsCheck = RequestService.checkMissingParams(req.params, ["testParam"]);
            if(paramsCheck) {
                return next(ApiError.BadRequest("Some parameters missing", paramsCheck));
            }

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