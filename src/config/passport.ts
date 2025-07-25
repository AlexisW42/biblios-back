// src/config/passport.ts
// ¡Este archivo ya está correcto! No se necesitan cambios.
import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import bcrypt from 'bcryptjs';

// Estrategia para el login con email y contraseña
passport.use(
  new LocalStrategy({
    usernameField: 'email'
  }, async (email, password, done) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.createQueryBuilder("user")
        .addSelect("user.password_hash")
        .where("user.email = :email", { email })
        .getOne();

      if (!user) {
        return done(null, false, { message: 'Credenciales inválidas.' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return done(null, false, { message: 'Credenciales inválidas.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Guarda el ID del usuario en la sesión
passport.serializeUser((user: any, done) => {
  done(null, user.user_id);
});

// Recupera al usuario completo a partir del ID guardado en la sesión
passport.deserializeUser(async (id: number, done) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ user_id: id });
    if (user) {
      // Excluimos el hash de la contraseña del objeto de usuario que se adjuntará a req.user
      const { password_hash, ...userWithoutPassword } = user;
      done(null, userWithoutPassword);
    } else {
      done(null, false);
    }
  } catch (error) {
    done(error, null);
  }
});

export default passport;
