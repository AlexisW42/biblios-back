import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "./entity/User"; // Tu entidad de usuario

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql", // O "mysql", "sqlite", etc.
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true, // ¡Solo para desarrollo! No usar en producción.
    logging: false,
    entities: [User], // Agrega todas tus entidades aquí
    migrations: [],
    subscribers: [],
});