import prisma from "../prisma";
import { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AppUserRole } from "../types/AppUserRole";
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";


if (!process.env.MY_JWT_SECRET) {
    console.error("ERRORE CRITICO: MY_JWT_SECRET non è definito nelle variabili d'ambiente. Assicurati che il file .env sia caricato e la variabile sia impostata.");
    process.exit(1);

}
const JWT_SECRET: string = process.env.MY_JWT_SECRET;
interface JwtPayload {
    userId: number,
    email: string,
    role: AppUserRole
} 
interface LoginUser {
    identifier: string
    password: string
}
interface User {
    username: string,
    email: string,
    password: string
}


async function registration(req: Request, res: Response, _next: NextFunction): Promise<void> {

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




    const token = jsonwebtoken.sign(
      { userId: newUser.user_id, email: newUser.email, role: newUser.role } as JwtPayload,
      JWT_SECRET,
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
    let errorType = 'InternalServerError'; // Default error type

    if (error instanceof Error) {
        errorMessage = `Errore interno del server durante la registrazione: ${error.message}`;
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

async function login(req: Request, res: Response, _next: NextFunction): Promise<void> {

    const user: LoginUser = req.body;
    const {identifier, password } = user;

    if(!identifier || !password) {
        res.status(400).json({msg: "Errore nell'inserimento dei dati, dati mancanti"});
        return;
    }
   
        try {
        const existingUser = await prisma.users.findFirst({
            where: {
                OR: [{username : identifier}, {email: identifier}],
            },
        })

        if(!existingUser){
             res.status(401).json({ msg: "Credenziali non valide." });
            return;
        }
        // 4. Confronta la password criptata
        const passwordMatch = await bcrypt.compare(password, existingUser.password_hash);

        if (!passwordMatch) {
            res.status(401).json({ msg: "Credenziali non valide." });
        }
         const newLastLogin = new Date(); 
        await prisma.users.update({
            where: { user_id: existingUser.user_id },
            data: { last_login: newLastLogin },
        });

        const tokenPayload : JwtPayload= {
            userId: existingUser.user_id,
            email: existingUser.email,
            role: existingUser.role as AppUserRole
        }

        const token = jsonwebtoken.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' }); // Il token scade in 1 ora

        // 6. Login di successo: invia il token e i dati utente (senza password)
        res.status(200).json({
            msg: "Login effettuato con successo!",
            token,
            user: {
                id: existingUser.user_id,
                username: existingUser.username,
                email: existingUser.email,
                last_login: newLastLogin
            },
        });
    } catch (error) {
    console.error('Errore durante il login:', error); // Qui vedi il vero oggetto 'error' nella console del server

    let errorMessage = 'Errore interno del server durante il login.';
    let errorType = 'InternalServerError'; // Default error type

    if (error instanceof Error) {
        errorMessage = `Errore interno del server durante il login: ${error.message}`;
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
    registration,
    login
} 