import express from "express";
import { ROLE } from "../configs/constants";
import adminAuthRoutes from "../features/admin/auth/route";
import settingRoutes from "../features/admin/setting/route";
import { authAndPermission } from "../middlewares/authAndPermission";

const router = express.Router();

router.use("/auth", adminAuthRoutes);

router.use(authAndPermission(ROLE.ADMIN));
router.use("/setting", settingRoutes);

export default router;
