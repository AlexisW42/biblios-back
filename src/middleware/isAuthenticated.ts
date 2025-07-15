// src/middleware/isAuthenticated.ts
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para verificar si el usuario está autenticado.
 * Si el usuario no está autenticado, devuelve un error 401.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'No autorizado. Por favor, inicie sesión.' });
};
