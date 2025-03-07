import express from "express";
import userAuthRoutes from "../features/user/auth/route";

const router = express.Router();

router.use("/auth", userAuthRoutes);

export default router;
