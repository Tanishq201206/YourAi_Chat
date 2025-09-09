// src/layout/SidebarLayout.js
import React, { useEffect, useRef, useState } from 'react';
import { Outlet, Link, useNavigate, useParams } from 'react-router-dom';
import { listSessions, createSession, renameSession, deleteSession } from '../api/chat';
import { useAuth } from '../auth/AuthContext';
import '../CSS/Sidebar.css';
import GlobeIcon from "../icons/GlobeIcon";
import ChatIcon from "../icons/ChatIcon";
import HelpIcon from "../icons/HelpIcon";
import InfoIcon from "../icons/InfoIcon";
import AdminIcon from "../icons/AdminIcon";
import ProfileIcon from "../icons/ProfileIcon";
import RenameIcon from "../icons/RenameIcon";
import DeleteIcon from "../icons/DeleteIcon";

export default function SidebarLayout() {
  const { loading: authLoading, authenticated, logout, username, roles } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [msg, setMsg] = useState('');
  const [sessionMenuFor, setSessionMenuFor] = useState(null); // session id for kebab menu
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const nav = useNavigate();
  const { id } = useParams();

  const asideRef = useRef(null);
  const sessionRowRefs = useRef({}); // map sessionId -> DOM node
  const lastOverflow = useRef(null);

  // popover position: { top, left } in viewport coords
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });

  // Rename modal state
  const [renameState, setRenameState] = useState({ open: false, id: null, value: '' });
  // Delete confirm state
  const [deleteState, setDeleteState] = useState({ open: false, id: null });

  const isAnyPopoverOpen = !!sessionMenuFor || renameState.open || deleteState.open;

  const isDev = Array.isArray(roles) && (
    roles.includes('DEV') ||
    roles.includes('ROLE_DEV') ||
    roles.includes('dev') ||
    roles.includes('role_dev')
  );

  const load = async () => {
    setMsg('');
    setSessionsLoading(true);
    try {
      const data = await listSessions();
      setSessions(Array.isArray(data) ? data : []);
    } catch (e) {
      setMsg(e?.response?.data || e?.message || 'Failed to load sessions');
    } finally {
      setSessionsLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) load();
  }, [authenticated]);

  useEffect(() => {
    const handler = () => load();
    window.addEventListener('sessions:refresh', handler);
    return () => window.removeEventListener('sessions:refresh', handler);
  }, []);

  useEffect(() => {
    setSessionMenuFor(null);
  }, [id]);

  // when any popover (kebab / rename / delete) changes, toggle aside scroll and compute popover position for kebab
  useEffect(() => {
    if (!asideRef.current) return;

    if (sessionMenuFor) {
      // disable sidebar scroll while kebab popover open
      lastOverflow.current = asideRef.current.style.overflowY;
      asideRef.current.style.overflow = 'hidden';

      const rowNode = sessionRowRefs.current[String(sessionMenuFor)];
      if (rowNode && rowNode.getBoundingClientRect) {
        const r = rowNode.getBoundingClientRect();
        const left = r.right + 8;
        const top = Math.max(8, r.top);
        setPopoverPos({ top, left });
      } else {
        const rect = asideRef.current.getBoundingClientRect();
        setPopoverPos({ top: rect.top + 48, left: rect.right + 8 });
      }
    } else {
      // restore overflow if no other popover is open (rename/delete may also open)
      if (!renameState.open && !deleteState.open) {
        asideRef.current.style.overflow = lastOverflow.current || 'auto';
      }
      setPopoverPos({ top: 0, left: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionMenuFor]);

  // if rename/delete open, also hide sidebar scrolling
  useEffect(() => {
    if (!asideRef.current) return;
    if (renameState.open || deleteState.open) {
      lastOverflow.current = asideRef.current.style.overflowY;
      asideRef.current.style.overflow = 'hidden';
    } else {
      // only restore if kebab isn't open (kebab effect handled above)
      if (!sessionMenuFor) asideRef.current.style.overflow = lastOverflow.current || 'auto';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renameState.open, deleteState.open]);

  // click outside to close kebab popover (and also rename/delete when clicking outside them)
  useEffect(() => {
    function onDocDown(e) {
      if (!isAnyPopoverOpen) return;
      const el = e.target;
      const pop = document.querySelector('[data-session-popover]');
      const renamePop = document.querySelector('[data-rename-popover]');
      const delPop = document.querySelector('[data-delete-popover]');

      // if click inside any popover, keep open
      if ((pop && pop.contains(el)) || (renamePop && renamePop.contains(el)) || (delPop && delPop.contains(el))) {
        return;
      }

      // otherwise close all popovers
      setSessionMenuFor(null);
      setRenameState({ open: false, id: null, value: '' });
      setDeleteState({ open: false, id: null });
    }
    document.addEventListener('mousedown', onDocDown);
    return () => document.removeEventListener('mousedown', onDocDown);
  }, [isAnyPopoverOpen]);

  if (authLoading) return <div className="loading-placeholder">Loading...</div>;
  if (!authenticated) return <div className="loading-placeholder">Please login.</div>;

  const startNewChat = async () => {
    setMsg('');
    try {
      const res = await createSession('New Chat');
      const newId = (res && (res.id || res.sessionId || res._id)) || null;
      await load();
      // ensure other UI parts listening for sessions refresh update
      window.dispatchEvent(new Event('sessions:refresh'));
      if (newId) nav(`/app/${newId}`);
    } catch (e) {
      setMsg(e?.response?.data || e?.message || 'Failed to start new chat');
    }
  };

  // keep helpers and use them from popover to avoid duplication
  const doRename = async (sid, newTitle) => {
    const title = newTitle ?? prompt('New title?');
    if (typeof title === 'undefined' || title === null) return;
    try {
      await renameSession(sid, title);
      await load();
      window.dispatchEvent(new Event('sessions:refresh'));
    } catch (e) {
      setMsg(e?.response?.data || e?.message || 'Failed to rename');
    }
  };

  const doDelete = async (sid) => {
    // use custom UI confirm popover (we open it elsewhere) - but if this is called directly, fallback to confirm
    try {
      await deleteSession(sid);
      await load();
      window.dispatchEvent(new Event('sessions:refresh'));
      if (String(sid) === String(id)) nav('/app');
    } catch (e) {
      setMsg(e?.response?.data || e?.message || 'Failed to delete');
    }
  };

  
  // layout sizes (used by inline width only for transition – visual handled by CSS)
  const expandedWidth = 280;
  const collapsedWidth = 48;
  const sidebarWidth = collapsed ? collapsedWidth : expandedWidth;

  const showText = !collapsed;
 

  // session icon click will expand only when collapsed
  const onSessionIconClick = () => {
    if (collapsed) setCollapsed(false);
  };

  // helper to register session row DOM nodes (used for popover positioning)
  const bindSessionRef = (sid) => (el) => {
    if (el) sessionRowRefs.current[String(sid)] = el;
    else delete sessionRowRefs.current[String(sid)];
  };

  // directional easing: expand = ease-out, collapse = ease-in
  const transitionStyle = collapsed
    ? 'width 170ms cubic-bezier(0.4, 0.0, 0.2, 1)'
    : 'width 260ms cubic-bezier(0.16, 1, 0.3, 1)';

  // open rename UI for session
  const openRenameUI = (sid, currentTitle = '') => {
    setSessionMenuFor(null);
    setRenameState({ open: true, id: sid, value: currentTitle || '' });
  };

  // open delete confirmation UI for session
  const openDeleteUI = (sid) => {
    setSessionMenuFor(null);
    setDeleteState({ open: true, id: sid });
  };

  // --- clamp popovers to viewport to prevent overflow (especially the rename input) ---
  const clampPopover = (anchorTop, anchorLeft, popWidth = 320, popHeight = 160, margin = 8) => {
    const winW = window.innerWidth || 1024;
    const winH = window.innerHeight || 768;
    let left = anchorLeft;
    let top = anchorTop;
    if (left + popWidth + margin > winW) left = Math.max(margin, winW - popWidth - margin);
    if (top + popHeight + margin > winH) top = Math.max(margin, winH - popHeight - margin);
    if (left < margin) left = margin;
    if (top < margin) top = margin;
    return { top, left };
  };

  return (
    <div className="sidebar-root" style={{ height: '100vh' }}>
      {/* Header */}
      <header className="sidebar-header">
        <div className="header-left">
          <button
            className="icon-btn"
            aria-label="Toggle sidebar"
            onClick={() => setCollapsed(c => !c)}
            title="Toggle sidebar"
          >
            ☰
          </button>

          <strong className="brand">YourAI Chat</strong>

          {isDev && (
            <button className="icon-btn" onClick={() => nav('/app/admin')} title="Admin dashboard">
              <AdminIcon className="icon" />
              {showText ? <span className="admin-text">Admin</span> : null}
            </button>
          )}
        </div>

        {/* Profile menu */}
        <div className="profile-wrap">
          <button className="profile-btn" onClick={() => setProfileMenuOpen(v => !v)}>
              <ProfileIcon className="icon" />
            {showText ? (username || 'Account') : null}
          </button>

          {profileMenuOpen && (
            <div className="profile-menu" role="menu">
              <div className="profile-name"><strong>{username || 'User'}</strong></div>
           
              <button className="profile-menu-btn" onClick={() => { setProfileMenuOpen(false); nav('/account'); }}>Profile</button>
              <button className="profile-menu-btn" onClick={async () => { setProfileMenuOpen(false); await logout(); nav('/login'); }}>Log out</button>
            </div>
          )}
        </div>
      </header>

      {/* Main: sidebar + chat */}
      <div className="sidebar-main">
        {/* Sidebar */}
        <aside
          ref={asideRef}
          className={`sidebar ${collapsed ? 'collapsed' : 'expanded'}`}
          style={{ width: sidebarWidth, minWidth: sidebarWidth, transition: transitionStyle }}
        >
          {/* Section header */}
          <div className="section-header" onClick={onSessionIconClick}>
             <ChatIcon className="icon" />
            {showText && <h3 className="section-title">Chats</h3>}
          </div>

          {/* Only show session list in expanded mode */}
          {showText && (
            <>
              <button className="new-chat-btn" onClick={startNewChat}>+ New Chat</button>

              {msg && <pre className="sidebar-msg">{msg}</pre>}

              {sessionsLoading ? (
                <div className="sidebar-loading">Loading sessions…</div>
              ) : sessions.length === 0 ? (
                <div className="empty-state">
                  <p>No conversations yet.</p>
                </div>
              ) : (
                <div className="sessions-list">
                  {sessions.map((s) => {
                    const active = String(s.id) === String(id);
                    const isMenuOpen = String(sessionMenuFor) === String(s.id);
                    return (
                      <div className={`session-row ${active ? 'active' : ''}`} key={s.id} ref={bindSessionRef(s.id)}>
                        <div className="session-left">
                          <Link to={`/app/${s.id}`} className="session-link">{s.title || '(untitled)'}</Link>
                        </div>

                        <div className="session-right">
                          <button
                            aria-label="more"
                            title="More"
                            className="kebab-btn"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              setSessionMenuFor(isMenuOpen ? null : s.id);
                            }}
                          >
                            ⋯
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          <hr className="sidebar-sep" />

          {/* Bottom menu (icons are clickable when collapsed) */}
          <div className="bottom-menu">
            <div className="bottom-item" role="button" onClick={() => nav('/explore')}>
              <GlobeIcon className="icon" />
              {showText && <a className="bottom-link" href="#explore">Explore</a>}
            </div>

            <div className="bottom-item" role="button" onClick={() => nav('/help')}>
              <HelpIcon className="icon" />
              {showText && <a className="bottom-link" href="#help">Help</a>}
            </div>

            <div className="bottom-item" role="button" onClick={() => nav('/about')}>
              <InfoIcon className="icon" />
              {showText && <a className="bottom-link" href="#about">About</a>}
            </div>
          </div>

          <div className="sidebar-fill" />
        </aside>

        {/* Chat area */}
        <main className="chat-area">
          <Outlet />
        </main>
      </div>

      {/* Kebab Popover */}
      {sessionMenuFor && (
        <div
          data-session-popover
          className="popover popover--dark"
          style={{ position: 'fixed', top: popoverPos.top, left: popoverPos.left }}
        >
          <div className="popover-row" onClick={() => {
            const cur = sessions.find(s => String(s.id) === String(sessionMenuFor));
            openRenameUI(sessionMenuFor, cur?.title || '');
          }}>
           <RenameIcon className="popover-icon" />
            <span className="popover-text">Rename</span>
          </div>

          <div className="popover-row" onClick={() => openDeleteUI(sessionMenuFor)}>
            <DeleteIcon className="popover-icon" />
            <span className="popover-text popover-text--danger">Delete</span>
          </div>
        </div>
      )}

      {/* Rename Popover */}
      {renameState.open && (() => {
        const clamp = clampPopover(popoverPos.top || 120, popoverPos.left || 220, 320, 150, 8);
        return (
          <div data-rename-popover className="popover popover--dark popover--rename" style={{ position: 'fixed', top: clamp.top, left: clamp.left }}>
            <div className="popover-title">Rename conversation</div>
            <input
              className="popover-input"
              value={renameState.value}
              onChange={(e) => setRenameState(s => ({ ...s, value: e.target.value }))}
              placeholder="Conversation title"
            />
            <div className="popover-actions">
              <button className="popup-btn" onClick={() => setRenameState({ open: false, id: null, value: '' })}>Cancel</button>
              <button className="popup-btn popup-btn--primary" onClick={async () => {
                const sid = renameState.id;
                const title = (renameState.value || '').trim();
                if (!title) { setMsg('Title cannot be empty'); return; }
                setRenameState({ open: false, id: null, value: '' });
                await doRename(sid, title);
              }}>Save</button>
            </div>
          </div>
        );
      })()}

      {/* Delete Confirm Popover */}
      {deleteState.open && (
        <div data-delete-popover className="popover popover--dark popover--delete" style={{ position: 'fixed', top: (popoverPos.top || 120) + 24, left: (popoverPos.left || 220) }}>
          <div className="popover-title">Delete conversation</div>
          <div className="popover-text" style={{ marginBottom: 12, color: 'var(--muted-2)' }}>This action cannot be undone.</div>
          <div className="popover-actions">
            <button className="popup-btn" onClick={() => setDeleteState({ open: false, id: null })}>Cancel</button>
            <button className="popup-btn popup-btn--danger" onClick={async () => {
              const sid = deleteState.id;
              setDeleteState({ open: false, id: null });
              await doDelete(sid);
            }}>Delete</button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="sidebar-footer">
        <small>© 2025 YourAI — All rights reserved</small>
      </footer>
    </div>
  );
}
