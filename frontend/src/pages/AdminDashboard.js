// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import {
  listAllSessions,
  listSessionsByUser,
  listSessionMessages,
  deleteSessionAdmin,
  getAdminStats
} from '../api/admin';
import '../CSS/Admin.css';

function Toast({ msg, type = 'info', onClose }) {
  if (!msg) return null;
  return (
    <div className={`admin-toast ${type === 'error' ? 'error' : type === 'success' ? 'success' : ''}`}>
      <div style={{ flex: 1 }}>{msg}</div>
      <button className="btn" onClick={onClose}>✕</button>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  const [sessions, setSessions] = useState([]);
  const [sessionsRaw, setSessionsRaw] = useState(null);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [searchUser, setSearchUser] = useState('');
  const [searchTitle, setSearchTitle] = useState('');

  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [toast, setToast] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // messagesCollapsed controls the messages panel visibility only
  const [messagesCollapsed, setMessagesCollapsed] = useState(true);

  useEffect(() => {
    loadStats();
    loadSessions(0);

    // Auto-refresh stats every 5s
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadStats() {
    try {
      const s = await getAdminStats();
      setStats(s);
    } catch (e) {
      setToast({ text: `Stats failed: ${e.response?.data || e.message}`, type: 'error' });
    }
  }

  async function loadSessions(p = 0) {
    setLoadingSessions(true);
    setToast(null);
    try {
      const { raw, items } = await listAllSessions(p, pageSize);
      setSessions(items || []);
      setSessionsRaw(raw || null);
      const backendPage = raw?.pageable?.pageNumber;
      setPage(Number.isFinite(backendPage) ? backendPage : p);
    } catch (e) {
      setToast({ text: e.response?.data || e.message || 'Failed to load sessions', type: 'error' });
      setSessions([]);
      setSessionsRaw(null);
    } finally {
      setLoadingSessions(false);
    }
  }

  async function loadSessionsForUser(email, p = 0) {
    setLoadingSessions(true);
    setToast(null);
    try {
      const { raw, items } = await listSessionsByUser(email, p, pageSize);
      setSessions(items || []);
      setSessionsRaw(raw || null);
      const backendPage = raw?.pageable?.pageNumber;
      setPage(Number.isFinite(backendPage) ? backendPage : p);
    } catch (e) {
      setToast({ text: e.response?.data || e.message || 'Failed to load sessions for user', type: 'error' });
      setSessions([]);
      setSessionsRaw(null);
    } finally {
      setLoadingSessions(false);
    }
  }

  async function loadMessages(sessionId, p = 0) {
    if (!sessionId) return;
    setLoadingMessages(true);
    setMessages([]);
    setSelectedSessionId(sessionId);
    try {
      const { items } = await listSessionMessages(sessionId, p, 200);
      setMessages(items || []);
      setMessagesCollapsed(false); // open messages panel when loaded
    } catch (e) {
      setToast({ text: e.response?.data || e.message || 'Failed to load messages', type: 'error' });
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }

  function openDelete(sessionId) {
    setDeleteTarget(sessionId);
    setDeleteOpen(true);
  }

  async function confirmDelete() {
    const sid = deleteTarget;
    setDeleteOpen(false);
    setDeleteTarget(null);
    if (!sid) return;
    try {
      await deleteSessionAdmin(sid);
      setToast({ text: 'Deleted session', type: 'success' });
      if (searchUser) {
        await loadSessionsForUser(searchUser, page);
      } else {
        await loadSessions(page);
      }
      if (String(selectedSessionId) === String(sid)) {
        setSelectedSessionId(null);
        setMessages([]);
        setMessagesCollapsed(true);
      }
    } catch (e) {
      setToast({ text: e.response?.data || e.message || 'Delete failed', type: 'error' });
    }
  }

  async function onSearch() {
    if (searchUser) {
      await loadSessionsForUser(searchUser, 0);
    } else if (searchTitle) {
      const pool = sessionsRaw?.content || sessions;
      const filtered = (pool || []).filter(s => (s.title || '').toLowerCase().includes(searchTitle.toLowerCase()));
      setSessions(filtered);
      setSessionsRaw(null);
      setPage(0);
    } else {
      await loadSessions(0);
    }
  }

  const totalElements = sessionsRaw?.totalElements ?? null;
  const totalPages = sessionsRaw?.totalPages ?? null;

  
  // header/footer heights (approx) used to compute inner panel heights
  const headerHeight = 72;
  const footerHeight = 30;
  const availableHeight = `calc(100vh - ${headerHeight + footerHeight + 180}px)`; // +32 for page paddings

  return (
    <div className="admin-root" style={{ paddingTop: headerHeight, paddingBottom: footerHeight, minHeight: `calc(100vh - ${footerHeight}px)` }}>
      <div className="admin-inner">
        <h1 className="admin-title">Admin Dashboard</h1>

        <div className="admin-top-row">
          <div className="admin-stats" aria-hidden>
            <div className="stat-item">
              <div className="stat-value">{stats?.totalSessions ?? '—'}</div>
              <div className="stat-sub">sessions</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats?.totalMessages ?? '—'}</div>
              <div className="stat-sub">messages</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats?.activeUsers ?? '—'}</div>
              <div className="stat-sub">active users</div>
            </div>
          </div>

          <div className="admin-controls">
            <input
              placeholder="Filter by user email"
              value={searchUser}
              onChange={e => setSearchUser(e.target.value)}
              className="input"
            />
            <input
              placeholder="Filter by title (client-side)"
              value={searchTitle}
              onChange={e => setSearchTitle(e.target.value)}
              className="input"
            />
            <button onClick={onSearch} className="btn btn--primary">Search</button>
            <button onClick={() => { setSearchUser(''); setSearchTitle(''); loadSessions(0); }} className="btn">Reset</button>
            <button onClick={() => loadSessions(0)} className="btn">Reload</button>
          </div>
        </div>

        {toast && <Toast msg={toast?.text} type={toast?.type} onClose={() => setToast(null)} />}

        <div className="admin-columns" style={{ marginTop: 6 }}>
          <div className="panel panel--sessions" style={{ height: availableHeight }}>
            <div className="panel-header">
              <div>
                <div className="panel-title">Sessions</div>
                <div className="panel-sub">{totalElements !== null ? `${totalElements} total` : ''}</div>
              </div>
            </div>

            <div className="panel-body">
              {loadingSessions ? (
                <div className="panel-empty">Loading sessions…</div>
              ) : sessions.length === 0 ? (
                <div className="panel-empty">{searchUser || searchTitle ? 'No results' : 'No sessions found.'}</div>
              ) : sessions.map(s => (
                <div className="session-row" key={s.id}>
                  <div className="session-meta">
                    <div className="session-title">{s.title || '(untitled)'}</div>
                    <div className="session-sub">{s.userEmail} {s.createdAt ? `• ${new Date(s.createdAt).toLocaleString()}` : ''}</div>
                  </div>

                  <div className="session-actions">
                    <button className="btn" onClick={() => loadMessages(s.id)}>Messages</button>
                    <button className="btn btn--danger" onClick={() => openDelete(s.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="panel-footer">
              <div className="pagination">
                <button className="btn" onClick={() => { const prev = Math.max(0, page - 1); setPage(prev); if (searchUser) loadSessionsForUser(searchUser, prev); else loadSessions(prev); }} disabled={page <= 0}>Prev</button>
                <button className="btn" onClick={() => { const next = page + 1; setPage(next); if (searchUser) loadSessionsForUser(searchUser, next); else loadSessions(next); }}>Next</button>
                <div style={{ marginLeft: 'auto', color: 'var(--muted-2)' }}>Page: {page} {totalPages ? ` / ${totalPages}` : ''}</div>
              </div>
            </div>
          </div>

          <div className="panel panel--messages" style={{ height: availableHeight }}>
            <div className="panel-header">
              <div>
                <div className="panel-title">Messages</div>
              </div>
              <div>
                <button className="btn" onClick={() => setMessagesCollapsed(v => !v)}>{messagesCollapsed ? 'Open' : 'Close'}</button>
              </div>
            </div>

            <div className="panel-body">
              {messagesCollapsed ? (
                <div className="panel-empty">Messages panel is collapsed. Click "messages" to view Chats.</div>
              ) : loadingMessages ? (
                <div className="panel-empty">Loading messages…</div>
              ) : messages.length === 0 ? (
                <div className="panel-empty">No messages. Select a session and click "messages".</div>
              ) : (
                <div className="messages-list">
                  {messages.map((m, i) => {
                    const isUser = m.role === 'user';
                    return (
                      <div className={`message-row ${isUser ? 'message-row--user' : 'message-row--assistant'}`} key={i}>
                        <div className="message-bubble">{m.content}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Delete conversation</div>
            <div style={{ marginBottom: 12 }}>This action cannot be undone. Are you sure?</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn" onClick={() => setDeleteOpen(false)}>Cancel</button>
              <button className="btn btn--danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
