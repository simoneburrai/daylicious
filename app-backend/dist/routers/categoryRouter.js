"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
const categoryRouter = (0, express_1.Router)();
//Categories
categoryRouter.get("/", categoryController_1.getAllCategories);
categoryRouter.post("/", categoryController_1.createCategory);
//Category Values
categoryRouter.get("/category-values", categoryController_1.getAllCategoryValues);
categoryRouter.post("/category-values", categoryController_1.createCategoryValue);
exports.default = categoryRouter;
