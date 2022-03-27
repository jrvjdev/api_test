import { Router } from "express";

import authMiddleware from "./app/middlewares/authMiddleware";
import UserController from "./app/controlers/UserController";

const router = Router();

router.get('/signIn', UserController.signIn);
router.post('/signUp', UserController.signUp);
router.put('/update', authMiddleware, UserController.update);
router.delete('/delete', authMiddleware, UserController.delete);

export default router;
