import prisma from "../app";
import { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AppUserRole } from "../types/AppUserRole";


interface JwtPayload {
    userId: number,
    email: string,
    role: AppUserRole
} 

interface User {
    username: string,
    email: string,
    password: string
}


async function registration(req: Request, res: Response, next: NextFunction): Promise<void> {

    const user: User = req.body;
    const {username, email, password } = user;

    if(!username || !email || !password) {
        res.status(400).json({msg: "Errore nell'inserimento dei dati, dati mancanti"});
        return;
    }
   
        try {
        const existingUser = await prisma.users.findFirst({
            where: {
                OR: [{username : username}, {email: email}],
            },
        })

        if(existingUser){
            res.status(409).json({msg: "Esiste già un utente corrispondente a questo username/email"})
            return;
        }

         const salt = await bcrypt.genSalt(10);
         const password_hash = await bcrypt.hash(password, salt);
         const newUser = await prisma.users.create({
            data: {
                username,
                email,
                password_hash
        },
    });

    if (!process.env.MY_JWT_SECRET) {
      throw new Error("MY_JWT_SECRET non è definito nelle variabili d'ambiente.");
    }


    const token = jsonwebtoken.sign(
      { userId: newUser.user_id, email: newUser.email, role: newUser.role } as JwtPayload,
      process.env.MY_JWT_SECRET,
      { expiresIn: '1h' }
    );

    
    res.status(201).json({
      message: 'Utente registrato con successo!',
      user: {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });


    } catch (error) {
        console.error('Errore durante la registrazione:', error); // Qui vedi il vero oggetto 'error' nella console del server

        let errorMessage = 'Errore interno del server durante la registrazione.';

        // Tentativo di estrarre un messaggio leggibile dall'errore
        if (error instanceof Error) {
            errorMessage = `Errore interno del server durante la registrazione: ${error.message}`;
            // Aggiungiamo una gestione specifica per errori di Prisma con BigInt se necessario
            if (error.name === 'PrismaClientKnownRequestError' || error.name === 'PrismaClientUnknownRequestError') {
                 // Controlla se l'errore di Prisma ha dettagli che potrebbero includere BigInt
                 // Ad esempio, se l'errore riguarda un ID o un campo BigInt
                 if (error.message.includes('BigInt')) { // O un controllo più sofisticato
                     errorMessage = `Errore del database (BigInt issue): ${error.message.replace(/(\d+)n/g, '$1')}`; // Rimuove 'n' dai BigInt nel messaggio
                 }
            }
        } else if (typeof error === 'object' && error !== null && typeof (error as any).message === 'string') {
            // Per errori non-Error ma con proprietà message
            errorMessage = `Errore interno del server durante la registrazione: ${(error as any).message}`;
        } else if (typeof error === 'bigint') {
            // Se l'errore stesso fosse un BigInt (caso raro ma coperto)
            errorMessage = `Errore interno del server: Valore numerico grande non gestito: ${error.toString()}`;
        } else {
            errorMessage = `Errore interno del server durante la registrazione: ${String(error)}`; // Converte qualsiasi cosa in stringa
        }


        // Ora invia la risposta con il messaggio di errore garantito come stringa
        res.status(500).json({ message: errorMessage });
        return; // Assicurati che questo return ci sia sempre dopo la risposta
    }

    }


export default registration;