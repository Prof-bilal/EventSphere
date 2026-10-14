const { BrevoClient } = require("@getbrevo/brevo");



const brevoClient = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

const sendEmail = async (to, name , verificationToken) => {
  try {
    const verificationUrl =
      `${process.env.FRONTEND_URL}/verify-email?token=${encodeURIComponent(verificationToken)}`;

    const response =
      await brevoClient.transactionalEmails.sendTransacEmail({
        sender: {
          email: process.env.BREVO_SENDER_EMAIL,
          name: process.env.BREVO_SENDER_NAME || "EventSphere",
        },

        to: [
          {
            email: to,
            name: name,
          },
        ],

        subject: "Verify Your Email",

        htmlContent: `
          <!DOCTYPE html>
          <html>
            <body style="font-family: Arial, sans-serif;">
              <h2>Verify your email</h2>

              <p>Hi ${name},</p>

              <p>
                Thanks for creating an account.
                Click the button below to verify your email.
              </p>

              <a
                href="${verificationUrl}"
                style="
                  display:inline-block;
                  padding:12px 20px;
                  background:#111;
                  color:white;
                  text-decoration:none;
                  border-radius:6px;
                "
              >
                Verify Email
              </a>

              <p>This link expires in 30 minutes.</p>

              <p>
                If you didn't create this account,
                you can ignore this email.
              </p>
            </body>
          </html>
        `,
      });

    console.log("Email sent successfully:", response);

    return response;
  } catch (error) {
    console.error("BREVO FULL ERROR:", error);
    console.error("BREVO MESSAGE:", error.message);
    console.error("BREVO STATUS:", error.statusCode);

    throw error;
  }
};

const sendPasswordResetEmail = async (to, name , resetToken) => {
    try {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(resetToken)}`;
        const result = await brevoClient.transactionalEmails.sendTransacEmail({
            sender: {
                email: process.env.BREVO_SENDER_EMAIL,
                name: process.env.BREVO_SENDER_NAME || "EventSphere",
            },
            to: [
                {
                    email: to,
                    name: name,
                },
            ],
            subject: "Reset Your Password",
            htmlContent: `
                <!DOCTYPE html>
                <html>
                    <body style="font-family: Arial, sans-serif;">
                        <h2>Reset your password</h2>
                        <p>Hi ${name},</p>
                        <p>You requested a password reset. Click the button below to reset your password.</p>
                        <a href="${resetUrl}" style="
                            display:inline-block;
                            padding:12px 20px;
                            background:#111;
                            color:white;
                            text-decoration:none;
                            border-radius:6px;
                        ">Reset Password</a>
                        <p>This link expires in 30 minutes.</p>
                        <p>If you didn't request a password reset, you can ignore this email.</p>
                    </body>
                </html>
            `,
        });

        console.log("Password reset email sent successfully:", result);
        return result;
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw error;
    }
}

const sendNotificationEmail = async (to, name, subject, title, message) => {
  try {
    const response = await brevoClient.transactionalEmails.sendTransacEmail({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: process.env.BREVO_SENDER_NAME || "EventSphere",
      },
      to: [
        {
          email: to,
          name: name,
        },
      ],
      subject,
      htmlContent: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif;">
            <h2>${title}</h2>
            <p>Hi ${name},</p>
            <p>${message}</p>
            <p>EventSphere</p>
          </body>
        </html>
      `,
    });
    return response;
  } catch (error) {
    console.error("BREVO NOTIFICATION ERROR:", error.message);
    return null;
  }
};

module.exports = { sendEmail, sendPasswordResetEmail, sendNotificationEmail };
