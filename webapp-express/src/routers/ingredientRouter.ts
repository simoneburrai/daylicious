import { Router } from "express";
import {getAllIngredients, createIngredient, getAllIngredientCategories} from "../controllers/ingredientController";

const ingredientRouter = Router();


ingredientRouter.get("/", getAllIngredients);
ingredientRouter.post("/", createIngredient)
ingredientRouter.get("/categories", getAllIngredientCategories)



export default ingredientRouter;