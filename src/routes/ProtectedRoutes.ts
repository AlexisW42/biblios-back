import { Router, Request, Response } from "express";
import { checkRole } from "../middleware/checkRole";

const router = Router();
// La autenticación ya se verifica en `index.ts` con el middleware `isAuthenticated`
// para todas las rutas en `/api`. Por lo tanto, no es necesario volver a comprobarlo aquí.

// Esta ruta requiere autenticación (cualquier rol)
router.get("/profile", (req: Request, res: Response) => {
    // req.user es populado por Passport desde la sesión
    res.json({ message: "Acceso a la ruta de perfil!", user: req.user });
});

// Esta ruta requiere autenticación Y el rol de 'admin'
router.get("/admin-dashboard", checkRole(['admin']), (req: Request, res: Response) => {
    res.json({ message: "¡Bienvenido al panel de administrador!", user: req.user });
});

export default router;