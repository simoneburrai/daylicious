import { Router } from "express";
import {getAllIngredients, createIngredient} from "../controllers/ingredientController";

const ingredientRouter = Router();


ingredientRouter.get("/", getAllIngredients);
ingredientRouter.post("/", createIngredient)



export default ingredientRouter;