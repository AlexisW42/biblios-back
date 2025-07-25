import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { QueryFailedError } from "typeorm";
import passport from "passport";
import bcrypt from "bcryptjs";

const userRepository = AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response) => {
    const { username, email, password, fullName, role } = req.body;

    // Validación de entrada básica
    if (!username || !email || !password || !fullName) {
        return res.status(400).json({ message: "Los campos username, email, password y fullName son requeridos" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = userRepository.create({
            username,
            email,
            password_hash: hashedPassword,
            full_name: fullName,
            // Asigna el rol de forma segura. Permite 'admin' si se especifica, si no, por defecto es 'user'.
            role: role === 'admin' ? 'admin' : 'user',
        });
        
        await userRepository.save(newUser);

        // Nunca devuelvas la contraseña hasheada en la respuesta
        const { password_hash, ...userResponse } = newUser;
        res.status(201).json({ message: "Usuario registrado exitosamente", user: userResponse });
    } catch (error) {
        // Manejo de error específico para violación de constraint 'unique'
        if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
            // El mensaje de error puede indicar qué constraint falló (e.g., "users_username_key" o "users_email_key")
            const detail = error.driverError.detail;
            const message = detail.includes('username') ? "El nombre de usuario ya existe." : "El correo electrónico ya está en uso.";
            return res.status(409).json({ message });
        }
        console.error("Error en el registro:", error);
        return res.status(500).json({ message: "Error interno del servidor al registrar el usuario." });
    }
};

export const login = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err: Error | null, user: User | false, info?: { message: string }) => {
        if (err) { return next(err); }
        if (!user) { return res.status(401).json({ message: info?.message || "Credenciales inválidas" }); }

        req.login(user, (err: any) => {
            if (err) { return next(err); }
            // Excluimos el hash de la contraseña de la respuesta por seguridad
            const { password_hash, ...userResponse } = user;
            return res.json({ message: "Login exitoso", user: userResponse, isAuthenticated: true });
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