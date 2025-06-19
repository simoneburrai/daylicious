import prisma from "../app";
import { Request, Response } from "express";


async function getAllIngredients(_req: Request, res: Response) {
    try {
        const allIngredients = await prisma.ingredients.findMany();
        res.status(200).json(allIngredients);

    } catch (error) {
        console.error("Errore durante il recupero delle ricette:", error);
        res.status(500).json({ message: "Errore interno del server durante il recupero delle ricette." });
    }
}

export default getAllIngredients;