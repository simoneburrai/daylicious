/*
  Warnings:

  - A unique constraint covering the columns `[category_id,value,category_value_slug]` on the table `category_values` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category_value_slug` to the `category_values` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "category_values_category_id_value_key";

-- AlterTable
ALTER TABLE "category_values" ADD COLUMN     "category_value_slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "category_values_category_id_value_category_value_slug_key" ON "category_values"("category_id", "value", "category_value_slug");
