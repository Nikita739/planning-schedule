import {NextFunction, Request, Response} from 'express';
import ApiError from "../exeptions/apiError";
import RequestService from "../services/requestService";
import authService, {AuthResult} from "../services/authService";
import {IUserDto} from "../dtos/userDto";

interface LoginQueryParams {
    email: string;
    password: string;
}

class UserController {
    async registration(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const {username, email, password} = req.body;

            RequestService.checkMissingParams(req.body,
                ["username", "email", "password"]
            );

            const userData: AuthResult = await authService.registration(username, email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req: Request<{}, {}, {}, LoginQueryParams>, res: Response, next: NextFunction) {
        try {
            const {email, password} = req.query;

            RequestService.checkMissingParams({email, password},
                ["email", "password"]
            );

            const userData: AuthResult = await authService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await authService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const {refreshToken} = req.cookies;
            const token = await authService.logout(refreshToken!);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }
}

export default new UserController();