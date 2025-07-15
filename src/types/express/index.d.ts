import { User } from "../../entity/User"; // Ajusta la ruta a tu entidad User

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}