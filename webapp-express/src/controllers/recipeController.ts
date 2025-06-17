import prisma from "../app";
import { Request, Response } from "express";



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