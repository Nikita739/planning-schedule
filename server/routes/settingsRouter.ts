import {Router} from "express";
import SettingsController from "../controllers/settingsController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post('/change-settings', authMiddleware, SettingsController.changePriorityColors);

export default router;