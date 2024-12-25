import { Router } from "express";
import { getSettingsInfo, updateSettingInfo } from "./controller";

const router: Router = Router();

router.get("/", getSettingsInfo);
router.put("/update", updateSettingInfo);

export default router;
