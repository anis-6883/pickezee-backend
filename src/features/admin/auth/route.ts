import { Router } from "express";
import multer from "multer";
import { superAdminRegistration } from "./controller";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router: Router = Router();

router.post("/register", superAdminRegistration);

export default router;
