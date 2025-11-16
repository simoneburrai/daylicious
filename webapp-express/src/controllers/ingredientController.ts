import prisma from "../prisma";
import type { Prisma } from "../generated/prisma";
import { Request, Response } from "express";
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "../generated/prisma/runtime/library";
import { ingredient_categories, ingredient_variations, ingredients } from "../generated/prisma";
import slugify from "slugify";


// Ingredient Section

async function getAllIngredients(_req: Request, res: Response): Promise<void> {


        try {
        const allIngredients : ingredients[] = await prisma.ingredients.findMany()

      // 6. Risposta di successo
        res.status(200).json({
            msg: "Ingredienti ricevuti con Successo",
            ingredients: allIngredients
        });
    } catch (error) {
    console.error('Errore durante la richiesta di tutti gli ingredienti:', error); // Qui vedi il vero oggetto 'error' nella console del server

    let errorMessage = 'Errore durante la richiesta di tutti gli ingredienti:';
    let errorType = 'InternalServerError'; // Default error type

    if (error instanceof Error) {
        errorMessage = `Errore durante la richiesta di tutti gli ingredienti: ${error.message}`;
        errorType = error.name; // Ottieni il nome della classe dell'errore (es. 'Error', 'TypeError', 'PrismaClientKnownRequestError')

        if (error instanceof PrismaClientKnownRequestError) {
            errorMessage = `Errore del database (codice Prisma ${error.code}): ${error.message}`;
            errorType = 'PrismaClientKnownRequestError';
        
        } else if (error instanceof PrismaClientUnknownRequestError) {
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
    }

async function getIngredientBySlugOrId(req: Request, res: Response): Promise<void> {
        const identifier = (req.params.id ?? req.params.slug ?? req.params.identifier) as string | undefined;

    if (!identifier) {
        res.status(400).json({ msg: 'Parametro id/slug mancante nei parametri' });
        return;
    }


        try {
             const whereClause = /^\d+$/.test(identifier) ? { ingredient_id: Number(identifier) } : { ingredient_slug: identifier };

            const ingredient = await prisma.ingredients.findUnique({
            where: whereClause as any,
        });
        
        if (!ingredient) {
            res.status(404).json({ 
                msg: `Ingrediente con slug or ID'${identifier}' non trovato.`,
                ingredient: null // Manteniamo la chiave, ma il valore è null/undefined
            });
            return;
        }
      // 6. Risposta di successo
        res.status(200).json({
            msg: "Ingrediente ricevuto con Successo",
            ingredient: ingredient
        });
    } catch (error) {
    console.error(`Errore durante la richiesta dell Ingrediente con slug o Id ${identifier}`, error); // Qui vedi il vero oggetto 'error' nella console del server

    let errorMessage = 'Errore durante la richiesta del singolo Ingrediente';
    let errorType = 'InternalServerError'; // Default error type

    if (error instanceof Error) {
        errorMessage = error.message;
        errorType = error.name; // Ottieni il nome della classe dell'errore (es. 'Error', 'TypeError', 'PrismaClientKnownRequestError')

        if (error instanceof PrismaClientKnownRequestError) {
            errorMessage = `Errore del database (codice Prisma ${error.code}): ${error.message}`;
            errorType = 'PrismaClientKnownRequestError';
        
        } else if (error instanceof PrismaClientUnknownRequestError) {
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
    }


async function createIngredient(req: Request, res: Response): Promise<void> {

    type PrismaIngredientCreateData = Prisma.ingredientsCreateArgs['data'];
    type ClientIngredientInput = Omit<PrismaIngredientCreateData, 'ingredient_id' | 'ingredient_slug' | 'ingredient_categories' | 'name'> & {
        ing_category_id: number;
        name: { it: string; eng: string };
    }

    const ingredient = req.body as ClientIngredientInput;
    

        try {

           if (!ingredient || !ingredient.name || typeof ingredient.ing_category_id !== 'number' || isNaN(ingredient.ing_category_id) ||
                typeof ingredient.name.it !== 'string' || typeof ingredient.name.eng !== 'string' ||
                ingredient.name.it.trim() === '' || ingredient.name.eng.trim() === '') {
                res.status(400).json({ msg: "Dati ingrediente mancanti o non validi..." });
                return;
            }
        
         const baseSlug = slugify(ingredient.name.eng, {
            lower: true,
            strict: true,
            trim: true
        });

        const existentIngredient: ingredients | null = await prisma.ingredients.findFirst({
            where:
            {ingredient_slug: baseSlug}
        })

        if(existentIngredient){
                res.status(409).json({msg: "Ingrediente già presente, inserisci un altro valore"});
                return;
            }

            const prismaData: PrismaIngredientCreateData = {
                name: ingredient.name,
                illustration_url: ingredient.illustration_url ?? null,
                ingredient_slug: baseSlug,
                ingredient_categories: { connect: { ing_category_id: ingredient.ing_category_id } },
            } as PrismaIngredientCreateData;

            const newIngredient = await prisma.ingredients.create({ data: prismaData });

    
            const newIngredientVariation: ingredient_variations = await prisma.ingredient_variations.create({ data: { variation_name: ingredient.name,
                variation_slug: baseSlug,
                ingredient_id: newIngredient.ingredient_id

             } });

      // 6. Risposta di successo
        res.status(201).json({
            msg: "Ingrediente inserito con successo",
            newIngredient: newIngredient,
            newIngredientVariation: newIngredientVariation
        });
    } catch (error) {

        let errorMessage: string = "Errore durante la richiesta di aggiunta ingrediente";
        console.error(errorMessage, error); // Qui vedi il vero oggetto 'error' nella console del server
        let errorType = 'InternalServerError'; // Default error type

    if (error instanceof Error) {
        errorMessage = `${errorMessage} : ${error.message}`;
        errorType = error.name; // Ottieni il nome della classe dell'errore (es. 'Error', 'TypeError', 'PrismaClientKnownRequestError')

        if (error instanceof PrismaClientKnownRequestError) {
            errorMessage = `Errore del database (codice Prisma ${error.code}): ${error.message}`;
            errorType = 'PrismaClientKnownRequestError';
        
        } else if (error instanceof PrismaClientUnknownRequestError) {
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
    }

async function createManyIngredients(req: Request, res: Response): Promise<void> {
    
      type PrismaIngredientCreateData = Prisma.ingredientsCreateArgs['data'];

    type ClientIngredientInput = Omit<PrismaIngredientCreateData, 'ingredient_id' | 'ingredient_slug' | 'ingredient_categories' | 'name'> & {
        ing_category_id: number;
        name: { it: string; eng: string };
    }

    const ingredientsList = req.body as ClientIngredientInput[]

    // 1. Validation: Check if input is an array and not empty
    if (!Array.isArray(ingredientsList) || ingredientsList.length === 0) {
        res.status(400).json({
            msg: 'Fornisci un array non vuoto di ingredienti',
            received: typeof ingredientsList
        });
        return;
    }

    // 2. Validate each ingredient
    const validatedIngredients: Array<ClientIngredientInput & { ingredient_slug: string }> = [];
    const validationErrors: Array<{ index: number; ingredient_name: string; error: string }> = [];

    for (let i = 0; i < ingredientsList.length; i++) {
        const ingredient = ingredientsList[i];

        // Check required fields
        if (
            !ingredient ||
            !ingredient.name ||
            typeof ingredient.ing_category_id !== 'number' ||
            isNaN(ingredient.ing_category_id) ||
            typeof ingredient.name.it !== 'string' ||
            typeof ingredient.name.eng !== 'string' ||
            ingredient.name.it.trim() === '' ||
            ingredient.name.eng.trim() === ''
        ) {
            validationErrors.push({
                index: i,
                ingredient_name: ingredient?.name?.eng || 'UNKNOWN',
                error: 'Dati ingrediente mancanti o non validi (name.eng, name.it, ing_category_id richiesti)'
            });
            continue;
        }

        // Generate slug
        const baseSlug = slugify(ingredient.name.eng, {
            lower: true,
            strict: true,
            trim: true
        });

        validatedIngredients.push({
            ...ingredient,
            ingredient_slug: baseSlug,
        });
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
    const processingErrors: Array<{ ingredient_name: string; error: string }> = [];

    try {
        for (const ingredient of validatedIngredients) {
            try {
                await prisma.ingredients.upsert({
                    where: { ingredient_slug: ingredient.ingredient_slug },
                    create: {
                        name: ingredient.name,
                        illustration_url: ingredient.illustration_url ?? null,
                        ingredient_slug: ingredient.ingredient_slug,
                        ingredient_categories: {
                            connect: { ing_category_id: ingredient.ing_category_id }
                        }
                    },
                    update: {
                        name: ingredient.name,
                        illustration_url: ingredient.illustration_url ?? null,
                        ingredient_categories: {
                            connect: { ing_category_id: ingredient.ing_category_id }
                        }
                    }
                });
                createdCount++;
            } catch (error) {
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
    } catch (error) {
        let errorMessage = 'Errore durante la richiesta di aggiunta ingredienti in bulk';
        let errorType = 'InternalServerError';

        console.error(errorMessage, error);

        if (error instanceof Error) {
            errorMessage = `${errorMessage}: ${error.message}`;
            errorType = error.name;

            if (error instanceof PrismaClientKnownRequestError) {
                errorMessage = `Errore del database (codice Prisma ${error.code}): ${error.message}`;
                errorType = 'PrismaClientKnownRequestError';
            } else if (error instanceof PrismaClientUnknownRequestError) {
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
}

async function updateIngredient(req: Request, res: Response): Promise<void> {
    // Accept either numeric id or slug in the route parameter (admin convenience)
    const identifier = (req.params.id ?? req.params.slug ?? req.params.identifier) as string | undefined;

    if (!identifier) {
        res.status(400).json({ msg: 'Parametro id/slug mancante nei parametri' });
        return;
    }

    const body = req.body as { ing_category_id?: number; name?: any; illustration_url?: string | null };

    try {
        const data: any = {};

        if (body.name) data.name = body.name;
        if (typeof body.illustration_url !== 'undefined') data.illustration_url = body.illustration_url;
        if (typeof body.ing_category_id === 'number' && !isNaN(body.ing_category_id)) {
            data.ingredient_categories = { connect: { ing_category_id: body.ing_category_id } };
        }

        if (Object.keys(data).length === 0) {
            res.status(400).json({ msg: 'Nessun campo valido da aggiornare fornito' });
            return;
        }

    // Build the `where` clause depending on whether identifier is numeric (id) or slug
    const whereClause = /^\d+$/.test(identifier) ? { ingredient_id: Number(identifier) } : { ingredient_slug: identifier };

        const updated = await prisma.ingredients.update({
            where: whereClause as any,
            data,
        });

        res.status(200).json({ msg: 'Ingrediente aggiornato con successo', updated });
    } catch (error) {
        console.error('Errore durante l\'aggiornamento ingrediente', error);
        if (error instanceof PrismaClientKnownRequestError) {
            res.status(500).json({ message: `Prisma error ${error.code}: ${error.message}` });
            return;
        }
        res.status(500).json({ message: 'Errore interno durante update ingrediente' });
    }
}

async function deleteIngredient(req: Request, res: Response): Promise<void> {
    // Accept either numeric id or slug in the route parameter (admin convenience)
    const identifier = (req.params.id ?? req.params.slug ?? req.params.identifier) as string | undefined;

    if (!identifier) {
        res.status(400).json({ msg: 'Parametro id/slug mancante nei parametri' });
        return;
    }

    try {
        
    // Build the `where` clause depending on whether identifier is numeric (id) or slug
    const whereClause = /^\d+$/.test(identifier) ? { ingredient_id: Number(identifier) } : { ingredient_slug: identifier };

        const deletedIngredient = await prisma.ingredients.delete({
            where: whereClause as any,
        });

        res.status(200).json({ msg: 'Ingrediente eliminato con successo', deletedIngredient });
    } catch (error) {
        console.error('Errore durante l\'aggiornamento ingrediente', error);
        if (error instanceof PrismaClientKnownRequestError) {
            res.status(500).json({ message: `Prisma error ${error.code}: ${error.message}` });
            return;
        }
        res.status(500).json({ message: 'Errore interno durante update ingrediente' });
    }
}

//Ingredient Category Section

async function getAllIngredientCategories(_req: Request, res: Response): Promise<void> {


    try {
        const allIngredientCategories : ingredient_categories[] = await prisma.ingredient_categories.findMany()

      // 6. Risposta di successo
        res.status(200).json({
            msg: "Ingredienti ricevuti con Successo",
            ingredientCategories: allIngredientCategories
        });
    } catch (error) {
        let errorMessage = "Errore durante la richiesta di tutti le categorie ingredienti:"
        console.error(errorMessage, error); // Qui vedi il vero oggetto 'error' nella console del server


         let errorType = 'InternalServerError'; // Default error type

         if (error instanceof Error) {
        errorMessage = `${errorMessage}:  ${error.message}`;
        errorType = error.name; // Ottieni il nome della classe dell'errore (es. 'Error', 'TypeError', 'PrismaClientKnownRequestError')

        if (error instanceof PrismaClientKnownRequestError) {
            errorMessage = `Errore del database (codice Prisma ${error.code}): ${error.message}`;
            errorType = 'PrismaClientKnownRequestError';
        
        } else if (error instanceof PrismaClientUnknownRequestError) {
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
    }


async function createIngredientCategory(req: Request, res: Response): Promise<void> {

    type PrismaIngCategoryCreateData = Prisma.ingredient_categoriesCreateArgs['data'];

    // Client input: same as Prisma create data but with a scalar FK instead of the nested relation
    // Override `name` to a stricter shape for runtime checks
    type ClientIngCategoryInput = Omit<PrismaIngCategoryCreateData, 'ing_category_id' | 'ing_category_slug' | 'name'> & {
        name: { it: string; eng: string };
    }

    const ingCategory = req.body as ClientIngCategoryInput;
    

        try {

           if (!ingCategory || !ingCategory.name ||
                typeof ingCategory.name.it !== 'string' || typeof ingCategory.name.eng !== 'string' ||
                ingCategory.name.it.trim() === '' || ingCategory.name.eng.trim() === '') {
                res.status(400).json({ msg: "Dati Categoria mancanti o non validi..." });
                return;
            }
        
         const baseSlug = slugify(ingCategory.name.eng, {
            lower: true,
            strict: true,
            trim: true
        });

        const existentCategory = await prisma.ingredient_categories.findFirst({
            where:
            {ing_category_slug: baseSlug}
        })

        if(existentCategory){
                res.status(409).json({msg: "Categoria già presente, inserisci un altro valore"});
                return;
            }

        const newIngCategory = await prisma.ingredient_categories.create({
            data: {
                ...ingCategory, 
                ing_category_slug: baseSlug}
        })

      // 6. Risposta di successo
        res.status(201).json({
            msg: "Categoria Ingredienti inserita con successo",
            newIngCategory
        });
    } catch (error) {

        let errorMessage: string = "Errore durante la richiesta di aggiunta Categoria Ingrediente";
        console.error(errorMessage, error); // Qui vedi il vero oggetto 'error' nella console del server
        let errorType = 'InternalServerError'; // Default error type

    if (error instanceof Error) {
        errorMessage = `${errorMessage} : ${error.message}`;
        errorType = error.name; // Ottieni il nome della classe dell'errore (es. 'Error', 'TypeError', 'PrismaClientKnownRequestError')

        if (error instanceof PrismaClientKnownRequestError) {
            errorMessage = `Errore del database (codice Prisma ${error.code}): ${error.message}`;
            errorType = 'PrismaClientKnownRequestError';
        
        } else if (error instanceof PrismaClientUnknownRequestError) {
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
    }

// Ingredient Variation Section

async function getAllIngredientVariations(_req: Request, res: Response): Promise<void> {


    try {
        const allIngredientVariations: ingredient_variations[]= await prisma.ingredient_variations.findMany()

      // 6. Risposta di successo
        res.status(200).json({
            msg: "Variazioni Ingredienti ricevuti con Successo",
            ingredientVariations: allIngredientVariations
        });
    } catch (error) {
        let errorMessage = "Errore durante la richiesta di tutti le variazioni ingredienti:"
        console.error(errorMessage, error); // Qui vedi il vero oggetto 'error' nella console del server


         let errorType = 'InternalServerError'; // Default error type

         if (error instanceof Error) {
        errorMessage = `${errorMessage}:  ${error.message}`;
        errorType = error.name; // Ottieni il nome della classe dell'errore (es. 'Error', 'TypeError', 'PrismaClientKnownRequestError')

        if (error instanceof PrismaClientKnownRequestError) {
            errorMessage = `Errore del database (codice Prisma ${error.code}): ${error.message}`;
            errorType = 'PrismaClientKnownRequestError';
        
        } else if (error instanceof PrismaClientUnknownRequestError) {
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
    }



// getVariationsByIngredientId(req, res): Variazioni per un ingrediente specifico.
async function getVariationsByIngredientId(req: Request, res: Response): Promise<void> {
    // Accept either numeric id or slug in the route param
    const identifier = (req.params.id ?? req.params.slug ?? req.params.identifier) as string | undefined;

    if (!identifier) {
        res.status(400).json({ msg: 'Parametro id/slug mancante nei parametri' });
        return;
    }

    try {
        let ingredientId: number | null = null;

        if (/^\d+$/.test(identifier)) {
            ingredientId = Number(identifier);
        } else {
            const ingredient = await prisma.ingredients.findUnique({ where: { ingredient_slug: identifier } });
            if (!ingredient) {
                res.status(404).json({ msg: `Ingrediente con slug '${identifier}' non trovato.` });
                return;
            }
            ingredientId = ingredient.ingredient_id;
        }

        const variations = await prisma.ingredient_variations.findMany({ where: { ingredient_id: ingredientId! } });
        res.status(200).json({ msg: 'Variazioni ottenute', variations });
    } catch (error) {
        console.error('Errore fetching variations by ingredient identifier', error);
        res.status(500).json({ message: 'Errore interno durante fetch variazioni' });
    }
}

// createIngredientVariation(req, res): Nuova variazione (ADMIN).
async function createIngredientVariation(req: Request, res: Response): Promise<void> {
    // TEMP LOGS: stampo un marker per verificare che la route venga chiamata
    console.log('[DEBUG] createIngredientVariation invoked');
    console.log('[DEBUG] headers:', { authorization: req.headers.authorization });
    // attenzione: il body può contenere dati sensibili in altri contesti; rimuoviamo dopo il debug
    console.log('[DEBUG] body:', req.body);

    const input = req.body as { ingredient_id?: number; variation_name?: any; description?: any; specific_illustration_url?: string | null };

    if (!input || typeof input.ingredient_id !== 'number' || isNaN(input.ingredient_id) || !input.variation_name) {
        res.status(400).json({ msg: 'Dati obbligatori mancanti: ingredient_id o variation_name' });
        return;
    }

    try {
        // Ensure the ingredient exists
        const parentIngredient = await prisma.ingredients.findUnique({ where: { ingredient_id: input.ingredient_id } });
        if (!parentIngredient) {
            res.status(404).json({ msg: `Ingrediente con id ${input.ingredient_id} non trovato` });
            return;
        }

        // Normalize variation_name: accept either a string or a { it, eng } object
        let variationNameValue: any = input.variation_name;
        if (typeof variationNameValue === 'string') {
            variationNameValue = { it: variationNameValue, eng: variationNameValue };
        }

        // Validate normalized variation_name shape
        if (!variationNameValue || typeof variationNameValue.it !== 'string' || typeof variationNameValue.eng !== 'string') {
            res.status(400).json({ msg: 'variation_name deve essere una stringa o un oggetto {it: string, eng: string}' });
            return;
        }

        // Check existence / uniqueness using a safe approach: try to find by ingredient_id and exact JSON match
        const exists = await prisma.ingredient_variations.findFirst({
            where: {
                ingredient_id: input.ingredient_id,
                variation_name: { equals: variationNameValue }
            }
        });

        if (exists) {
            res.status(409).json({ msg: 'Variazione già esistente per questo ingrediente' });
            return;
        }

        // Create using the scalar foreign key to avoid potential nested-relation pitfalls
        const newVar = await prisma.ingredient_variations.create({
            data: {
                ingredient_id: input.ingredient_id,
                variation_name: variationNameValue,
                description: input.description ?? null,
                specific_illustration_url: input.specific_illustration_url ?? null,
                variation_slug: slugify(variationNameValue.eng, {
                    lower: true,
                    strict: true,
                    trim: true
                })
            }
        });

        res.status(201).json({ msg: 'Variazione creata', newVar });
    } catch (error) {
        console.error('Errore durante la creazione della variazione', error);
        const debug = process.env.DEBUG_API === 'true';
        if (error instanceof PrismaClientKnownRequestError) {
            // Unique constraint error (P2002) or foreign key errors will be handled here
            if ((error as any).code === 'P2002') {
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
}

// createManyIngredientVariations: bulk create variations from an array payload
async function createManyIngredientVariations(req: Request, res: Response): Promise<void> {
    const items = req.body as Array<{
        ingredient_id?: number;
        variation_name?: any;
        description?: any;
        specific_illustration_url?: string | null;
    }>;

    if (!Array.isArray(items) || items.length === 0) {
        res.status(400).json({ msg: 'Fornisci un array non vuoto di variazioni' });
        return;
    }

    // Collect unique ingredient ids to prefetch
    const uniqueIds = Array.from(new Set(items.map(i => i?.ingredient_id).filter(Boolean))) as number[];
    const existingIngredients = await prisma.ingredients.findMany({ where: { ingredient_id: { in: uniqueIds } }, select: { ingredient_id: true } });
    const existingIdsSet = new Set(existingIngredients.map(i => i.ingredient_id));

    const created: any[] = [];
    const processingErrors: Array<{ index: number; reason: string; item?: any }> = [];

    for (let i = 0; i < items.length; i++) {
        const it = items[i];

        if (!it || typeof it.ingredient_id !== 'number' || isNaN(it.ingredient_id) || !it.variation_name) {
            processingErrors.push({ index: i, reason: 'Dati mancanti o non validi (ingredient_id e variation_name richiesti)', item: it });
            continue;
        }

        if (!existingIdsSet.has(it.ingredient_id)) {
            processingErrors.push({ index: i, reason: `Ingrediente id ${it.ingredient_id} non trovato`, item: it });
            continue;
        }

        // normalize
        let variationNameVal: any = it.variation_name;
        if (typeof variationNameVal === 'string') variationNameVal = { it: variationNameVal, eng: variationNameVal };
        if (!variationNameVal || typeof variationNameVal.it !== 'string' || typeof variationNameVal.eng !== 'string') {
            processingErrors.push({ index: i, reason: 'variation_name deve essere stringa o {it,eng} object', item: it });
            continue;
        }

        try {
            // check exists
            const exists = await prisma.ingredient_variations.findFirst({ where: { ingredient_id: it.ingredient_id, variation_name: { equals: variationNameVal } } });
            if (exists) {
                processingErrors.push({ index: i, reason: 'Variazione già esistente', item: it });
                continue;
            }

            const createdVar = await prisma.ingredient_variations.create({ data: {
                ingredient_id: it.ingredient_id,
                variation_name: variationNameVal,
                description: it.description ?? null,
                specific_illustration_url: it.specific_illustration_url ?? null,
            }});

            created.push(createdVar);
        } catch (error) {
            console.error('Errore creando variazione in bulk', error);
            // map common Prisma errors
            if (error instanceof PrismaClientKnownRequestError && (error as any).code === 'P2002') {
                processingErrors.push({ index: i, reason: 'Vincolo di unicità violato', item: it });
            } else {
                processingErrors.push({ index: i, reason: error instanceof Error ? error.message : String(error), item: it });
            }
        }
    }

    res.status(200).json({
        msg: 'Bulk create variazioni completata',
        summary: { requested: items.length, created: created.length, failed: processingErrors.length },
        created_count: created.length,
        failed: processingErrors,
        created: created
    });
}

export {
    getAllIngredients,
    getIngredientBySlugOrId,
    createIngredient,
    createManyIngredients,
    deleteIngredient,
    getAllIngredientCategories,
    createIngredientCategory,
    getAllIngredientVariations,
    updateIngredient,
    getVariationsByIngredientId,
    createIngredientVariation,
    createManyIngredientVariations,
}