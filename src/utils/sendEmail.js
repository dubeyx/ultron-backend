// utils/sendEmail.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,     // e.g., your gmail
    pass: process.env.EMAIL_PASS      // app password (not your Gmail password)
  }
});

async function sendEmail({ to, subject, html }) {
  const mailOptions = {
    from: `"Ultron Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
