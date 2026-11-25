import rateLimit from "express-rate-limit"

// Limitar las peticiones por IP
const apiLimiter = rateLimit({
  windowMs: 1000 * 60 * 15, // ventana de 15 minutos
  max: 100, // maximo 100 peticiones por IP
  message: "Demasiadas peticiones por IP, por favor intenta más tarde",
  standardHeaders: true,
  legacyHeaders: false,
})

// Creamos una función para limitar los intentos de login por ip a 5
const loginLimiter = rateLimit({
  windowMs: 1000 * 60 * 5, // ventana de 5 minutos
  max: 5, // maximo 5 intentos de login por IP
  message: "Demasiados intentos de login, por favor intenta más tarde", // mensaje de error
  standardHeaders: true,
  legacyHeaders: false,
})


export { 
  apiLimiter,
  loginLimiter
}
