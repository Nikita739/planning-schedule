import {Router} from "express";
import UserController from "../controllers/userController";

const router = Router();

router.get('/login', UserController.login);
router.post('/registration', UserController.registration);

export default router;