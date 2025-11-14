import { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { AppUserRole } from '../types/AppUserRole';

if (!process.env.MY_JWT_SECRET) {
  console.error('ERRORE CRITICO: MY_JWT_SECRET non è definito.');
  // Do not exit here because middleware file may be imported in typecheck environments
}

const JWT_SECRET = process.env.MY_JWT_SECRET || '';

export interface JwtPayload {
  userId: number;
  email: string;
  role: AppUserRole;
}

// authenticate: verifica la presenza e validità del token JWT
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

  if (!token) {
    return res.status(401).json({ msg: 'Token mancante' });
  }

  try {
    const payload = jsonwebtoken.verify(token, JWT_SECRET) as JwtPayload;
    // store user data in res.locals for downstream handlers
    res.locals.user = payload;
    next();
  } catch (err) {
    console.error('Token non valido:', err);
    return res.status(401).json({ msg: 'Token non valido' });
  }
}

// requireRole: middleware factory per richiedere un ruolo specifico
export function requireRole(role: AppUserRole) {
  return (_req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user as JwtPayload | undefined;
    if (!user) return res.status(401).json({ msg: 'Utente non autenticato' });
    if (user.role !== role) return res.status(403).json({ msg: 'Permessi insufficienti' });
    next();
  };
}

export const requireAdmin = [authenticate, requireRole(AppUserRole.ADMIN)];
