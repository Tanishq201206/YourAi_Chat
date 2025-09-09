// src/api/admin.js
import client from './client';

// helper to unwrap Spring Page responses (PageImpl)
function unwrapPage(data) {
  // If backend returned PageImpl-like object, prefer .content
  if (!data) return [];
  if (Array.isArray(data)) return data;
  // If it's an object with a content field (Spring Page)
  if (data.content && Array.isArray(data.content)) return data.content;
  // fallback: return as single-element array
  return data;
}

// 9. List all sessions (paginated) - backend returns Page object
export const listAllSessions = async (page = 0, size = 10) => {
  const res = await client.get('/api/admin/chat/sessions', { params: { page, size }});
  return { raw: res.data, items: unwrapPage(res.data) };
};

// 10. List sessions by user (paginated) - note route includes /user/ in your network capture
export const listSessionsByUser = async (email, page = 0, size = 10) => {
  const res = await client.get(`/api/admin/chat/sessions/user/${encodeURIComponent(email)}`, { params: { page, size }});
  return { raw: res.data, items: unwrapPage(res.data) };
};

// 11. Messages in a session (paginated)
export const listSessionMessages = async (sessionId, page = 0, size = 20) => {
  const res = await client.get(`/api/admin/chat/sessions/${encodeURIComponent(sessionId)}/messages`, { params: { page, size }});
  return { raw: res.data, items: unwrapPage(res.data) };
};

// 12. Delete session (admin)
export const deleteSessionAdmin = (sessionId) =>
  client.delete(`/api/admin/chat/sessions/${encodeURIComponent(sessionId)}`).then(r => r.data);

// 13. Stats
export const getAdminStats = () =>
  client.get('/api/admin/chat/stats').then(r => r.data);
