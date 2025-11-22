/*
  Warnings:

  - A unique constraint covering the columns `[category_slug]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[meal_plan_slug]` on the table `meal_plans` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[recipe_slug]` on the table `recipes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category_slug` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meal_plan_slug` to the `meal_plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipe_slug` to the `recipes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "category_slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ingredients" ADD COLUMN     "ingredient_slug" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "meal_plans" ADD COLUMN     "meal_plan_slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "recipe_slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "categories_category_slug_key" ON "categories"("category_slug");

-- CreateIndex
CREATE UNIQUE INDEX "meal_plans_meal_plan_slug_key" ON "meal_plans"("meal_plan_slug");

-- CreateIndex
CREATE UNIQUE INDEX "recipes_recipe_slug_key" ON "recipes"("recipe_slug");
