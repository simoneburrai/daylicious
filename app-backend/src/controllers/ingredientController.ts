import prisma from "../prisma";
import type { Prisma } from "../generated/prisma";
import { Request, Response } from "express";
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "../generated/prisma/runtime/library";
import { ingredient_categories, ingredient_variations, ingredients } from "../generated/prisma";
import slugify from "slugify";

type PrismaIngredientVariationCreateData = Prisma.ingredient_variationsCreateArgs['data'];

    type ClientIngredientVariationInput = Omit<PrismaIngredientVariationCreateData,  
        'variation_slug' | 'variation_name' | 'description' 
    > & {
        // Ridefinisci la tipizzazione specifica per i campi JSONB (che sono obbligatori in input)
        variation_name: { it: string; eng: string };
        
        // description e specific_illustration_url sono opzionali
        description?: { it: string; eng: string } | null;
        specific_illustration_url?: string | null;
    };
// Ingredient Section

async function getAllIngredients(req: Request, res: Response): Promise<void> {

   const { search, category } = req.query; // Destructuring più compatto
    
    // Fallback per sicurezza (presuppone che req.lang sia impostato da un middleware)
    const currentLang = req.lang || 'eng'; 
    
    try {
        // 1. Inizializza la whereCondition come oggetto vuoto
        let whereCondition: Prisma.ingredientsWhereInput = {};
        
        // 2. Aggiungi la condizione di RICERCA (se presente)
        if (search) {
            const searchTerm = String(search).toLowerCase().trim();
            
            // Aggiungi la condizione OR alla whereCondition
            whereCondition.OR = [
                // Ricerca nome nella lingua corrente
                {
                    name: {
                        path: [currentLang], 
                        string_contains: searchTerm,
                        mode: 'insensitive',
                    }
                },
                // Ricerca sullo slug
                {
                    ingredient_slug: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    }
                }
            ];
        }
        
        // 3. Aggiungi la condizione di CATEGORIA (se presente)
        // Questa condizione viene aggiunta separatamente. Se il punto 2 ha aggiunto un OR,
        // Prisma le combinerà automaticamente con un AND implicito (OR condizioni AND Categoria ID).
        if (category) {
            const categoryId = Number(category);

            if (!isNaN(categoryId)) { // Controlla che il valore sia un numero valido
                whereCondition.ing_category_id = {
                    equals: categoryId
                };
            }
            // Se category non è un numero, non aggiungiamo la condizione e procediamo.
        }
        
        // 4. Esegui la query
        const allIngredients: ingredients[] = await prisma.ingredients.findMany({
            where: whereCondition
        })

        res.status(200).json({
            msg: "Ingredienti ricevuti con Successo",
            ingredients: allIngredients
        });

    }catch (error) {
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
   
    const input = req.body as ClientIngredientVariationInput;
    
    // Rimuovi la logica di 'any' se forzi il tipo corretto nell'input
    // Questa validazione copre l'obbligatorietà del tipo {it: string, eng: string} in input
    if (!input || typeof input.ingredient_id !== 'number' || isNaN(input.ingredient_id) || 
        !input.variation_name || typeof input.variation_name.it !== 'string' || typeof input.variation_name.eng !== 'string') {
        
        res.status(400).json({ msg: 'Dati obbligatori mancanti o formattati male: ingredient_id (number) o variation_name ({it: string, eng: string})' });
        return;
    }

    try {
        // Ensure the ingredient exists
        const parentIngredient = await prisma.ingredients.findUnique({ where: { ingredient_id: input.ingredient_id } });
        if (!parentIngredient) {
            res.status(404).json({ msg: `Ingrediente con id ${input.ingredient_id} non trovato` });
            return;
        }

        const variationNameValue = input.variation_name;

        // Genera lo slug
        const variationSlug = slugify(variationNameValue.eng, {
            lower: true,
            strict: true,
            trim: true
        });


        // Check existence / uniqueness using the generated slug (più sicuro e veloce del JSON match)
        const exists = await prisma.ingredient_variations.findFirst({
            where: {
                ingredient_id: input.ingredient_id,
                variation_slug: variationSlug // Controlla l'unicità tramite slug + ingredient_id (se hai un vincolo @@unique)
            }
        });

        if (exists) {
            res.status(409).json({ msg: 'Variazione già esistente per questo ingrediente (slug già utilizzato)' });
            return;
        }

        // Create using the scalar foreign key to avoid potential nested-relation pitfalls
        const newVar = await prisma.ingredient_variations.create({
            data: {
                ingredient_id: input.ingredient_id,
                variation_name: variationNameValue, // Passa l'oggetto JSON tipizzato
                description: input.description ?? undefined,
                specific_illustration_url: input.specific_illustration_url ?? null,
                variation_slug: variationSlug
            }
        });

        res.status(201).json({ msg: 'Variazione creata', newVar });
    } catch (error) {
        console.error('Errore durante la creazione della variazione', error);
        const debug = process.env.DEBUG_API === 'true';
        if (error instanceof PrismaClientKnownRequestError) {
            // Unique constraint error (P2002) or foreign key errors will be handled here
            if (error.code === 'P2002') { // Usiamo error.code direttamente
                res.status(409).json({ message: 'Vincolo di unicità violato (variazione esistente o slug duplicato)' });
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
    
    // Usiamo IngredientVariationInput per dare un'idea del tipo
    const items = req.body as Array<Partial<ClientIngredientVariationInput>>; 
    
    if (!Array.isArray(items) || items.length === 0) {
        res.status(400).json({ msg: 'Fornisci un array non vuoto di variazioni' });
        return;
    }

    // 1. Prefetching dei parent ingredienti (Efficiente)
    const uniqueIds = Array.from(new Set(items.map(i => i?.ingredient_id).filter(Boolean))) as number[];
    const existingIngredients = await prisma.ingredients.findMany({ 
        where: { ingredient_id: { in: uniqueIds } }, 
        select: { ingredient_id: true } 
    });
    const existingIdsSet = new Set(existingIngredients.map(i => i.ingredient_id));

    const created: any[] = [];
    const processingErrors: Array<{ index: number; reason: string; item?: any }> = [];

    for (let i = 0; i < items.length; i++) {
        const it = items[i];

        // Validazione base
        if (!it || typeof it.ingredient_id !== 'number' || isNaN(it.ingredient_id) || !it.variation_name) {
            processingErrors.push({ index: i, reason: 'Dati mancanti o non validi (ingredient_id e variation_name richiesti)', item: it });
            continue;
        }

        // Controllo esistenza ingrediente parent
        if (!existingIdsSet.has(it.ingredient_id)) {
            processingErrors.push({ index: i, reason: `Ingrediente id ${it.ingredient_id} non trovato`, item: it });
            continue;
        }

        // 2. Normalizzazione e Validazione avanzata del nome
        let variationNameVal: { it: string, eng: string };
        
        // Gestione se è una stringa (per retrocompatibilità/input semplice)
        if (typeof it.variation_name === 'string') {
            variationNameVal = { it: it.variation_name, eng: it.variation_name };
        } else {
            variationNameVal = it.variation_name as { it: string, eng: string };
        }
        
        if (!variationNameVal || typeof variationNameVal.it !== 'string' || typeof variationNameVal.eng !== 'string') {
            processingErrors.push({ index: i, reason: 'variation_name deve essere stringa o {it: string, eng: string}', item: it });
            continue;
        }

        // 3. Generazione dello SLUG (CRITICO!)
        const variationSlug = slugify(variationNameVal.eng, {
            lower: true,
            strict: true,
            trim: true
        });


        try {
            // 4. Controllo Unicità (più robusto tramite Slug)
            const exists = await prisma.ingredient_variations.findFirst({ 
                where: { 
                    ingredient_id: it.ingredient_id, 
                    variation_slug: variationSlug // Controlliamo sullo SLUG, non sul JSON
                } 
            });
            
            if (exists) {
                processingErrors.push({ index: i, reason: 'Variazione già esistente (slug duplicato)', item: it });
                continue;
            }

            // 5. Creazione con gestione corretta dei campi opzionali
            const createdVar = await prisma.ingredient_variations.create({ 
                data: {
                    ingredient_id: it.ingredient_id,
                    variation_name: variationNameVal,
                    // Usa ?? null per i campi opzionali che possono essere undefined/null
                    description: it.description ?? undefined, 
                    specific_illustration_url: it.specific_illustration_url ?? undefined,
                    variation_slug: variationSlug // <-- AGGIUNTA FONDAMENTALE
                }
            });

            created.push(createdVar);
        } catch (error) {
            console.error('Errore creando variazione in bulk all\'indice', i, error);
            // map common Prisma errors
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                processingErrors.push({ index: i, reason: 'Vincolo di unicità violato (DB)', item: it });
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
    })};

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