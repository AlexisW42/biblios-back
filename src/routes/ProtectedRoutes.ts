import { Router, Request, Response } from "express";

const router = Router();

// Esta ruta requiere autenticación
router.get("/profile", (req: Request, res: Response) => {
    res.json({ message: "Acceso a la ruta protegida!", user: (req as any).user });
});

export default router;