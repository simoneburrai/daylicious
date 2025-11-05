/*
  Warnings:

  - A unique constraint covering the columns `[ing_category_slug]` on the table `ingredient_categories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ing_category_slug` to the `ingredient_categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ingredient_categories" ADD COLUMN     "ing_category_slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ingredient_categories_ing_category_slug_key" ON "ingredient_categories"("ing_category_slug");
