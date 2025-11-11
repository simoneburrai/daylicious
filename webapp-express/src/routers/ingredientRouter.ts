import { Router } from "express";
import {getAllIngredients, getIngredientBySlug, createIngredient,createIngredientCategory, getAllIngredientCategories} from "../controllers/ingredientController";

const ingredientRouter = Router();


ingredientRouter.get("/", getAllIngredients);
ingredientRouter.post("/", createIngredient)
ingredientRouter.get("/:slug", getIngredientBySlug)
ingredientRouter.get("/categories", getAllIngredientCategories)
ingredientRouter.post("/categories", createIngredientCategory)



export default ingredientRouter;