// src/pages/api/webhook.js
import Stripe from "stripe";

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

export const POST = async ({ request }) => {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      import.meta.env.STRIPE_WEBHOOK_SECRET
    );
    switch (event.type) {
      case "checkout.session.completed":
        const checkoutSessionCompleted = event.data.object;
        const customer = checkoutSessionCompleted.customer_details;
        const email = customer.email;
        const name = customer.name;
        const channelId = import.meta.env.DISCORD_CHANNEL_ID;
        const botToken = import.meta.env.DISCORD_BOT_TOKEN;
        let inviteCode = null;
        try {
          const inviteResponse = await fetch(
            `https://discord.com/api/v10/channels/${channelId}/invites`,
            {
              method: "POST",
              headers: {
                Authorization: `Bot ${botToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                max_age: 0, // Sin límite de tiempo
                max_uses: 1, // Solo un uso
                unique: true,
              }),
            }
          );

          if (!inviteResponse.ok) {
            throw new Error(
              `Error al crear la invitación de Discord: ${inviteResponse.statusText}`
            );
          }
          const inviteData = await inviteResponse.json();
          inviteCode = inviteData.code;
        } catch (error) {
          console.error("Error al crear la invitación de Discord:", error);
        }

        // ENVIAR CORREO DE BIENVENIDA
        try {
          const apiKey = import.meta.env.BREVO_API_KEY;
          if (!apiKey) {
            throw new Error("Clave API de Brevo no está definida");
          }
          const payload = {
            sender: { name: "Luis Garre", email: "luisgarre3@gmail.com" },
            to: [{ email, name }],
            subject: `ACCESO A LA MAMBRESÍA RESET A LA MATRIX - CAMBIA TU VIDA AHORA 🔥🎫`,
            htmlContent: `
          <!DOCTYPE html>
          <html lang="es">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
              <title>RESET A LA MATRIX</title>
              <style>
                body {
                  margin: 0;
                  padding: 0;
                  font-family: Arial, sans-serif;
                  text-align: center;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  text-align: center;
                  padding: 20px 0;
                }
                .saludo {
                  font-size: 1.5rem;
                }
                .title {
                  font-size: 2srem;
                  color: #801FC6 !important;
                  margin: 20px 0;
                }
                .title span {
                  color: #00ff00 !important;
                }
                h2 {
                  font-size: 1rem;
                  margin: 20px 0;
                  color: black;
                }
                .footer {
                  text-align: center;
                  font-size: 14px;
                  margin-top: 20px;
                  color: #bbb !important;
                }
                /* ==== BLOQUE DE ESTILOS PARA LA INVITACIÓN DE DISCORD ==== */
                .discord-invite {
                  background: #717cee; /* color estilo Discord */
                  padding: 20px;
                  border-radius: 10px;
                  color: #fff;
                  max-width: 400px;
                  margin: 20px auto;
                }
                .discord-logo {
                  width: 100px;
                  margin-bottom: 10px;
                }
                .discord-invite h3 {
                  color: #801FC6 !important;
                  margin: 10px 0;
                }
                .discord-invite p {
                  font-size: 1.2rem;
                  margin: 0 0 20px;
                }
                .discord-btn {
                  background-color: #fff;
                  color: #5865F2;
                  text-decoration: none;
                  padding: 20px;
                  border-radius: 5px;
                  font-weight: bold;
                  display: inline-block;
                  font-size: 1.2rem;
                  transition: background-color 0.2s ease;
                }
                .discord-btn:hover {
                  background-color: #dcdcdc;
                }
                /* Lista de puntos importantes */
                .discord-points {
                  text-align: left;
                  margin: 0 auto 20px; /* margen inferior para separar del botón */
                  max-width: 400px;    /* ajusta si deseas otro ancho */
                  list-style: disc;
                  padding-left: 20px;
                  font-size: 0.9rem;
                }
                .discord-points li {
                  margin-bottom: 8px;
                  font-size: 1rem;
                }
              </style>
            </head>
            <body style="background-color: transparent; color:#000 !important;">
              <div class="container" style="background-color: transparent !important;">
                <h2>Bienvenido a la membresía</h2>
                <h1 class="title">
                  RESET A LA <span>MATRIX</span>
                </h1>

                <div style="color: #000 !important;">
                  <p class="saludo">
                    ¡Hola ${name}! 👋
                  </p>
                  <p>
                    Gracias por unirte a <strong style="color: #801FC6 !important;">RESET A LA <span style="color: #00ff00 !important;">MATRIX</span></strong>.
                    A continuación encontrarás el enlace para unirte a nuestra comunidad privada de Discord.
                  </p>
                </div>

                <div class="header">
                  <!-- ==== INVITACIÓN A DISCORD ==== -->
                  <ul class="discord-points">
                    <li>🔒 El enlace es de <strong>un solo uso</strong></li>
                    <li>👤 Debes iniciar sesión con tu cuenta de Discord.</li>
                    <li>🆕 Si no tienes cuenta, créala gratis.</li>
                    <li>🤝 Respeta las normas de convivencia y participa activamente.</li>
                    <li>💬 Comparte tus dudas y experiencias con la comunidad.</li>
                  </ul>
                  <div class="discord-invite">
                    <img
                      src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/discord-white-icon.png"
                      alt="Discord Logo"
                      class="discord-logo"
                    />
                    <p>¡Únete a nuestra comunidad en Discord!</p>

                    <!-- Puntos importantes -->

                    <a href="https://discord.gg/${inviteCode}" class="discord-btn">
                      Unirse ahora
                    </a>
                  </div>
                  <p style="color: #000 !important;">
                    Nos vemos dentro<br />
                    <strong style="color: #801FC6 !important;">Luis Garre</strong>
                  </p>
                </div>
              </div>
            </body>
          </html>            
        `,
          };
          const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "api-key": apiKey,
            },
            body: JSON.stringify(payload),
          });
          if (!response.ok) {
            throw new Error(
              `Error al enviar el correo de bienvenida: ${response.statusText}`
            );
          }
        } catch (error) {
          console.error("Error al crear la invitación:", error);
        }

        // ENVIAR INVITACION DE SKOOL
        try {
          const skoolWebhook = `https://api.skool.com/groups/resetalamatrix/webhooks/101777d605994ba6af9fb8d24ec4f40e?email=${email}`;
          const response = await fetch(skoolWebhook, {
            method: "POST",
          });

          if (!response.ok) {
            console.error(
              `Failed to send invitation to Skool for ${email}. Status: ${response.status}`
            );
            return new Response(JSON.stringify({ received: false }), {
              status: 500,
            });
          }
        } catch (error) {
          console.error("Error al enviar la invitación a Skool:", error);
        }
        break;
    }
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }
};
