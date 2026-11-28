import nodemailer from "nodemailer";
import "dotenv/config";

const sendWelcomeEmail = async (email, nombre) => {
  // 1. Configuramos el transportador
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // true para puerto 465, false para 587 (STARTTLS)
    auth: {
      user: process.env.EMAIL_AUTH_USER,
      pass: process.env.EMAIL_AUTH_PASSWORD, //no funciona porque no tiene el password
    },
  });

  const frontendUrl = process.env.FRONTEND_URL;
  const loginUrl = `${frontendUrl}/login`;

  // 2. Configuramos el contenido del mail
  const htmlContent = `<!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>¡Bienvenido a Pizzería Bella Napoli!</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #fdf8f2; font-family: Arial, Helvetica, sans-serif; color: #333333;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fdf8f2; padding: 40px 15px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 540px; background-color: #ffffff; border-radius: 12px; border-top: 6px solid #b82925; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); overflow: hidden;">
              
              <!-- Encabezado / Marca -->
              <tr>
                <td align="center" style="padding: 32px 30px 16px 30px;">
                  <div style="font-size: 40px; line-height: 1; margin-bottom: 12px;">🍕</div>
                  <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 26px; color: #b82925; font-weight: bold;">
                    Pizzería Bella Napoli
                  </h1>
                  <p style="margin: 6px 0 0 0; font-size: 13px; color: #2e5a36; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">
                    Auténtica tradición artesanal
                  </p>
                </td>
              </tr>

              <!-- Línea divisoria -->
              <tr>
                <td style="padding: 0 30px;">
                  <hr style="border: none; border-top: 1px solid #efe5d8; margin: 10px 0;" />
                </td>
              </tr>

              <!-- Cuerpo del mensaje -->
              <tr>
                <td style="padding: 20px 30px 10px 30px; text-align: center;">
                  <h2 style="margin: 0 0 14px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 22px; color: #222222;">
                    ¡Benvenuto/a, ${nombre}!
                  </h2>
                  <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #555555;">
                    Tu cuenta fue creada con éxito con el correo <strong style="color: #333333;">${email}</strong>. Ya formás parte de la familia de <strong>Pizzería Bella Napoli</strong>.
                  </p>
                  <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #555555;">
                    Desde ahora podés explorar nuestro menú de pizzas al horno de barro, realizar tus pedidos online y acceder a promociones exclusivas para clientes registrados.
                  </p>
                </td>
              </tr>

              <!-- Caja de beneficio -->
              <tr>
                <td style="padding: 0 30px 26px 30px;">
                  <div style="background-color: #fdf8f2; border-left: 4px solid #2e5a36; border-radius: 6px; padding: 14px 18px; text-align: left;">
                    <p style="margin: 0; font-size: 14px; color: #2e5a36; font-weight: bold;">
                      🎁 Regalo de bienvenida
                    </p>
                    <p style="margin: 4px 0 0 0; font-size: 13px; color: #555555; line-height: 1.5;">
                      Iniciá sesión en nuestra web y disfrutá de un <strong>10% de descuento</strong> en tu primer pedido online.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Botón CTA -->
              <tr>
                <td align="center" style="padding: 0 30px 34px 30px;">
                  <a href="${loginUrl}" target="_blank" style="display: inline-block; background-color: #b82925; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: bold; padding: 13px 30px; border-radius: 8px;">
                    Iniciar sesión y pedir ahora
                  </a>
                </td>
              </tr>

              <!-- Pie del correo -->
              <tr>
                <td align="center" style="background-color: #212529; padding: 20px 30px; color: #cccccc; font-size: 12px; line-height: 1.5;">
                  <p style="margin: 0 0 4px 0; color: #ffc107; font-weight: bold;">
                    Pizzería Bella Napoli
                  </p>
                  <p style="margin: 0;">
                    Si no creaste esta cuenta, podés ignorar este mensaje.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>`;

  // 3. Enviamos el correo
  try {
    const info = await transporter.sendMail({
      from: `"Pizzería Bella Napoli" <${process.env.EMAIL_AUTH_USER}>`,
      to: email,
      subject: "Bienvenida a Pizzería Bella Napoli 🍕",
      text: `¡Hola ${nombre}! Bienvenido/a a Pizzería Bella Napoli. Iniciá sesión en ${loginUrl} y disfrutá de un 10% de descuento en tu primer pedido.`,
      html: htmlContent,
    });

    console.log("Message sent: %s", info.messageId);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("Preview URL: %s", previewUrl);
    }

    return { ok: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error al enviar correo de bienvenida:", error);
    throw error;
  }
};

export default sendWelcomeEmail;
