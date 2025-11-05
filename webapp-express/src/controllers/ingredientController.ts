import prisma from "../prisma";
import { Request, Response } from "express";
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "../generated/prisma/runtime/library";
import slugify from "slugify";
// Ingredient Section

async function getAllIngredients(_req: Request, res: Response): Promise<void> {


        try {
        const allIngredients = await prisma.ingredients.findMany()

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


async function createIngredient(req: Request, res: Response): Promise<void> {


    interface Ing {
        ing_category_id: number,
        name: {
            "it": string,
            "eng": string,
        },
        illustration_url: string
    }
    console.log(req.body);

    const ingredient: Ing = req.body
    

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

        const existentIngredient = await prisma.ingredients.findFirst({
            where:
            {ingredient_slug: baseSlug}
        })

        if(existentIngredient){
                res.status(409).json({msg: "Ingrediente già presente, inserisci un altro valore"});
                return;
            }

        const newIngredient = await prisma.ingredients.create({
            data: {
                ...ingredient, 
                ingredient_slug: baseSlug}
        })

      // 6. Risposta di successo
        res.status(201).json({
            msg: "Ingrediente inserito con successo",
            newIngredient: newIngredient
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


//Ingredient Category Section

async function getAllIngredientCategories(_req: Request, res: Response): Promise<void> {


    try {
        const allIngredientCategories = await prisma.ingredient_categories.findMany()

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

    interface IngCategory {
        name: {
            "it": string,
            "eng": string,
        },
        description?: {
            "it": string,
            "eng": string,
        }
    }

    const input: IngCategory = req.body
    

        try {

           if (!input || !input.name ||
                typeof input.name.it !== 'string' || typeof input.name.eng !== 'string' ||
                input.name.it.trim() === '' || input.name.eng.trim() === '') {
                res.status(400).json({ msg: "Dati Categoria mancanti o non validi..." });
                return;
            }
        
         const baseSlug = slugify(input.name.eng, {
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
                ...input, 
                ing_category_slug: baseSlug}
        })

      // 6. Risposta di successo
        res.status(201).json({
            msg: "Categoria inserita con successo",
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


export {
    getAllIngredients,
    createIngredient,
    getAllIngredientCategories,
    createIngredientCategory
}