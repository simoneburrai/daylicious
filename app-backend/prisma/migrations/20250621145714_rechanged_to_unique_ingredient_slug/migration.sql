/*
  Warnings:

  - A unique constraint covering the columns `[ingredient_slug]` on the table `ingredients` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ingredients" ALTER COLUMN "ingredient_slug" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "ingredients_ingredient_slug_key" ON "ingredients"("ingredient_slug");
