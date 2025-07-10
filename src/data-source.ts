import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "./entity/User";
import { Location } from "./entity/Location";
import { Book } from "./entity/Book";
import { BookCopy } from "./entity/BookCopy";
import { Loan } from "./entity/Loan";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false, // Desactivado cuando se usan migraciones
    logging: false,
    entities: [User, Location, Book, BookCopy, Loan],
    migrations: ["src/migration/**/*.ts"],
    subscribers: [],
});