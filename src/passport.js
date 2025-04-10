import passport from "passport";
import { Strategy as OIDCStrategy } from "passport-openidconnect";
import dotenv from "dotenv";
import { poolPromise } from "./config/dbConfig.js";

dotenv.config();

passport.use(
  "oidc",
  new OIDCStrategy(
    {
      issuer: process.env.SAP_ISSUER_URL,
      authorizationURL: `${process.env.SAP_ISSUER_URL}/oauth2/authorize`,
      tokenURL: `${process.env.SAP_ISSUER_URL}/oauth2/token`,
      userInfoURL: `${process.env.SAP_ISSUER_URL}/oauth2/userinfo`,
      clientID: process.env.SAP_CLIENT_ID,
      clientSecret: process.env.SAP_CLIENT_SECRET,
      callbackURL: process.env.SAP_CALLBACK_URL,
      scope: "openid email profile",
    },
    async (issuer, profile, done) => {
      try {
        console.log("🚀 Profile recibido desde SAP Identity Services:");
        console.log(profile);

        const email = profile.emails?.[0]?.value;

        if (!email) {
          console.error("❌ No se encontró el email en el profile:", profile);
          return done(new Error("No se pudo obtener el email del usuario SAP"), null);
        }

        console.log("✅ Email recibido desde SAP:", email);

        // Verificamos en la base de datos, pero sin cortar el flujo
        const conn = await poolPromise;
        const stmt = await conn.prepare("SELECT * FROM Usuario WHERE email = ?");
        const result = await stmt.exec([email]);

        if (result && result.length > 0) {
          const userLocal = result[0];
          console.log("✅ Usuario encontrado en la base local:", userLocal);

          profile.localUser = {
            id: userLocal.ID,
            nombre: userLocal.NOMBRE,
            email: userLocal.EMAIL,
            rol: userLocal.ROL,
            registrado: true,
          };
        } else {
          console.warn("⚠️ El usuario SAP no está registrado en la base local:", email);
          profile.localUser = {
            email,
            registrado: false,
          };
        }

        // Continuamos el flujo sin importar si existe o no en la base local
        return done(null, profile);
      } catch (error) {
        console.error("❌ Error durante la verificación del usuario SAP:", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  const sessionUser = {
    email: user.localUser?.email || user.emails?.[0]?.value,
    id: user.localUser?.id || user.id,
    rol: user.localUser?.rol || 'Invitado',
  };
  console.log("✅ Usuario serializado en la sesión:", sessionUser);
  done(null, sessionUser);
});

passport.deserializeUser((obj, done) => {
  console.log("♻️ Usuario deserializado de la sesión:", obj);
  done(null, obj);
});


export default passport;
