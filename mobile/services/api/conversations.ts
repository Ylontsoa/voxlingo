import client from './client';

export async function createConversationRequest(language: string) {
  console.log('[API createConversation] langue:', language);
  try {
    const { data } = await client.post('/conversations', { language });
    return data;
  } catch (err: any) {
    console.error('[API createConversation] Erreur:', err?.response?.status, err?.response?.data || err.message);
    throw err;
  }
}

export async function joinConversationRequest(code: string, language: string) {
  console.log('[API joinConversation] code:', code, '- langue:', language);
  try {
    const { data } = await client.post('/conversations/join', { code, language });
    return data;
  } catch (err: any) {
    console.error('[API joinConversation] Erreur:', err?.response?.status, err?.response?.data || err.message);
    throw err;
  }
}

// ✅ NOUVEAU
export async function startConversationRequest(targetUserId: number, language: string) {
  console.log('[API startConversation] target:', targetUserId, '- langue:', language);
  try {
    const { data } = await client.post('/conversations/start', { targetUserId, language });
    return data;
  } catch (err: any) {
    console.error('[API startConversation] Erreur:', err?.response?.status, err?.response?.data || err.message);
    throw err;
  }
}

// ✅ NOUVEAU
export async function getMyConversationsRequest() {
  console.log('[API getMyConversations] Envoi');
  try {
    const { data } = await client.get('/conversations/mine/list');
    return data;
  } catch (err: any) {
    console.error('[API getMyConversations] Erreur:', err?.response?.status, err?.response?.data || err.message);
    throw err;
  }
}

export async function getConversationMessagesRequest(code: string) {
  console.log('[API getMessages] code:', code);
  try {
    const { data } = await client.get(`/conversations/${code}/messages`);
    return data;
  } catch (err: any) {
    console.error('[API getMessages] Erreur:', err?.response?.status, err?.response?.data || err.message);
    throw err;
  }
}