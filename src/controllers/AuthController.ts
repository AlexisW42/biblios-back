import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import dotenv from "dotenv";
import { QueryFailedError } from "typeorm";
import passport from "passport";

dotenv.config();

const userRepository = AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response) => {
    const { username, email, password, fullName, role } = req.body;

    // Validación de entrada básica
    if (!username || !email || !password || !fullName) {
        return res.status(400).json({ message: "Los campos username, email, password y fullName son requeridos" });
    }

    try {
        const newUser = new User();
        newUser.username = username;
        newUser.email = email;
        newUser.password = password;
        newUser.full_name = fullName;
        // Asignar un rol por defecto si no se proporciona, o validar el rol enviado
        newUser.role = (role === 'admin' || role === 'user') ? role : 'user';

        await userRepository.save(newUser);
        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        // Manejo de error específico para violación de constraint 'unique'
        if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
            // El mensaje de error puede indicar qué constraint falló (e.g., "users_username_key" o "users_email_key")
            const detail = error.driverError.detail;
            const message = detail.includes('username') ? "El nombre de usuario ya existe." : "El correo electrónico ya está en uso.";
            return res.status(409).json({ message });
        }
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const login = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err: Error | null, user: User | false, info: { message: string }) => {
        if (err) { return next(err); }
        if (!user) { return res.status(401).json({ message: info.message || "Credenciales inválidas" }); }

        req.login(user, (err: any) => {
            if (err) { return next(err); }
            // Excluimos el hash de la contraseña de la respuesta por seguridad
            const { password_hash, ...userResponse } = user;
            return res.json({ success: true, user: userResponse });
        });
    })(req, res, next);
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'No se pudo cerrar la sesión completamente.' });
            }
            res.clearCookie('connect.sid'); // Limpia la cookie de sesión del navegador
            res.status(200).json({ message: 'Logout exitoso.' });
        });
    });
};