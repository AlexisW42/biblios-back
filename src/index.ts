// index.ts
import "reflect-metadata";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "./data-source"; // Importa AppDataSource
import authRoutes from "./routes/AuthRoutes";
import protectedRoutes from "./routes/ProtectedRoutes";
import passport from "./config/passport";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { isAuthenticated } from "./middleware/isAuthenticated";
import { Pool } from "pg"; // Importa Pool directamente desde 'pg'
import cors from "cors";

const main = async () => {
    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true
    }));

    // Verificación de seguridad para el Session Secret
    if (!process.env.SESSION_SECRET) {
        console.error("FATAL ERROR: SESSION_SECRET no está definido en las variables de entorno.");
        process.exit(1);
    }

    // Verificación explícita de las variables de entorno de la base de datos
    const requiredDbEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE'];
    for (const v of requiredDbEnvVars) {
        if (!process.env[v]) { // Comprueba si la variable es undefined, null, o una cadena vacía ''
            console.error(`FATAL ERROR: La variable de entorno requerida '${v}' no está definida o está vacía.`);
            console.error("Por favor, revisa tu archivo .env y asegúrate de que esté completo y en el directorio raíz del proyecto.");
            process.exit(1);
        }
    }

    // 1. Inicializar la conexión a la base de datos. TypeORM gestionará su propio pool.
    try {
        await AppDataSource.initialize();
        console.log("Conectado a la base de datos con TypeORM!");
    } catch (error) {
        console.error("Error al conectar TypeORM a la base de datos:", error);
        process.exit(1); // Salir si la conexión inicial falla
    }

    // 2. Obtener el pool de conexiones de TypeORM para compartirlo con otros módulos.
    // Accedemos al pool 'master' del driver. En configuraciones sin replicación,
    // 'pool' es un alias de 'master', pero acceder a 'master' es más directo y robusto.
    const pgPool = (AppDataSource.driver as any).master as Pool;

    // Manejar errores en el pool de pg (buena práctica para detectar problemas de conexión)
    pgPool.on('error', (err: Error) => {
        console.error('ERROR INESPERADO EN EL POOL DE CONEXIONES DE PG:', err.message, err.stack);
    });

    // 3. Ahora que la conexión está activa, configurar el almacén de sesión usando el pool de TypeORM.
    const PgStore = connectPgSimple(session);
    const sessionStore = new PgStore({
        // Pasar el pool de pg que TypeORM está usando.
        pool: pgPool,
        tableName: 'user_sessions', // Nombre de la tabla de sesiones
        // Se desactiva, ya que la migración `CreateUserSessionsTable` se encarga de esto.
        createTableIfMissing: false,
    });

    sessionStore.on('error', function (error) {
        console.error('ERROR EN EL ALMACÉN DE SESIONES:', error);
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
    app.use("/api/auth", authRoutes);

    // Rutas protegidas, ahora usando nuestro middleware `isAuthenticated`
    app.use("/api", isAuthenticated, protectedRoutes);

    // Manejador de errores global. Debe ser el último `app.use`.
    // Captura cualquier error que ocurra en las rutas y envía una respuesta JSON.
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error("ERROR NO CAPTURADO:", err.stack);
        // Evita enviar el stack de error en producción
        const message = process.env.NODE_ENV === 'production' ? 'Algo salió mal.' : err.message;
        res.status(500).json({ message });
    });

    app.listen(PORT, () => {
        console.log(`Servidor Express corriendo en el puerto ${PORT}`);
    });

    // Manejar cierre de la aplicación para cerrar la conexión a la DB
    process.on('SIGINT', async () => {
        console.log('Cerrando servidor...');
        await AppDataSource.destroy(); // Cerrar la conexión de TypeORM
        process.exit(0);
    });
};

main().catch((error) => console.error("Error FATAL al iniciar la aplicación:", error));