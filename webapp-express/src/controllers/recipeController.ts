import { PrismaClient } from "../generated/prisma";
import { Request, Response } from "express";

// Istanzia il client Prisma
// È buona pratica istanziare PrismaClient una sola volta nella tua applicazione
// Ad esempio, in un file dedicato o nel tuo app.ts e poi passarlo o esportarlo.
// Per un controller, va bene anche qui se lo usi solo in questo contesto o se lo progetti come singleton.
const prisma = new PrismaClient();

// Funzione per recuperare tutte le ricette
async function getAllRecipes(_req: Request, res: Response) {
    try {
        const allRecipes = await prisma.recipes.findMany();
        res.status(200).json(allRecipes);

    } catch (error) {
        console.error("Errore durante il recupero delle ricette:", error);
        res.status(500).json({ message: "Errore interno del server durante il recupero delle ricette." });
    }
}

export default getAllRecipes;