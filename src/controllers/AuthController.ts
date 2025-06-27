import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const userRepository = AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        const newUser = new User();
        newUser.username = username;
        newUser.email = email;
        newUser.password = password;

        await newUser.hashPassword();

        await userRepository.save(newUser);
        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        // if (error.code === '23505') { // Código de error para duplicado en PostgreSQL
        //     res.status(409).json({ message: "El usuario o correo electrónico ya existe" });
        //     return;
        // }
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await userRepository.findOne({ where: { username } });

        if (!user) {
            res.status(401).json({ message: "Credenciales inválidas" });
            return;
        }

        const isPasswordValid = await user.checkPassword(password);

        if (!isPasswordValid) {
            res.status(401).json({ message: "Credenciales inválidas" });
            return;
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" } // El token expira en 1 hora
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};