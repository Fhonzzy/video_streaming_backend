import express from "express";
import { googleAuthController } from "../controllers/AuthController.googleLogin";

const router = express.Router();

router.post("/auth/google", googleAuthController);

export default router;
