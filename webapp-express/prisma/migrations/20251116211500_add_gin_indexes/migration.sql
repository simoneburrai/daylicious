-- I. Abilita l'estensione pg_trgm
-- L'estensione pg_trgm è necessaria per l'operatore 'gin_trgm_ops', che ottimizza
-- le ricerche di substring (LIKE/string_contains) sui campi di testo.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- II. Indici per INGREDIENTS e VARIAZIONI

-- Tabella ingredients
-- Ottimizza la ricerca LIKE/string_contains sul nome in Inglese (chiave 'eng')
CREATE INDEX "ingredients_name_eng_text_trgm_idx" ON "ingredients" USING GIN (("name"->>'eng') gin_trgm_ops);
-- Ottimizza la ricerca LIKE/string_contains sul nome in Italiano (chiave 'it')
CREATE INDEX "ingredients_name_it_text_trgm_idx" ON "ingredients" USING GIN (("name"->>'it') gin_trgm_ops);

-- Tabella ingredient_variations
-- Ottimizza la ricerca LIKE/string_contains sul nome in Inglese (chiave 'eng')
CREATE INDEX "ingredient_variations_name_eng_text_trgm_idx" ON "ingredient_variations" USING GIN (("variation_name"->>'eng') gin_trgm_ops);
-- Ottimizza la ricerca LIKE/string_contains sul nome in Italiano (chiave 'it')
CREATE INDEX "ingredient_variations_name_it_text_trgm_idx" ON "ingredient_variations" USING GIN (("variation_name"->>'it') gin_trgm_ops);


-- III. Indici per CATEGORIE

-- Tabella categories
-- Ottimizza la ricerca LIKE/string_contains sul nome in Inglese
CREATE INDEX "categories_name_eng_text_trgm_idx" ON "categories" USING GIN (("name"->>'eng') gin_trgm_ops);
-- Ottimizza la ricerca LIKE/string_contains sul nome in Italiano
CREATE INDEX "categories_name_it_text_trgm_idx" ON "categories" USING GIN (("name"->>'it') gin_trgm_ops);

-- Tabella ingredient_categories
-- Ottimizza la ricerca LIKE/string_contains sul nome in Inglese
CREATE INDEX "ingredient_categories_name_eng_text_trgm_idx" ON "ingredient_categories" USING GIN (("name"->>'eng') gin_trgm_ops);
-- Ottimizza la ricerca LIKE/string_contains sul nome in Italiano
CREATE INDEX "ingredient_categories_name_it_text_trgm_idx" ON "ingredient_categories" USING GIN (("name"->>'it') gin_trgm_ops);

-- Tabella category_values
-- Si assume che il campo JSON multilingue sia 'value' in questa tabella.
-- Ottimizza la ricerca LIKE/string_contains sul valore in Inglese
CREATE INDEX "category_values_value_eng_text_trgm_idx" ON "category_values" USING GIN (("value"->>'eng') gin_trgm_ops);
-- Ottimizza la ricerca LIKE/string_contains sul valore in Italiano
CREATE INDEX "category_values_value_it_text_trgm_idx" ON "category_values" USING GIN (("value"->>'it') gin_trgm_ops);

-- Indici per i campi slug (per la ricerca tramite 'contains')
-- NOTA: Lo slug è un campo TEXT/VARCHAR, quindi applichiamo l'indice GIN direttamente sul campo

-- Tabella ingredients
CREATE INDEX "ingredients_slug_trgm_idx" ON "ingredients" USING GIN ("ingredient_slug" gin_trgm_ops);

-- Tabella ingredient_variations
CREATE INDEX "variations_slug_trgm_idx" ON "ingredient_variations" USING GIN ("variation_slug" gin_trgm_ops);

-- Tabella ingredient_categories
CREATE INDEX "ingredient_categories_slug_trgm_idx" ON "ingredient_categories" USING GIN ("ing_category_slug" gin_trgm_ops);

-- Tabella categories
CREATE INDEX "categories_slug_trgm_idx" ON "categories" USING GIN ("category_slug" gin_trgm_ops);

-- Tabella category_values
CREATE INDEX "category_values_slug_trgm_idx" ON "category_values" USING GIN ("category_value_slug" gin_trgm_ops);