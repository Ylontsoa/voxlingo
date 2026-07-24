const { ConversationHistory } = require('../models');

async function saveHistory(req, res, next) {
  try {
    const { language, messages } = req.body;
    const history = await ConversationHistory.create({
      user_id: req.user.id,
      language,
      messages: JSON.stringify(messages),
    });
    res.json({ success: true, history });
  } catch (error) { next(error); }
}

async function getHistory(req, res, next) {
  try {
    const history = await ConversationHistory.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']],
      limit: 10,
    });
    res.json({ success: true, history });
  } catch (error) { next(error); }
}

async function deleteHistory(req, res, next) {
  try {
    await ConversationHistory.destroy({ where: { user_id: req.user.id } });
    res.json({ success: true, message: 'Historique supprime' });
  } catch (error) { next(error); }
}

module.exports = { saveHistory, getHistory, deleteHistory };