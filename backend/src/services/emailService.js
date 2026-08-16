const axios = require('axios');

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

async function sendVerificationEmail(email, code) {
  try {
    await axios.post(
      BREVO_API_URL,
      {
        sender: { name: 'VoxLingo', email: process.env.EMAIL_USER },
        to: [{ email }],
        subject: '🔐 Code de verification VoxLingo',
        htmlContent: `
          <div style="text-align:center; font-family:Arial; padding:20px;">
            <h1 style="color:#6366F1;">🎤 VoxLingo</h1>
            <p>Voici ton code de verification :</p>
            <h2 style="letter-spacing:8px; color:#6366F1; font-size:32px;">${code}</h2>
            <p style="color:#6B7280;">Ce code expire dans 10 minutes.</p>
          </div>
        `,
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 15000,
      }
    );
    console.log(`✅ Email envoye a ${email} (via Brevo)`);
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email:', error.response?.data || error.message);
    return false;
  }
}

module.exports = { sendVerificationEmail };