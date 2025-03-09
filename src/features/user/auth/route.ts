import { Router } from "express";
import multer from "multer";
import { authAndPermission } from "../../../middlewares/authAndPermission";
import { requestValidate } from "../../../middlewares/requestValidate";
import { userRegister, userRegOtpVerify, userResendOtpOnReg } from "./controller";
import { userRegisterSchema, verifyOtpSchema } from "./validation";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router: Router = Router();

router.post("/register", requestValidate(userRegisterSchema), userRegister);

router.get("/resend-otp", authAndPermission("user", undefined, true), userResendOtpOnReg);
router.post(
  "/verify-otp",
  authAndPermission("user", undefined, true),
  requestValidate(verifyOtpSchema),
  userRegOtpVerify
);

export default router;
