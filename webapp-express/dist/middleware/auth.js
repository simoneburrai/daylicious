"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = void 0;
exports.authenticate = authenticate;
exports.requireRole = requireRole;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppUserRole_1 = require("../types/AppUserRole");
if (!process.env.MY_JWT_SECRET) {
    console.error('ERRORE CRITICO: MY_JWT_SECRET non è definito.');
    // Do not exit here because middleware file may be imported in typecheck environments
}
const JWT_SECRET = process.env.MY_JWT_SECRET || '';
// authenticate: verifica la presenza e validità del token JWT
function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
    if (!token) {
        return res.status(401).json({ msg: 'Token mancante' });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // store user data in res.locals for downstream handlers
        res.locals.user = payload;
        next();
    }
    catch (err) {
        console.error('Token non valido:', err);
        return res.status(401).json({ msg: 'Token non valido' });
    }
}
// requireRole: middleware factory per richiedere un ruolo specifico
function requireRole(role) {
    return (_req, res, next) => {
        const user = res.locals.user;
        if (!user)
            return res.status(401).json({ msg: 'Utente non autenticato' });
        if (user.role !== role)
            return res.status(403).json({ msg: 'Permessi insufficienti' });
        next();
    };
}
exports.requireAdmin = [authenticate, requireRole(AppUserRole_1.AppUserRole.ADMIN)];
