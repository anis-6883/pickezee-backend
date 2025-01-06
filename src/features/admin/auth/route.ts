import { Router } from "express";
import multer from "multer";
import { ROLE } from "../../../configs/constants";
import { authAndPermissionCheck } from "../../../middlewares/authMiddleware";
import { requestValidate } from "../../../middlewares/requestValidate";
import { adminChangePassword, adminLogin, adminProfile, adminRegister, updateAdminProfile } from "./controller";
import { adminChangePasswordSchema, adminLoginSchema, adminRegisterSchema, updateAdminSchema } from "./validation";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router: Router = Router();

router.post("/register", requestValidate(adminRegisterSchema), adminRegister);
router.post("/login", requestValidate(adminLoginSchema), adminLogin);

router.use(authAndPermissionCheck(ROLE.ADMIN));
router.get("/profile", adminProfile);
router.put("/profile/update", upload.single("image"), requestValidate(updateAdminSchema, "user"), updateAdminProfile);
router.post("/change-password", requestValidate(adminChangePasswordSchema), adminChangePassword);

export default router;
