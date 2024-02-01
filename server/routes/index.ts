import {Router} from "express";

import userRouter from "./userRouter";
import eventRouter from "./eventRouter";

const router = Router();
router.use('/user', userRouter);
router.use('/event', eventRouter);

export default router;