import { Router } from "express";
import { getAllCategories, createCategory, createCategoryValue, getAllCategoryValues } from "../controllers/categoryController";

const categoryRouter = Router();

//Categories
categoryRouter.get("/", getAllCategories);
categoryRouter.post("/", createCategory);

//Category Values

categoryRouter.get("/category-values", getAllCategoryValues);
categoryRouter.post("/category-values", createCategoryValue);



export default categoryRouter;