const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,              // ✅ SSL direct, plus fiable que STARTTLS sur 587
  family: 4,                 // ✅ force IPv4, contourne l'IPv6 qui causait ENETUNREACH
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 15000,  // ✅ laisse plus de temps au réseau Render
  greetingTimeout: 15000,
  socketTimeout: 15000,
});

async function sendVerificationEmail(email, code) {
  try {
    await transporter.sendMail({
      from: `"VoxLingo" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Code de verification VoxLingo',
      html: `
        <div style="text-align:center; font-family:Arial; padding:20px;">
          <h1 style="color:#6366F1;">🎤 VoxLingo</h1>
          <p>Voici ton code de verification :</p>
          <h2 style="letter-spacing:8px; color:#6366F1; font-size:32px;">${code}</h2>
          <p style="color:#6B7280;">Ce code expire dans 10 minutes.</p>
        </div>
      `,
    });
    console.log(`✅ Email envoye a ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email:', error.message);
    return false;
  }
}

module.exports = { sendVerificationEmail };