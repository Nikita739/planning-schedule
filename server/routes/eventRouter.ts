import {Router} from "express";
import EventController from "../controllers/eventController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post('/add', authMiddleware, EventController.addEvent);
router.get('/get', authMiddleware, EventController.getEvents);

export default router;