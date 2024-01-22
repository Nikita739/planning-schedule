import {Router} from "express";
import UserController from "../controllers/userController";

const router = Router();

router.get('/login', UserController.login);
router.get('/logout', UserController.logout);
router.get('/refresh', UserController.refresh);
router.post('/registration', UserController.registration);

export default router;