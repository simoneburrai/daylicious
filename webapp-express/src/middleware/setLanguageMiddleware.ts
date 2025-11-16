

import { Request, Response, NextFunction } from 'express';


export function setLanguageMiddleware(req: Request, res: Response, next: NextFunction) {
    let lang: 'it' | 'eng' = 'eng'; 

    if (req.query.lang) {
        const queryLang = String(req.query.lang).toLowerCase();
        if (queryLang === 'it') {
            lang = 'it';
        } else if (queryLang === 'eng') {
            lang = 'eng';
        }
    } 

    else if (req.headers['accept-language']) { 
        const acceptLang = (req.headers['accept-language'] as string).split(',')[0].toLowerCase();
        
        if (acceptLang.startsWith('it')) {
            lang = 'it';
        }
    }

    req.lang = lang; 
    
    next();
}
