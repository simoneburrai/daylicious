/*
  Warnings:

  - A unique constraint covering the columns `[variation_slug]` on the table `ingredient_variations` will be added. If there are existing duplicate values, this will fail.
  - Made the column `variation_slug` on table `ingredient_variations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ingredient_variations" ALTER COLUMN "variation_slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ingredient_variations_variation_slug_key" ON "ingredient_variations"("variation_slug");
