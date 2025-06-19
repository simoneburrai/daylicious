import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import {registration, login} from "../controllers/authController";

const authRouter = Router();


authRouter.post("/register", expressAsyncHandler(registration));

authRouter.post("/login", expressAsyncHandler(login));

export default authRouter;