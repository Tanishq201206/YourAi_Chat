import client, { API_BASE_URL } from './client';

// --- Sessions ---
export const listSessions = () =>
  client.get('/api/chat-memory/sessions').then(r => r.data);

export const createSession = (title) =>
  client.post('/api/chat-memory/new', null, { params: { title } }).then(r => r.data);

export const renameSession = (id, title) =>
  client.patch(`/api/chat-memory/${id}/rename`, null, { params: { title } }).then(r => r.data);

export const deleteSession = (id) =>
  client.delete(`/api/chat-memory/${id}`).then(r => r.data);

// --- History + Non-stream send (kept for fallback/tools) ---
export const getHistory = (id) =>
  client.get(`/api/chat-memory/history/${id}`).then(r => r.data);

export const sendMessage = (id, payload) =>
  client.post(`/api/chat-memory/${id}`, payload).then(r => r.data);

export const renameAuto = (id) =>
  client.post(`/api/chat-memory/rename-auto/${id}`).then(r => r.data);

export async function sendMessageStream(id, payload, onEvent, signal) {
  const url = `${API_BASE_URL}/api/chat-memory/${id}`;

  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'text/event-stream',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'include', // send cookies/JWT
      signal,
    });
  } catch (e) {
    onEvent?.({ type: 'error', content: e?.message || 'Network error' });
    return;
  }

  if (res.status === 401) {
    onEvent?.({ type: 'error', content: 'Unauthorized' });
    // raw redirect on auth expiry
    window.location.href = '/login';
    return;
  }

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => '');
    onEvent?.({ type: 'error', content: text || `HTTP ${res.status}` });
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  onEvent?.({ type: 'start' });

  try {
    // read until stream ends or aborted
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Split SSE frames on blank line
      let idx;
      while ((idx = buffer.indexOf('\n\n')) !== -1) {
        const frame = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);

        // Each frame can have multiple lines (event:, data:, etc.)
        const lines = frame.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          // We only care about data lines; backend sends JSON in data:
          if (trimmed.startsWith('data:')) {
            const payloadStr = trimmed.slice(5).trim();
            if (!payloadStr) continue;
            if (payloadStr === '[DONE]') continue;

            try {
              const evt = JSON.parse(payloadStr);
              onEvent?.(evt);
            } catch {
              onEvent?.({ type: 'error', content: '...', raw: payloadStr });
            }
          }
        }
      }
    }

    onEvent?.({ type: 'end' });
  } catch (e) {
    if (signal && signal.aborted) {
      onEvent?.({ type: 'error', content: 'Aborted' });
    } else {
      onEvent?.({ type: 'error', content: e?.message || 'Stream read error' });
    }
  } finally {
    try { reader.releaseLock?.(); } catch {}
  }
}
