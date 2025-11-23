import express from "express";
import { sendContactMessage } from "../controllers/usersController.js";

const router = express.Router();

router.post("/", sendContactMessage);

export default router;
