-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "categories" (
    "category_id" BIGSERIAL NOT NULL,
    "name" JSONB NOT NULL,
    "description" JSONB,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "category_values" (
    "category_value_id" BIGSERIAL NOT NULL,
    "category_id" BIGINT NOT NULL,
    "value" JSONB NOT NULL,
    "description" JSONB,
    "illustration_url" VARCHAR(255),

    CONSTRAINT "category_values_pkey" PRIMARY KEY ("category_value_id")
);

-- CreateTable
CREATE TABLE "ingredient_categories" (
    "ing_category_id" BIGSERIAL NOT NULL,
    "name" JSONB NOT NULL,
    "description" JSONB,
    "illustration_url" VARCHAR(255),

    CONSTRAINT "ingredient_categories_pkey" PRIMARY KEY ("ing_category_id")
);

-- CreateTable
CREATE TABLE "ingredient_variations" (
    "variation_id" BIGSERIAL NOT NULL,
    "ingredient_id" BIGINT NOT NULL,
    "variation_name" JSONB NOT NULL,
    "description" JSONB,
    "specific_illustration_url" VARCHAR(255),

    CONSTRAINT "ingredient_variations_pkey" PRIMARY KEY ("variation_id")
);

-- CreateTable
CREATE TABLE "ingredients" (
    "ingredient_id" BIGSERIAL NOT NULL,
    "ing_category_id" BIGINT NOT NULL,
    "name" JSONB NOT NULL,
    "illustration_url" VARCHAR(255),

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("ingredient_id")
);

-- CreateTable
CREATE TABLE "meal_plan_entries" (
    "meal_plan_entry_id" BIGSERIAL NOT NULL,
    "meal_plan_id" BIGINT NOT NULL,
    "recipe_id" BIGINT NOT NULL,
    "plan_date" DATE NOT NULL,
    "meal_type" VARCHAR(50) NOT NULL,
    "servings_planned" INTEGER DEFAULT 1,

    CONSTRAINT "meal_plan_entries_pkey" PRIMARY KEY ("meal_plan_entry_id")
);

-- CreateTable
CREATE TABLE "meal_plans" (
    "meal_plan_id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "plan_name" VARCHAR(100),
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meal_plans_pkey" PRIMARY KEY ("meal_plan_id")
);

-- CreateTable
CREATE TABLE "recipe_category_values" (
    "recipe_category_value_id" BIGSERIAL NOT NULL,
    "recipe_id" BIGINT NOT NULL,
    "category_value_id" BIGINT NOT NULL,

    CONSTRAINT "recipe_category_values_pkey" PRIMARY KEY ("recipe_category_value_id")
);

-- CreateTable
CREATE TABLE "recipe_ingredients" (
    "recipe_ingredient_id" BIGSERIAL NOT NULL,
    "recipe_id" BIGINT NOT NULL,
    "variation_id" BIGINT NOT NULL,
    "quantity" DECIMAL(10,2),
    "unit" VARCHAR(20),

    CONSTRAINT "recipe_ingredients_pkey" PRIMARY KEY ("recipe_ingredient_id")
);

-- CreateTable
CREATE TABLE "recipes" (
    "recipe_id" BIGSERIAL NOT NULL,
    "name" JSONB NOT NULL,
    "description" JSONB,
    "prep_time_minutes" INTEGER,
    "cook_time_minutes" INTEGER,
    "servings" INTEGER NOT NULL,
    "external_url" VARCHAR(255) NOT NULL,
    "illustration_url" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("recipe_id")
);

-- CreateTable
CREATE TABLE "user_ingredients" (
    "user_ingredient_id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "variation_id" BIGINT NOT NULL,
    "quantity" DECIMAL(10,2),
    "unit" VARCHAR(20),
    "added_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "expiration_date" DATE,

    CONSTRAINT "user_ingredients_pkey" PRIMARY KEY ("user_ingredient_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" BIGSERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMPTZ(6),
    "is_premium" BOOLEAN DEFAULT false,
    "role" "UserRole" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_values_category_id_value_key" ON "category_values"("category_id", "value");

-- CreateIndex
CREATE UNIQUE INDEX "ingredient_variations_ingredient_id_variation_name_key" ON "ingredient_variations"("ingredient_id", "variation_name");

-- CreateIndex
CREATE UNIQUE INDEX "meal_plan_entries_meal_plan_id_plan_date_meal_type_recipe_i_key" ON "meal_plan_entries"("meal_plan_id", "plan_date", "meal_type", "recipe_id");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_category_values_recipe_id_category_value_id_key" ON "recipe_category_values"("recipe_id", "category_value_id");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_ingredients_recipe_id_variation_id_key" ON "recipe_ingredients"("recipe_id", "variation_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_ingredients_user_id_variation_id_key" ON "user_ingredients"("user_id", "variation_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "category_values" ADD CONSTRAINT "fk_category" FOREIGN KEY ("category_id") REFERENCES "categories"("category_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ingredient_variations" ADD CONSTRAINT "fk_ingredient" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("ingredient_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "fk_ingredient_category" FOREIGN KEY ("ing_category_id") REFERENCES "ingredient_categories"("ing_category_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "meal_plan_entries" ADD CONSTRAINT "fk_meal_plan" FOREIGN KEY ("meal_plan_id") REFERENCES "meal_plans"("meal_plan_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "meal_plan_entries" ADD CONSTRAINT "fk_meal_plan_recipe" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("recipe_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "meal_plans" ADD CONSTRAINT "fk_user_meal_plan" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recipe_category_values" ADD CONSTRAINT "fk_category_value" FOREIGN KEY ("category_value_id") REFERENCES "category_values"("category_value_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recipe_category_values" ADD CONSTRAINT "fk_recipe" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("recipe_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "fk_ingredient_variation" FOREIGN KEY ("variation_id") REFERENCES "ingredient_variations"("variation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "fk_recipe_ing" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("recipe_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_ingredients" ADD CONSTRAINT "fk_user_ing" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_ingredients" ADD CONSTRAINT "fk_user_ingredient_variation" FOREIGN KEY ("variation_id") REFERENCES "ingredient_variations"("variation_id") ON DELETE RESTRICT ON UPDATE NO ACTION;
