import express, { Router } from 'express'
import { createRoom, getChats, joinRoom, signin, signup } from '../controllers/user';
import { middleware } from '../middlewares/user';

const router:Router = express.Router();

router.post("/signup",signup);
router.post("/signin",signin);
router.post("/room",middleware,createRoom);
router.get("/chats/room/:roomId",middleware,getChats);
router.post("/room/:slug",middleware,joinRoom);

export default router;