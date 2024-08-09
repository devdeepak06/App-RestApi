import Router from "express";
const router = Router()
import {registerController} from "../controllers/auth/registerController.js";


router.post("/register", registerController.register);

export default router;
