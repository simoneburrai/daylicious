import express from 'express';
// import './db';
import dotenv from 'dotenv';
import cors from "cors";
import recipeRouter from './routers/recipeRouter';
import ingredientRouter from './routers/ingredientRouter';
import authRouter from './routers/authRouter';
import categoryRouter from './routers/categoryRouter';
import getCurrentLang, { setLanguageMiddleware } from './middleware/setLanguageMiddleware';
dotenv.config();

console.log('Loaded ENV PORT:', process.env.PORT); 

const app = express();
const port : number = Number(process.env.PORT);



console.log(process.env.FRONTEND_URL);
// Configurazione CORS
const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        // Se FRONTEND_URL è definito
        if (process.env.FRONTEND_URL) {
            // Dividi le origini consentite (se ce ne sono più di una, separate da virgola)
            const allowedOrigins : string = process.env.FRONTEND_URL;
            // Controlla se l'origine della richiesta (origin) è tra quelle consentite
            if (origin === allowedOrigins|| !origin) {
                // !origin permette richieste da stessa origine (es. Postman o server-to-server)
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        } else {
            callback(null, true);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Metodi HTTP consentiti
    allowedHeaders: ['Content-Type', 'Authorization'], // Header consentiti (Authorization è cruciale per JWT)
    credentials: true // Permette l'invio di credenziali (es. cookies, header Authorization)
};

// Applica il middleware CORS prima di tutte le tue rotte
app.use(cors(corsOptions));

app.use(express.json());
app.use(setLanguageMiddleware)

// Definizione delle rotte

app.use("/api", authRouter);
app.use("/api/recipes", recipeRouter);
app.use("/api/ingredients", ingredientRouter);
app.use("/api/categories", categoryRouter);

// Server in Ascolto nella Porta Specificata;
app.listen(port, () => {
  console.log(`Server Express in ascolto su http://localhost:${port}`);
});

