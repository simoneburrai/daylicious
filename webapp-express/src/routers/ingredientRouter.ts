import { Router } from "express";
import { getAllIngredients,
    getIngredientBySlug,
    createIngredient,
    getAllIngredientCategories,
    createIngredientCategory,
    getAllIngredientVariations,
    updateIngredient,
    getVariationsByIngredientId,
    createIngredientVariation,
    createManyIngredients,
    createManyIngredientVariations,} from "../controllers/ingredientController";
import { authenticate, requireAdmin } from "../middleware/auth";

const ingredientRouter = Router();


ingredientRouter.get("/", getAllIngredients);
ingredientRouter.post("/", createIngredient)
ingredientRouter.post("/many", createManyIngredients)
ingredientRouter.get("/categories", getAllIngredientCategories)
ingredientRouter.post("/categories",createIngredientCategory)
ingredientRouter.get("/variations", getAllIngredientVariations)
ingredientRouter.post("/variations",  createIngredientVariation)
ingredientRouter.post("/variations/many", createManyIngredientVariations)
ingredientRouter.get("/variations/:id", authenticate, requireAdmin, getVariationsByIngredientId)
ingredientRouter.get("/:slug", getIngredientBySlug)
ingredientRouter.put("/:slug", authenticate, requireAdmin, updateIngredient)



export default ingredientRouter;