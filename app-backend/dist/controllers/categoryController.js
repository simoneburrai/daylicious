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
exports.getAllCategories = getAllCategories;
exports.createCategory = createCategory;
exports.createCategoryValue = createCategoryValue;
exports.getAllCategoryValues = getAllCategoryValues;
const prisma_1 = __importDefault(require("../prisma"));
const library_1 = require("../generated/prisma/runtime/library");
const slugify_1 = __importDefault(require("slugify"));
// Ingredient Section
function getAllCategories(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const allCategories = yield prisma_1.default.categories.findMany();
            // 6. Risposta di successo
            res.status(200).json({
                msg: "Categorie ricevute con Successo",
                categories: allCategories,
            });
        }
        catch (error) {
            let errorMessage = "Errore durante la richiesta di tutte le categorie";
            console.error(errorMessage, error); // Qui vedi il vero oggetto 'error' nella console del server
            let errorType = 'InternalServerError'; // Default error type
            if (error instanceof Error) {
                errorMessage = `${errorMessage}: ${error.message}`;
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
function createCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const input = req.body;
        try {
            if (!input || !input.name ||
                typeof input.name.it !== 'string' || typeof input.name.eng !== 'string' ||
                input.name.it.trim() === '' || input.name.eng.trim() === '') {
                res.status(400).json({ msg: "Dati Categoria mancanti o non validi..." });
                return;
            }
            const baseSlug = (0, slugify_1.default)(input.name.eng, {
                lower: true,
                strict: true,
                trim: true
            });
            const existentCategory = yield prisma_1.default.categories.findFirst({
                where: { category_slug: baseSlug }
            });
            if (existentCategory) {
                res.status(409).json({ msg: "Categoria già presente, inserisci un altro valore" });
                return;
            }
            const newCategory = yield prisma_1.default.categories.create({
                data: Object.assign(Object.assign({}, input), { category_slug: baseSlug })
            });
            // 6. Risposta di successo
            res.status(201).json({
                msg: "Categoria inserita con successo",
                newIngredient: newCategory
            });
        }
        catch (error) {
            let errorMessage = "Errore durante la richiesta di aggiunta Categoria";
            console.error(errorMessage, error); // Qui vedi il vero oggetto 'error' nella console del server
            let errorType = 'InternalServerError'; // Default error type
            if (error instanceof Error) {
                errorMessage = `${errorMessage} : ${error.message}`;
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
function getAllCategoryValues(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const allCategoryValues = yield prisma_1.default.category_values.findMany();
            // 6. Risposta di successo
            res.status(200).json({
                msg: "Sotto-Categorie ricevute con Successo",
                categoryValues: allCategoryValues,
            });
        }
        catch (error) {
            let errorMessage = "Errore durante la richiesta di tutte le Sotto-Categorie";
            console.error(errorMessage, error); // Qui vedi il vero oggetto 'error' nella console del server
            let errorType = 'InternalServerError'; // Default error type
            if (error instanceof Error) {
                errorMessage = `${errorMessage}: ${error.message}`;
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
function createCategoryValue(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const input = req.body;
        try {
            if (!input || !input.value ||
                typeof input.value.it !== 'string' || typeof input.value.eng !== 'string' ||
                input.value.it.trim() === '' || input.value.eng.trim() === '') {
                res.status(400).json({ msg: "Dati Categoria mancanti o non validi..." });
                return;
            }
            const baseSlug = (0, slugify_1.default)(input.value.eng, {
                lower: true,
                strict: true,
                trim: true
            });
            const existentCategory = yield prisma_1.default.category_values.findFirst({
                where: { category_value_slug: baseSlug }
            });
            if (existentCategory) {
                res.status(409).json({ msg: "Sotto-Categoria già presente, inserisci un altro valore" });
                return;
            }
            const newCategory = yield prisma_1.default.category_values.create({
                data: Object.assign(Object.assign({}, input), { category_value_slug: baseSlug })
            });
            // 6. Risposta di successo
            res.status(201).json({
                msg: "Sotto-Categoria inserita con successo",
                newIngredient: newCategory
            });
        }
        catch (error) {
            let errorMessage = "Errore durante la richiesta di aggiunta Sotto-Categoria";
            console.error(errorMessage, error); // Qui vedi il vero oggetto 'error' nella console del server
            let errorType = 'InternalServerError'; // Default error type
            if (error instanceof Error) {
                errorMessage = `${errorMessage} : ${error.message}`;
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
