import prisma from "../prisma";
import { Request, Response } from "express";
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "../generated/prisma/runtime/library";
import slugify from "slugify";
// Ingredient Section

async function getAllCategories(_req: Request, res: Response): Promise<void> {


        try {
        const allCategories = await prisma.categories.findMany()

      // 6. Risposta di successo
        res.status(200).json({
            msg: "Categorie ricevute con Successo",
            categories: allCategories,
        });
    } catch (error) {
        let errorMessage = "Errore durante la richiesta di tutte le categorie";

    console.error(errorMessage, error); // Qui vedi il vero oggetto 'error' nella console del server

    let errorType = 'InternalServerError'; // Default error type

    if (error instanceof Error) {
        errorMessage = `${errorMessage}: ${error.message}`;
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


async function createCategory(req: Request, res: Response): Promise<void> {

    interface Category {
        name: {
            "it": string,
            "eng": string,
        },
        description: {
            "it": string,
            "eng": string,
        }
    }

    const input: Category = req.body
    

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

        const existentCategory = await prisma.categories.findFirst({
            where:
            {category_slug: baseSlug}
        })

        if(existentCategory){
                res.status(409).json({msg: "Categoria già presente, inserisci un altro valore"});
                return;
            }

        const newCategory = await prisma.categories.create({
            data: {
                ...input, 
                category_slug: baseSlug}
        })

      // 6. Risposta di successo
        res.status(201).json({
            msg: "Categoria inserita con successo",
            newIngredient: newCategory
        });
    } catch (error) {

        let errorMessage: string = "Errore durante la richiesta di aggiunta Categoria";
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

async function getAllCategoryValues(_req: Request, res: Response): Promise<void> {


        try {
        const allCategoryValues = await prisma.category_values.findMany()

      // 6. Risposta di successo
        res.status(200).json({
            msg: "Sotto-Categorie ricevute con Successo",
            categoryValues: allCategoryValues,
        });
    } catch (error) {
        let errorMessage: string = "Errore durante la richiesta di tutte le Sotto-Categorie";
    console.error(errorMessage, error); // Qui vedi il vero oggetto 'error' nella console del server

    let errorType = 'InternalServerError'; // Default error type

    if (error instanceof Error) {
        errorMessage = `${errorMessage}: ${error.message}`;
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
async function createCategoryValue(req: Request, res: Response): Promise<void> {

    interface CategoryValue {
        value: {
            "it": string,
            "eng": string,
        },
        description: {
            "it": string,
            "eng": string,
        },
        category_id: number
    }

    const input: CategoryValue = req.body
    

        try {

           if (!input || !input.value ||
                typeof input.value.it !== 'string' || typeof input.value.eng !== 'string' ||
                input.value.it.trim() === '' || input.value.eng.trim() === '') {
                res.status(400).json({ msg: "Dati Categoria mancanti o non validi..." });
                return;
            }
        
         const baseSlug = slugify(input.value.eng, {
            lower: true,
            strict: true,
            trim: true
        });

        const existentCategory = await prisma.category_values.findFirst({
            where:
            {category_value_slug: baseSlug}
        })

        if(existentCategory){
                res.status(409).json({msg: "Sotto-Categoria già presente, inserisci un altro valore"});
                return;
            }

        const newCategory = await prisma.category_values.create({
            data: {
                ...input, 
                category_value_slug: baseSlug}
        })

      // 6. Risposta di successo
        res.status(201).json({
            msg: "Sotto-Categoria inserita con successo",
            newIngredient: newCategory
        });
    } catch (error) {

        let errorMessage: string = "Errore durante la richiesta di aggiunta Sotto-Categoria";
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
    getAllCategories,
    createCategory,
    createCategoryValue,
    getAllCategoryValues
}