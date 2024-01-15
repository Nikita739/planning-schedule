import {NextFunction, Request, Response} from 'express';
import ApiError from "../exeptions/apiError";
import RequestService from "../services/requestService";
import authService, {AuthResult} from "../services/authService";

class UserController {
    async registration(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const {username, email, password} = req.body;

            const paramsCheck = RequestService.checkMissingParams(req.body,
                ["username", "email", "password"]
            );
            if(paramsCheck) {
                return next(ApiError.BadRequest("Some parameters missing", paramsCheck));
            }

            const userData: AuthResult = await authService.registration(username, email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        res.send("LOGIN");
    }
}

export default new UserController();