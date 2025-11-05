import { Router } from "express";
import {getAllIngredients, createIngredient,createIngredientCategory, getAllIngredientCategories} from "../controllers/ingredientController";

const ingredientRouter = Router();


ingredientRouter.get("/", getAllIngredients);
ingredientRouter.post("/", createIngredient)
ingredientRouter.get("/categories", getAllIngredientCategories)
ingredientRouter.post("/categories", createIngredientCategory)



export default ingredientRouter;