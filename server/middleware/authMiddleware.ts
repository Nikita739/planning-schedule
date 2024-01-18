import {Request, Response, NextFunction} from "express";
import ApiError from "../exeptions/apiError";
import tokenService from "../services/tokenService";

export default async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        let token = req.headers.authorization;

        if(!token) {
            return next(ApiError.UnauthorizedError());
        }

        token = token.split(" ")[1];

        if(!token) {
            return next(ApiError.UnauthorizedError());
        }

        const userData = await tokenService.validateAccessToken(token);
        if(!userData) {
            return next(ApiError.UnauthorizedError());
        }

        req['user'] = userData;
        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
}