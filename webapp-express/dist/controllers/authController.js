"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registration = registration;
exports.login = login;
const prisma_1 = __importDefault(require("../prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const library_1 = require("@prisma/client/runtime/library");
if (!process.env.MY_JWT_SECRET) {
    console.error("ERRORE CRITICO: MY_JWT_SECRET non è definito nelle variabili d'ambiente. Assicurati che il file .env sia caricato e la variabile sia impostata.");
    process.exit(1);
}
const JWT_SECRET = process.env.MY_JWT_SECRET;
function registration(req, res, _next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.body;
        const { username, email, password } = user;
        if (!username || !email || !password) {
            res.status(400).json({ msg: "Errore nell'inserimento dei dati, dati mancanti" });
            return;
        }
        try {
            const existingUser = yield prisma_1.default.users.findFirst({
                where: {
                    OR: [{ username: username }, { email: email }],
                },
            });
            if (existingUser) {
                res.status(409).json({ msg: "Esiste già un utente corrispondente a questo username/email" });
                return;
            }
            const salt = yield bcryptjs_1.default.genSalt(10);
            const password_hash = yield bcryptjs_1.default.hash(password, salt);
            const newUser = yield prisma_1.default.users.create({
                data: {
                    username,
                    email,
                    password_hash
                },
            });
            const token = jsonwebtoken_1.default.sign({ userId: newUser.user_id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '1h' });
            res.status(201).json({
                message: 'Utente registrato con successo!',
                user: {
                    user_id: newUser.user_id,
                    username: newUser.username,
                    email: newUser.email,
                },
                token,
            });
        }
        catch (error) {
            console.error('Errore durante la registrazione:', error); // Qui vedi il vero oggetto 'error' nella console del server
            let errorMessage = 'Errore interno del server durante la registrazione.';
            let errorType = 'InternalServerError'; // Default error type
            if (error instanceof Error) {
                errorMessage = `Errore interno del server durante la registrazione: ${error.message}`;
                errorType = error.name; // Ottieni il nome della classe dell'errore (es. 'Error', 'TypeError', 'PrismaClientKnownRequestError')
                if (error instanceof library_1.PrismaClientKnownRequestError) {
                    errorMessage = `Errore del database (codice Prisma ${error.code}): ${error.message}`;
                    errorType = 'PrismaClientKnownRequestError';
                }
                else if (error instanceof library_1.PrismaClientUnknownRequestError) {
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
    });
}
function login(req, res, _next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.body;
        const { identifier, password } = user;
        if (!identifier || !password) {
            res.status(400).json({ msg: "Errore nell'inserimento dei dati, dati mancanti" });
            return;
        }
        try {
            const existingUser = yield prisma_1.default.users.findFirst({
                where: {
                    OR: [{ username: identifier }, { email: identifier }],
                },
            });
            if (!existingUser) {
                res.status(401).json({ msg: "Credenziali non valide." });
                return;
            }
            // 4. Confronta la password criptata
            const passwordMatch = yield bcryptjs_1.default.compare(password, existingUser.password_hash);
            if (!passwordMatch) {
                res.status(401).json({ msg: "Credenziali non valide." });
            }
            const newLastLogin = new Date();
            yield prisma_1.default.users.update({
                where: { user_id: existingUser.user_id },
                data: { last_login: newLastLogin },
            });
            const tokenPayload = {
                userId: existingUser.user_id,
                email: existingUser.email,
                role: existingUser.role
            };
            const token = jsonwebtoken_1.default.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' }); // Il token scade in 1 ora
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
        }
        catch (error) {
            console.error('Errore durante il login:', error); // Qui vedi il vero oggetto 'error' nella console del server
            let errorMessage = 'Errore interno del server durante il login.';
            let errorType = 'InternalServerError'; // Default error type
            if (error instanceof Error) {
                errorMessage = `Errore interno del server durante il login: ${error.message}`;
                errorType = error.name; // Ottieni il nome della classe dell'errore (es. 'Error', 'TypeError', 'PrismaClientKnownRequestError')
                if (error instanceof library_1.PrismaClientKnownRequestError) {
                    errorMessage = `Errore del database (codice Prisma ${error.code}): ${error.message}`;
                    errorType = 'PrismaClientKnownRequestError';
                }
                else if (error instanceof library_1.PrismaClientUnknownRequestError) {
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
    });
}
