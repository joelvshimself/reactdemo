import express from "express";
import { generate2FA, verify2FA } from "../controllers/twoFAController.js";

const router = express.Router();

router.post("/generate-2fa", generate2FA);
router.post("/verify-2fa", verify2FA);

export default router;
