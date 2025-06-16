import { Pool } from "pg";
import dotenv from 'dotenv';

// Carica le variabili dal file .env
dotenv.config();

// Crea una pool di connessioni al DB
export const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT), // converti da stringa a numero
});

pool.connect()
  .then(client => {
    console.log('Connessione a PostgreSQL riuscita!');
    client.release();
  })
  .catch(err => {
    console.error('Errore di connessione al database:', err);
  });
