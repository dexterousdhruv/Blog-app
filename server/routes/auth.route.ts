import { Router } from "express";
import { signInController, signUpController, getProfile } from "../controllers/auth.controller";
import { verifyUser } from "../utils/verifyUser";

const router = Router()

router.post("/register", signUpController)
router.post("/login", signInController)
router.get("/profile", verifyUser , getProfile)

export default router