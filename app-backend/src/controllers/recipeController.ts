import { recipes } from "../generated/prisma";
import prisma from "../prisma";
import { Request, Response } from "express";



async function getAllRecipes(_req: Request, res: Response) {
    try {
        const allRecipes: recipes[] = await prisma.recipes.findMany();
        res.status(200).json(allRecipes);

    } catch (error) {
        console.error("Errore durante il recupero delle ricette:", error);
        res.status(500).json({ message: "Errore interno del server durante il recupero delle ricette." });
    }
}

export default getAllRecipes;