const Groq = require('groq-sdk');
const fs = require('fs');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function transcribeAudio(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Aucun son detecte, veuillez reessayer' });
    }

    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: 'whisper-large-v3',
      language: req.body.language || undefined,
      response_format: 'json',
      temperature: 0, // ✅ resultat plus stable, moins de variations aleatoires
    });

    fs.unlink(req.file.path, () => {});

    // ✅ Nettoyage : enleve les repetitions de mots, capitalise la 1ere lettre
    let text = transcription.text.trim();
    text = text.replace(/\b(\w+)( \1\b)+/gi, '$1');
    if (text.length > 0) {
      text = text.charAt(0).toUpperCase() + text.slice(1);
    }

    res.json({ success: true, text });
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    console.error('Erreur transcription:', error.message);
    res.status(500).json({ success: false, message: 'Erreur de transcription, veuillez reessayer' });
  }
}

module.exports = { transcribeAudio };