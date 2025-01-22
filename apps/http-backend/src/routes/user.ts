import express, { Router } from 'express'
import { Room, signin, signup } from '../controllers/user';
import { middleware } from '../middlewares/user';

const router:Router = express.Router();

router.post("/signup",signup);
router.post("/signin",signin);
router.post("/room",middleware,Room);

export default router;