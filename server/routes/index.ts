import {Router} from "express";

import userRouter from "./userRouter";
import eventRouter from "./eventRouter";
import settingsRouter from "./settingsRouter";

const router = Router();
router.use('/user', userRouter);
router.use('/event', eventRouter);
router.use('/settings', settingsRouter);

export default router;