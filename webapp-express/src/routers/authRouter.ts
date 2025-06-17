import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import registration from "../controllers/authController";

const authRouter = Router();


authRouter.post("/register", expressAsyncHandler(registration));

export default authRouter;