import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    // Configuración SSL robusta controlada por variable de entorno
    ssl: process.env.DB_SSL === 'true' 
        ? { rejectUnauthorized: false } 
        : undefined,
    synchronize: false, // Se establece en 'false' porque estás usando migraciones para gestionar el esquema.
    logging: false,
    // Usar un patrón glob para cargar automáticamente todas las entidades.
    // Esto evita tener que importar y añadir cada nueva entidad manualmente.
    entities: [__dirname + "/entity/**/*.{js,ts}"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: [],
});