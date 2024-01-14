import {Router} from "express";
import UserController from "../controllers/UserController";

const router = Router();

router.get('/login', UserController.login);
router.get('/registration', UserController.registration);

export default router;