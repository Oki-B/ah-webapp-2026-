require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: `${process.env.EMAIL_USER}`,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

const sendInvitationEmail = async (email, token) => {
  const inviteLink = `${process.env.FRONTEND_URL}/accept-invite?token=${token}`;

  await transporter.sendMail({
    from: `"Admin System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "You're invited!",
    html: `
      <h2>Invitation</h2>
      <p>You have been invited to join the system.</p>
      <p>Click the link below to accept the invitation:</p>
      <a href="${inviteLink}">${inviteLink}</a>
      <p>This link will expire in 24 hours.</p>
    `,
  });
};

const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"Admin System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email",

    html: `
      <h2>Verify your email</h2>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationLink}">${verificationLink}</a>
      <p>This link will expire in 24 hours.</p>
    `,
  });
};

module.exports = { sendInvitationEmail, sendVerificationEmail };
