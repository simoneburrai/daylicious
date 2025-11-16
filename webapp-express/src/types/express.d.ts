// Dichiara il modulo express
declare namespace Express {
    // Estendi l'interfaccia Request di Express
    interface Request {
        // Aggiungi la proprietà 'lang' con il tipo specifico che usi nel middleware
        lang?: 'it' | 'eng';
    }
}