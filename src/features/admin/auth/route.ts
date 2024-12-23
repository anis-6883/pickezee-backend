import { Router } from "express";
import multer from "multer";
import { ROLE } from "../../../configs/constants";
import { authAndPermissionCheck } from "../../../middlewares/authMiddleware";
import { adminChangePassword, adminLogin, adminProfile, adminRegister, updateAdminProfile } from "./controller";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router: Router = Router();

router.post("/register", adminRegister);
router.post("/login", adminLogin);

router.use(authAndPermissionCheck(ROLE.ADMIN));
router.get("/profile", adminProfile);
router.put("/profile/update", upload.single("image"), updateAdminProfile);
router.post("/change-password", adminChangePassword);

export default router;
