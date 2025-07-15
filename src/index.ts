import "reflect-metadata";
import "dotenv/config"; // Asegúrate que dotenv se cargue primero
import express from "express";
import { AppDataSource } from "./data-source";
import authRoutes from "./routes/AuthRoutes";
import protectedRoutes from "./routes/ProtectedRoutes";
import passport from "./config/passport";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { isAuthenticated } from "./middleware/isAuthenticated"; 
import { Pool } from "pg";

const main = async () => {
    const app = express();
    const PORT = process.env.PORT || 3000;
    
    // Verificación de seguridad para el Session Secret
    if (!process.env.SESSION_SECRET) {
        console.error("FATAL ERROR: SESSION_SECRET no está definido en las variables de entorno.");
        process.exit(1);
    }

    // 1. Inicializar la conexión a la base de datos PRIMERO
    await AppDataSource.initialize();
    console.log("Conectado a la base de datos!");

    // 2. Ahora que la conexión está activa, configurar el almacén de sesión
    const PgStore = connectPgSimple(session);
    const sessionStore = new PgStore({
        // 3. Acceder al pool de `pg` a través del driver de TypeORM
        pool: (AppDataSource.driver as any).pool as Pool,
        tableName: 'user_sessions', // Nombre de la tabla de sesiones
    });

    app.use(express.json());
    app.use(session({
        store: sessionStore,
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production' // Descomentar para producción con HTTPS
        }
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    // Rutas de autenticación (registro y login)
    app.use("/auth", authRoutes);

    // Rutas protegidas, ahora usando nuestro middleware `isAuthenticated`
    app.use("/api", isAuthenticated, protectedRoutes);

    app.listen(PORT, () => {
        console.log(`Servidor Express corriendo en el puerto ${PORT}`);
    });
};

main().catch((error) => console.error("Error al iniciar la aplicación:", error));