"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
// Carica le variabili dal file .env
dotenv_1.default.config();
// Crea una pool di connessioni al DB
exports.pool = new pg_1.Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT), // converti da stringa a numero
});
exports.pool.connect()
    .then(client => {
    console.log('Connessione a PostgreSQL riuscita!');
    client.release();
})
    .catch(err => {
    console.error('Errore di connessione al database:', err);
});
