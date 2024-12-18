import express from "express";
import adminAuthRoutes from "../features/admin/auth/route";

const router = express.Router();

router.use("/auth", adminAuthRoutes);

export default router;
