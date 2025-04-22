import express from "express";
import { generate2FA, verify2FA, check2FAStatus } from "../controllers/twoFAController.js";

const router = express.Router();

router.post("/generate-2fa", generate2FA);
router.post("/verify-2fa", verify2FA);
router.post("/check-2fa", check2FAStatus);

export default router;
