"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createManyIngredients = createManyIngredients;
exports.getAllIngredients = getAllIngredients;
exports.getIngredientBySlug = getIngredientBySlug;
exports.createIngredient = createIngredient;
exports.getAllIngredientCategories = getAllIngredientCategories;
exports.createIngredientCategory = createIngredientCategory;
exports.getAllIngredientVariations = getAllIngredientVariations;
exports.updateIngredient = updateIngredient;
exports.getVariationsByIngredientId = getVariationsByIngredientId;
exports.createIngredientVariation = createIngredientVariation;
const prisma_1 = __importDefault(require("../prisma"));
const library_1 = require("../generated/prisma/runtime/library");
const slugify_1 = __importDefault(require("slugify"));
// Ingredient Section
function getAllIngredients(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const allIngredients = yield prisma_1.default.ingredients.findMany();
            // 6. Risposta di successo
            res.status(200).json({
                msg: "Ingredienti ricevuti con Successo",
                ingredients: allIngredients
            });
        }
        catch (error) {
            console.error('Errore durante la richiesta di tutti gli ingredienti:', error); // Qui vedi il vero oggetto 'error' nella console del server
            let errorMessage = 'Errore durante la richiesta di tutti gli ingredienti:';
            let errorType = 'InternalServerError'; // Default error type
            if (error instanceof Error) {
                errorMessage = `Errore durante la richiesta di tutti gli ingredienti: ${error.message}`;
                errorType = error.name; // Ottieni il nome della classe dell'errore (es. 'Error', 'TypeError', 'PrismaClientKnownRequestError')
                if (error instanceof library_1.PrismaClientKnownRequestError) {
                    errorMessage = `Errore del database (codice Prisma ${error.code}): ${error.message}`;
                    errorType = 'PrismaClientKnownRequestError';
                }
                else if (error instanceof library_1.PrismaClientUnknownRequestError) {
                    errorMessage = `Errore sconosciuto del database: ${error.message}`;
                    errorType = 'PrismaClientUnknownRequestError';
                }
                res.status(500).json({
                    message: errorMessage,
                    errorType: errorType,
                });
                return;
            }
            res.status(500).json({
                message: errorMessage,
                errorType: errorType
            });
            return;
        }
    });
}
function getIngredientBySlug(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const ingredientSlug = req.params.slug;
        if (!ingredientSlug) {
            res.status(400).json({ msg: "Slug ingrediente mancante." });
            return;
        }
        try {
            const ingredient = yield prisma_1.default.ingredients.findUnique({
                where: {
                    ingredient_slug: ingredientSlug // <<< USARE IL CAMPO @unique
                }
            });
            if (!ingredient) {
                res.status(404).json({
                    msg: `Ingrediente con slug '${ingredientSlug}' non trovato.`,
                    ingredient: null // Manteniamo la chiave, ma il valore è null/undefined
                });
                return;
            }
            // 6. Risposta di successo
            res.status(200).json({
                msg: "Ingrediente ricevuto con Successo",
                ingredient: ingredient
            });
        }
        catch (error) {
            console.error(`Errore durante la richiesta dell Ingrediente con slug ${ingredientSlug}`, error); // Qui vedi il vero oggetto 'error' nella console del server
            let errorMessage = 'Errore durante la richiesta del singolo Ingrediente';
            let errorType = 'InternalServerError'; // Default error type
            if (error instanceof Error) {
                errorMessage = error.message;
                errorType = error.name; // Ottieni il nome della classe dell'errore (es. 'Error', 'TypeError', 'PrismaClientKnownRequestError')
                if (error instanceof library_1.PrismaClientKnownRequestError) {
                    errorMessage = `Errore del database (codice Prisma ${error.code}): ${error.message}`;
                    errorType = 'PrismaClientKnownRequestError';
                }
                else if (error instanceof library_1.PrismaClientUnknownRequestError) {
                    errorMessage = `Errore sconosciuto del database: ${error.message}`;
                    errorType = 'PrismaClientUnknownRequestError';
                }
                res.status(500).json({
                    message: errorMessage,
                    errorType: errorType,
                });
                return;
            }
            res.status(500).json({
                message: errorMessage,
                errorType: errorType
            });
            return;
        }
    });
}
function createIngredient(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const ingredient = req.body;
        try {
            if (!ingredient || !ingredient.name || typeof ingredient.ing_category_id !== 'number' || isNaN(ingredient.ing_category_id) ||
                typeof ingredient.name.it !== 'string' || typeof ingredient.name.eng !== 'string' ||
                ingredient.name.it.trim() === '' || ingredient.name.eng.trim() === '') {
                res.status(400).json({ msg: "Dati ingrediente mancanti o non validi..." });
                return;
            }
            const baseSlug = (0, slugify_1.default)(ingredient.name.eng, {
                lower: true,
                strict: true,
                trim: true
            });
            const existentIngredient = yield prisma_1.default.ingredients.findFirst({
                where: { ingredient_slug: baseSlug }
            });
            if (existentIngredient) {
                res.status(409).json({ msg: "Ingrediente già presente, inserisci un altro valore" });
                return;
            }
            // Build a value that satisfies Prisma.ingredientsCreateArgs['data']
            const prismaData = {
                name: ingredient.name,
                illustration_url: (_a = ingredient.illustration_url) !== null && _a !== void 0 ? _a : null,
                ingredient_slug: baseSlug,
                ingredient_categories: { connect: { ing_category_id: ingredient.ing_category_id } },
            };
            const newIngredient = yield prisma_1.default.ingredients.create({ data: prismaData });
            // 6. Risposta di successo
            res.status(201).json({
                msg: "Ingrediente inserito con successo",
                newIngredient: newIngredient
            });
        }
        catch (error) {
            let errorMessage = "Errore durante la richiesta di aggiunta ingrediente";
            console.error(errorMessage, error); // Qui vedi il vero oggetto 'error' nella console del server
            let errorType = 'InternalServerError'; // Default error type
            if (error instanceof Error) {
                errorMessage = `${errorMessage} : ${error.message}`;
                errorType = error.name; // Ottieni il nome della classe dell'errore (es. 'Error', 'TypeError', 'PrismaClientKnownRequestError')
                if (error instanceof library_1.PrismaClientKnownRequestError) {
                    errorMessage = `Errore del database (codice Prisma ${error.code}): ${error.message}`;
                    errorType = 'PrismaClientKnownRequestError';
                }
                else if (error instanceof library_1.PrismaClientUnknownRequestError) {
                    errorMessage = `Errore sconosciuto del database: ${error.message}`;
                    errorType = 'PrismaClientUnknownRequestError';
                }
                res.status(500).json({
                    message: errorMessage,
                    errorType: errorType,
                });
                return;
            }
            res.status(500).json({
                message: errorMessage,
                errorType: errorType
            });
            return;
        }
    });
}
function createManyIngredients(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const ingredientsList = req.body;
        // 1. Validation: Check if input is an array and not empty
        if (!Array.isArray(ingredientsList) || ingredientsList.length === 0) {
            res.status(400).json({
                msg: 'Fornisci un array non vuoto di ingredienti',
                received: typeof ingredientsList
            });
            return;
        }
        // 2. Validate each ingredient
        const validatedIngredients = [];
        const validationErrors = [];
        for (let i = 0; i < ingredientsList.length; i++) {
            const ingredient = ingredientsList[i];
            // Check required fields
            if (!ingredient ||
                !ingredient.name ||
                typeof ingredient.ing_category_id !== 'number' ||
                isNaN(ingredient.ing_category_id) ||
                typeof ingredient.name.it !== 'string' ||
                typeof ingredient.name.eng !== 'string' ||
                ingredient.name.it.trim() === '' ||
                ingredient.name.eng.trim() === '') {
                validationErrors.push({
                    index: i,
                    ingredient_name: ((_a = ingredient === null || ingredient === void 0 ? void 0 : ingredient.name) === null || _a === void 0 ? void 0 : _a.eng) || 'UNKNOWN',
                    error: 'Dati ingrediente mancanti o non validi (name.eng, name.it, ing_category_id richiesti)'
                });
                continue;
            }
            // Generate slug
            const baseSlug = (0, slugify_1.default)(ingredient.name.eng, {
                lower: true,
                strict: true,
                trim: true
            });
            validatedIngredients.push(Object.assign(Object.assign({}, ingredient), { ingredient_slug: baseSlug }));
        }
        // 3. Report validation errors if any
        if (validationErrors.length > 0) {
            res.status(400).json({
                msg: `${validationErrors.length} ingredienti hanno errori di validazione`,
                validation_errors: validationErrors,
                total_received: ingredientsList.length,
                valid_count: validatedIngredients.length
            });
            return;
        }
        // 4. Process validated ingredients with upsert
        let createdCount = 0;
        const processingErrors = [];
        try {
            for (const ingredient of validatedIngredients) {
                try {
                    yield prisma_1.default.ingredients.upsert({
                        where: { ingredient_slug: ingredient.ingredient_slug },
                        create: {
                            name: ingredient.name,
                            illustration_url: (_b = ingredient.illustration_url) !== null && _b !== void 0 ? _b : null,
                            ingredient_slug: ingredient.ingredient_slug,
                            ingredient_categories: {
                                connect: { ing_category_id: ingredient.ing_category_id }
                            }
                        },
                        update: {
                            name: ingredient.name,
                            illustration_url: (_c = ingredient.illustration_url) !== null && _c !== void 0 ? _c : null,
                            ingredient_categories: {
                                connect: { ing_category_id: ingredient.ing_category_id }
                            }
                        }
                    });
                    createdCount++;
                }
                catch (error) {
                    processingErrors.push({
                        ingredient_name: ingredient.name.eng,
                        error: error instanceof Error ? error.message : String(error)
                    });
                }
            }
            // 5. Success response
            res.status(200).json({
                msg: 'Operazione di bulk insert completata',
                summary: {
                    total_processed: validatedIngredients.length,
                    created_or_updated: createdCount,
                    failed: processingErrors.length
                },
                processing_errors: processingErrors.length > 0 ? processingErrors : undefined
            });
        }
        catch (error) {
            let errorMessage = 'Errore durante la richiesta di aggiunta ingredienti in bulk';
            let errorType = 'InternalServerError';
            console.error(errorMessage, error);
            if (error instanceof Error) {
                errorMessage = `${errorMessage}: ${error.message}`;
                errorType = error.name;
                if (error instanceof library_1.PrismaClientKnownRequestError) {
                    errorMessage = `Errore del database (codice Prisma ${error.code}): ${error.message}`;
                    errorType = 'PrismaClientKnownRequestError';
                }
                else if (error instanceof library_1.PrismaClientUnknownRequestError) {
                    errorMessage = `Errore sconosciuto del database: ${error.message}`;
                    errorType = 'PrismaClientUnknownRequestError';
                }
            }
            res.status(500).json({
                message: errorMessage,
                errorType: errorType,
                partial_results: {
                    created_or_updated: createdCount,
                    failed: processingErrors.length
                }
            });
        }
    });
}
//Ingredient Category Section
function getAllIngredientCategories(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const allIngredientCategories = yield prisma_1.default.ingredient_categories.findMany();
            // 6. Risposta di successo
            res.status(200).json({
                msg: "Ingredienti ricevuti con Successo",
                ingredientCategories: allIngredientCategories
            });
        }
        catch (error) {
            let errorMessage = "Errore durante la richiesta di tutti le categorie ingredienti:";
            console.error(errorMessage, error); // Qui vedi il vero oggetto 'error' nella console del server
            let errorType = 'InternalServerError'; // Default error type
            if (error instanceof Error) {
                errorMessage = `${errorMessage}:  ${error.message}`;
                errorType = error.name; // Ottieni il nome della classe dell'errore (es. 'Error', 'TypeError', 'PrismaClientKnownRequestError')
                if (error instanceof library_1.PrismaClientKnownRequestError) {
                    errorMessage = `Errore del database (codice Prisma ${error.code}): ${error.message}`;
                    errorType = 'PrismaClientKnownRequestError';
                }
                else if (error instanceof library_1.PrismaClientUnknownRequestError) {
                    errorMessage = `Errore sconosciuto del database: ${error.message}`;
                    errorType = 'PrismaClientUnknownRequestError';
                }
                res.status(500).json({
                    message: errorMessage,
                    errorType: errorType,
                });
                return;
            }
            res.status(500).json({
                message: errorMessage,
                errorType: errorType
            });
            return;
        }
    });
}
function createIngredientCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const input = req.body;
        try {
            if (!input || !input.name ||
                typeof input.name.it !== 'string' || typeof input.name.eng !== 'string' ||
                input.name.it.trim() === '' || input.name.eng.trim() === '') {
                res.status(400).json({ msg: "Dati Categoria mancanti o non validi..." });
                return;
            }
            const baseSlug = (0, slugify_1.default)(input.name.eng, {
                lower: true,
                strict: true,
                trim: true
            });
            const existentCategory = yield prisma_1.default.ingredient_categories.findFirst({
                where: { ing_category_slug: baseSlug }
            });
            if (existentCategory) {
                res.status(409).json({ msg: "Categoria già presente, inserisci un altro valore" });
                return;
            }
            const newIngCategory = yield prisma_1.default.ingredient_categories.create({
                data: Object.assign(Object.assign({}, input), { ing_category_slug: baseSlug })
            });
            // 6. Risposta di successo
            res.status(201).json({
                msg: "Categoria inserita con successo",
                newIngCategory
            });
        }
        catch (error) {
            let errorMessage = "Errore durante la richiesta di aggiunta Categoria Ingrediente";
            console.error(errorMessage, error); // Qui vedi il vero oggetto 'error' nella console del server
            let errorType = 'InternalServerError'; // Default error type
            if (error instanceof Error) {
                errorMessage = `${errorMessage} : ${error.message}`;
                errorType = error.name; // Ottieni il nome della classe dell'errore (es. 'Error', 'TypeError', 'PrismaClientKnownRequestError')
                if (error instanceof library_1.PrismaClientKnownRequestError) {
                    errorMessage = `Errore del database (codice Prisma ${error.code}): ${error.message}`;
                    errorType = 'PrismaClientKnownRequestError';
                }
                else if (error instanceof library_1.PrismaClientUnknownRequestError) {
                    errorMessage = `Errore sconosciuto del database: ${error.message}`;
                    errorType = 'PrismaClientUnknownRequestError';
                }
                res.status(500).json({
                    message: errorMessage,
                    errorType: errorType,
                });
                return;
            }
            res.status(500).json({
                message: errorMessage,
                errorType: errorType
            });
            return;
        }
    });
}
// Ingredient Variation Section
function getAllIngredientVariations(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const allIngredientVariations = yield prisma_1.default.ingredient_variations.findMany();
            // 6. Risposta di successo
            res.status(200).json({
                msg: "Variazioni Ingredienti ricevuti con Successo",
                ingredientVariations: allIngredientVariations
            });
        }
        catch (error) {
            let errorMessage = "Errore durante la richiesta di tutti le variazioni ingredienti:";
            console.error(errorMessage, error); // Qui vedi il vero oggetto 'error' nella console del server
            let errorType = 'InternalServerError'; // Default error type
            if (error instanceof Error) {
                errorMessage = `${errorMessage}:  ${error.message}`;
                errorType = error.name; // Ottieni il nome della classe dell'errore (es. 'Error', 'TypeError', 'PrismaClientKnownRequestError')
                if (error instanceof library_1.PrismaClientKnownRequestError) {
                    errorMessage = `Errore del database (codice Prisma ${error.code}): ${error.message}`;
                    errorType = 'PrismaClientKnownRequestError';
                }
                else if (error instanceof library_1.PrismaClientUnknownRequestError) {
                    errorMessage = `Errore sconosciuto del database: ${error.message}`;
                    errorType = 'PrismaClientUnknownRequestError';
                }
                res.status(500).json({
                    message: errorMessage,
                    errorType: errorType,
                });
                return;
            }
            res.status(500).json({
                message: errorMessage,
                errorType: errorType
            });
            return;
        }
    });
}
// updateIngredient(req, res): Aggiorna ingrediente (ADMIN).
function updateIngredient(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        // Accept either numeric id or slug in the route parameter (admin convenience)
        const identifier = ((_b = (_a = req.params.id) !== null && _a !== void 0 ? _a : req.params.slug) !== null && _b !== void 0 ? _b : req.params.identifier);
        if (!identifier) {
            res.status(400).json({ msg: 'Parametro id/slug mancante nei parametri' });
            return;
        }
        const body = req.body;
        try {
            const data = {};
            if (body.name)
                data.name = body.name;
            if (typeof body.illustration_url !== 'undefined')
                data.illustration_url = body.illustration_url;
            if (typeof body.ing_category_id === 'number' && !isNaN(body.ing_category_id)) {
                data.ingredient_categories = { connect: { ing_category_id: body.ing_category_id } };
            }
            if (Object.keys(data).length === 0) {
                res.status(400).json({ msg: 'Nessun campo valido da aggiornare fornito' });
                return;
            }
            // Build the `where` clause depending on whether identifier is numeric (id) or slug
            const whereClause = /^\d+$/.test(identifier) ? { ingredient_id: Number(identifier) } : { ingredient_slug: identifier };
            const updated = yield prisma_1.default.ingredients.update({
                where: whereClause,
                data,
            });
            res.status(200).json({ msg: 'Ingrediente aggiornato con successo', updated });
        }
        catch (error) {
            console.error('Errore durante l\'aggiornamento ingrediente', error);
            if (error instanceof library_1.PrismaClientKnownRequestError) {
                res.status(500).json({ message: `Prisma error ${error.code}: ${error.message}` });
                return;
            }
            res.status(500).json({ message: 'Errore interno durante update ingrediente' });
        }
    });
}
// getVariationsByIngredientId(req, res): Variazioni per un ingrediente specifico.
function getVariationsByIngredientId(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        // Accept either numeric id or slug in the route param
        const identifier = ((_b = (_a = req.params.id) !== null && _a !== void 0 ? _a : req.params.slug) !== null && _b !== void 0 ? _b : req.params.identifier);
        if (!identifier) {
            res.status(400).json({ msg: 'Parametro id/slug mancante nei parametri' });
            return;
        }
        try {
            let ingredientId = null;
            if (/^\d+$/.test(identifier)) {
                ingredientId = Number(identifier);
            }
            else {
                const ingredient = yield prisma_1.default.ingredients.findUnique({ where: { ingredient_slug: identifier } });
                if (!ingredient) {
                    res.status(404).json({ msg: `Ingrediente con slug '${identifier}' non trovato.` });
                    return;
                }
                ingredientId = ingredient.ingredient_id;
            }
            const variations = yield prisma_1.default.ingredient_variations.findMany({ where: { ingredient_id: ingredientId } });
            res.status(200).json({ msg: 'Variazioni ottenute', variations });
        }
        catch (error) {
            console.error('Errore fetching variations by ingredient identifier', error);
            res.status(500).json({ message: 'Errore interno durante fetch variazioni' });
        }
    });
}
// createIngredientVariation(req, res): Nuova variazione (ADMIN).
function createIngredientVariation(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        // TEMP LOGS: stampo un marker per verificare che la route venga chiamata
        console.log('[DEBUG] createIngredientVariation invoked');
        console.log('[DEBUG] headers:', { authorization: req.headers.authorization });
        // attenzione: il body può contenere dati sensibili in altri contesti; rimuoviamo dopo il debug
        console.log('[DEBUG] body:', req.body);
        const input = req.body;
        if (!input || typeof input.ingredient_id !== 'number' || isNaN(input.ingredient_id) || !input.variation_name) {
            res.status(400).json({ msg: 'Dati obbligatori mancanti: ingredient_id o variation_name' });
            return;
        }
        try {
            // Ensure the ingredient exists
            const parentIngredient = yield prisma_1.default.ingredients.findUnique({ where: { ingredient_id: input.ingredient_id } });
            if (!parentIngredient) {
                res.status(404).json({ msg: `Ingrediente con id ${input.ingredient_id} non trovato` });
                return;
            }
            // Normalize variation_name: accept either a string or a { it, eng } object
            let variationNameValue = input.variation_name;
            if (typeof variationNameValue === 'string') {
                variationNameValue = { it: variationNameValue, eng: variationNameValue };
            }
            // Validate normalized variation_name shape
            if (!variationNameValue || typeof variationNameValue.it !== 'string' || typeof variationNameValue.eng !== 'string') {
                res.status(400).json({ msg: 'variation_name deve essere una stringa o un oggetto {it: string, eng: string}' });
                return;
            }
            // Check existence / uniqueness using a safe approach: try to find by ingredient_id and exact JSON match
            const exists = yield prisma_1.default.ingredient_variations.findFirst({
                where: { ingredient_id: input.ingredient_id, variation_name: variationNameValue }
            });
            if (exists) {
                res.status(409).json({ msg: 'Variazione già esistente per questo ingrediente' });
                return;
            }
            // Create using the scalar foreign key to avoid potential nested-relation pitfalls
            const newVar = yield prisma_1.default.ingredient_variations.create({
                data: {
                    ingredient_id: input.ingredient_id,
                    variation_name: variationNameValue,
                    description: (_a = input.description) !== null && _a !== void 0 ? _a : null,
                    specific_illustration_url: (_b = input.specific_illustration_url) !== null && _b !== void 0 ? _b : null,
                }
            });
            res.status(201).json({ msg: 'Variazione creata', newVar });
        }
        catch (error) {
            console.error('Errore durante la creazione della variazione', error);
            const debug = process.env.DEBUG_API === 'true';
            if (error instanceof library_1.PrismaClientKnownRequestError) {
                // Unique constraint error (P2002) or foreign key errors will be handled here
                if (error.code === 'P2002') {
                    res.status(409).json({ message: 'Vincolo di unicità violato (variazione esistente)' });
                    return;
                }
                const msg = debug ? `${error.code}: ${error.message}` : 'Errore del database durante la creazione';
                res.status(500).json({ message: msg });
                return;
            }
            const generic = 'Errore interno durante creazione variazione';
            if (debug && error instanceof Error) {
                res.status(500).json({ message: generic, details: error.message, stack: error.stack });
                return;
            }
            res.status(500).json({ message: generic });
        }
    });
}
