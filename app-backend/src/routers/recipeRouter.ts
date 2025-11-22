import { Router } from "express";
import getAllRecipes from "../controllers/recipeController";

const recipeRouter = Router();


recipeRouter.get("/", getAllRecipes);

export default recipeRouter;