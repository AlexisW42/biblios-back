import { Request, Response, NextFunction } from 'express';
import { User } from '../entity/User';

/**
 * Middleware para verificar si el usuario autenticado tiene uno de los roles permitidos.
 * @param roles - Un array de roles permitidos (e.g., ['admin'])
 */
export const checkRole = (roles: Array<'admin' | 'user'>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as User;

        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({ message: 'Acceso prohibido: no tienes los permisos necesarios.' });
        }

        next();
    };
};