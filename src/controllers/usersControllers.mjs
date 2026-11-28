// importar el validador de express-validator
import { validationResult } from "express-validator";

// importamos la función para encriptar la contraseña
import encryptPassword from "../helpers/encriptar.mjs";

// importamos la librería para encriptar la contraseña
import bcrypt from "bcrypt";

// importamos el modelo de usuario
import User from "../models/userModel.mjs";

// importamos el jsonwebtoken
import jwt from "jsonwebtoken";

// importamos la función para enviar el mail de bienvenida
import sendWelcomeEmail from "../helpers/sendEmail.mjs";

// Registro de usuarios
const registerUser = async (req, res) => {

  //1. Validar los campos
  const errors = validationResult(req);

  console.log(errors);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // desestructuring
  const { nombre, email, password } = req.body

  console.log(password);

 // 2. Encriptar la contraseña

  // 2.1 Encriptamos la contraseña con la función de encriptar.mjs
  const encryptedPassword = encryptPassword(password);
  console.log(encryptedPassword);

  // 2.1 Generamos la salt
  /* const salt = bcrypt.genSaltSync(10);
  console.log(salt); */

  // 2.2 Encriptamos la contraseña
  /* const encryptedPassword = bcrypt.hashSync(password, salt);
  console.log(encryptedPassword);
 */
  // 3. Generar un usuario en la base de datos
  const user = {
    name: nombre,
    email,
    password: encryptedPassword,
  }

  //4. Guardamos al user en la database
  try {

    //1. Verificamos si el email ya existe
    const emailExist = await User.findOne({ email });

    console.log(emailExist);// imprime el user

    // Si el email ya existe, devolvemos un error
    if (emailExist) {
      return res.status(409).render(
        "error-email", {
          title: "Error de Registro",
          email,
          customStyle: "login",
        }
      );
    }

    // Si no existe el email, creamos el usuario
    const newUser = await User.create(user);
    console.log(newUser);

    // Enviamos un mail de bienvenida
    if (newUser) {

      try {

        const data = await sendWelcomeEmail(newUser.email, newUser.name);
        console.log(data);
        
      } catch (error) {
        console.log(error);

        return res.status(500).render(
          "error-registro", {
            title: "Error de Registro",
            mensaje: "Nuestros Ingenieros están trabajando para resolver este problema. Por favor, intentá nuevamente en unos minutos.",
            customStyle: "login",
          }
        );
      }

    } 

    // Si está joya todo, renderizamos registro-exitoso
    res.status(200).render("registro-exitoso", {
      nombre,
      email,
      loginUrl: "/login",
      homeUrl: "/",
      customStyle: "login",
      title: "Registro",
    })
  } catch (error) {
    // Si hay un error, devolvemos un error interno del servidor
    console.log(error);
    return res.status(500).render(
      "error-registro", {
        title: "Error de Registro",
        mensaje: "Nuestros Ingenieros están trabajando para resolver este problema. Por favor, intentá nuevamente en unos minutos.",
        customStyle: "login",
      }
    );

  }


  
}

// Login de usuarios
const loginUser = async (req, res) => {

  const { email, password } = req.body
  
  //1. Validar los campos
  const errors = validationResult(req);

  console.log(errors);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });// Generar en hbs para este error
  }


  // 2 Try catch
  try {
    // 2.1 Buscamos el usuario en la base de datos
    const user = await User.findOne({ email });

    console.log(user);// imprime el user

    // Si el usuario no existe, devolvemos un error
    if (!user) {
      return res.status(404).render(
        "error-login", {
          title: "Error de Login",
          email,
          customStyle: "login",
        }
      );
    }


    // Si el usuario existe, verificamos la contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Si la contraseña no coincide, devolvemos un error
    if (!passwordMatch) {
      return res.status(400).render(
        "error-login", {
          title: "Error de Login",
          email,
          customStyle: "login",
        }
      );
    }

    // 2.2 Generamos el token
    const payload = {// información del usuario que agregamos al token
      id: user._id,
      nombre: user.name,
      email: user.email,
      role: user.role,
    }

    // 2.3 Generamos el token
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;
    const token = jwt.sign(payload, secret, { expiresIn });
    console.log(token)

    // 2.4 Guardamos el token en la cookie
    res.cookie("token", token, {
      httpOnly: true, //sólo valido desde el cliente, no desde el servidor
      expiresIn: process.env.JWT_COOKIE_EXPIRES_IN,
    })


    // Si está joya todo, renderizamos login-exitoso
    res.status(200).render("login-exitoso", {
      nombre: user.name,
      email,
      loginUrl: "/login",
      homeUrl: "/",
      customStyle: "login",
      title: "Login",
    })
  } catch (error) {
    // Si hay un error, devolvemos un error interno del servidor
    console.log(error);
    return res.status(500).render(
      "error-login", {
        title: "Error de Login",
        mensaje: "Nuestros Ingenieros están trabajando para resolver este problema. Por favor, intentá nuevamente en unos minutos.",
        customStyle: "login",
      }
    );

  }


}


export { 
  registerUser,
  loginUser
}