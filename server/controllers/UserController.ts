import {Request, Response} from 'express';

class UserController {
    registration(req: Request, res: Response): void {
        res.send("REGISTRATION");
    }

    login(req: Request, res: Response): void {
        res.send("LOGIN");
    }
}

export default new UserController();