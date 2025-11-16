import { Router } from "express";
import { getAllIngredients,
    getIngredientBySlugOrId,
    createIngredient,
    createManyIngredients,
    deleteIngredient,
    getAllIngredientCategories,
    createIngredientCategory,
    getAllIngredientVariations,
    updateIngredient,
    getVariationsByIngredientId,
    createIngredientVariation,
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
ingredientRouter.get("/:slug", getIngredientBySlugOrId)
ingredientRouter.put("/:slug", authenticate, requireAdmin, updateIngredient)
ingredientRouter.delete("/:slug", deleteIngredient)



export default ingredientRouter;