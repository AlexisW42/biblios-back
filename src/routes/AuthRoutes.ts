import { Router } from "express";
import { register, login, logout } from "../controllers/AuthController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get('/refresh', (req, res) => {
    if (req.isAuthenticated()) {
        // Devuelve los datos del usuario autenticado
        res.json({ user: req.user, isAuthenticated: true });
    } else {
        res.status(401).json({ isAuthenticated: false });
    }
});

export default router;