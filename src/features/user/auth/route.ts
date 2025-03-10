import { Router } from "express";
import multer from "multer";
import { ROLE } from "../../../configs/constants";
import { authorize } from "../../../middlewares/authorize";
import { requestValidate } from "../../../middlewares/requestValidate";
import {
  changeForgetPassword,
  changePassword,
  sendForgetPasswordMail,
  updateUserProfile,
  userForgetPasswordOtpVerify,
  userForgetPasswordResendOtp,
  userLogin,
  userProfile,
  userRegister,
  userRegOtpVerify,
  userResendOtpOnReg,
} from "./controller";
import {
  changeForgetPasswordSchema,
  changePasswordSchema,
  forgetPasswordSchema,
  updateProfileSchema,
  userLoginSchema,
  userRegisterSchema,
  verifyOtpSchema,
} from "./validation";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router: Router = Router();

router.post("/login", requestValidate(userLoginSchema), userLogin);
router.post("/register", requestValidate(userRegisterSchema), userRegister);
router.post("/forget-password", requestValidate(forgetPasswordSchema), sendForgetPasswordMail);

router.use(
  ["/resend-otp", "/verify-otp", "/resend-forget-password-otp", "/forget-password-verify-otp"],
  authorize(ROLE.USER, undefined, true)
);
router.get("/resend-otp", userResendOtpOnReg);
router.post("/verify-otp", requestValidate(verifyOtpSchema), userRegOtpVerify);
router.get("/resend-forget-password-otp", userForgetPasswordResendOtp);
router.post("/forget-password-verify-otp", requestValidate(verifyOtpSchema), userForgetPasswordOtpVerify);

router.use(authorize(ROLE.USER, true));
router.get("/profile", userProfile);
router.put("/update-profile", upload.single("image"), requestValidate(updateProfileSchema, "user"), updateUserProfile);
router.post("/change-forget-password", requestValidate(changeForgetPasswordSchema), changeForgetPassword);
router.put("/change-password", requestValidate(changePasswordSchema), changePassword);

export default router;
