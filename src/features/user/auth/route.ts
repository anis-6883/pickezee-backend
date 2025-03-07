import { Router } from "express";
import multer from "multer";
import { requestValidate } from "../../../middlewares/requestValidate";
import { userRegister } from "./controller";
import { userRegisterSchema } from "./validation";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router: Router = Router();

router.post("/register", requestValidate(userRegisterSchema), userRegister);

export default router;
