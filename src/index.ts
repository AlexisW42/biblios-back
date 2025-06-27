import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import authRoutes from "./routes/AuthRoutes";
import protectedRoutes from "./routes/ProtectedRoutes"; // Una ruta protegida de ejemplo
import { authenticateToken } from "./middlewares/AuthMiddleware";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Para parsear el cuerpo de las peticiones JSON

AppDataSource.initialize()
    .then(() => {
        console.log("Conectado a la base de datos!");

        // Rutas de autenticación (registro y login)
        app.use("/auth", authRoutes);

        // Una ruta protegida pa probar
        app.use("/api", authenticateToken, protectedRoutes);

        app.listen(PORT, () => {
            console.log(`Servidor Express corriendo en el puerto ${PORT}`);
        });
    })
    .catch((error) => console.error("Error al conectar a la base de datos:", error));