import client from './client';

export async function searchUsersRequest(query: string) {
  console.log('[API searchUsers] recherche:', query);
  try {
    const { data } = await client.get('/users/search', { params: { q: query } });
    console.log('[API searchUsers] Reponse:', data.users?.length, 'resultats');
    return data;
  } catch (err: any) {
    console.error('[API searchUsers] Erreur:', err?.response?.status, err?.response?.data || err.message);
    throw err;
  }
}