"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import './db';
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const recipeRouter_1 = __importDefault(require("./routers/recipeRouter"));
const ingredientRouter_1 = __importDefault(require("./routers/ingredientRouter"));
const authRouter_1 = __importDefault(require("./routers/authRouter"));
const categoryRouter_1 = __importDefault(require("./routers/categoryRouter"));
dotenv_1.default.config();
console.log('Loaded ENV PORT:', process.env.PORT);
const app = (0, express_1.default)();
const port = Number(process.env.PORT);
console.log(process.env.FRONTEND_URL);
// Configurazione CORS
const corsOptions = {
    origin: function (origin, callback) {
        // Se FRONTEND_URL è definito
        if (process.env.FRONTEND_URL) {
            // Dividi le origini consentite (se ce ne sono più di una, separate da virgola)
            const allowedOrigins = process.env.FRONTEND_URL;
            // Controlla se l'origine della richiesta (origin) è tra quelle consentite
            if (origin === allowedOrigins || !origin) {
                // !origin permette richieste da stessa origine (es. Postman o server-to-server)
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        }
        else {
            callback(null, true);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Metodi HTTP consentiti
    allowedHeaders: ['Content-Type', 'Authorization'], // Header consentiti (Authorization è cruciale per JWT)
    credentials: true // Permette l'invio di credenziali (es. cookies, header Authorization)
};
// Applica il middleware CORS prima di tutte le tue rotte
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use("/api", authRouter_1.default);
app.use("/api/recipes", recipeRouter_1.default);
app.use("/api/ingredients", ingredientRouter_1.default);
app.use("/api/categories", categoryRouter_1.default);
// Server in Ascolto nella Porta Specificata;
app.listen(port, () => {
    console.log(`Server Express in ascolto su http://localhost:${port}`);
});
