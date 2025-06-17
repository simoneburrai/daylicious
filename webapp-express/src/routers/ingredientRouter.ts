import { Router } from "express";
import getAllIngredients from "../controllers/ingredientController";

const ingredientRouter = Router();


ingredientRouter.get("/", getAllIngredients);

export default ingredientRouter;