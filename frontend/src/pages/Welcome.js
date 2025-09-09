// src/pages/Welcome.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSession } from "../api/chat";
import { useAuth } from "../auth/AuthContext";
import "../CSS/Welcome.css";

export default function Welcome() {
  const { username } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const startNewChat = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await createSession("New Chat");
      const newId = (res && (res.id || res.sessionId || res._id)) || null;
      window.dispatchEvent(new Event("sessions:refresh"));
      if (newId) navigate(`/app/${newId}`);
      else setErr("Server did not return a session id.");
    } catch (e) {
      setErr(e?.response?.data || e?.message || "Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="welcome-root">
      <div className="welcome-inner">
        <header className="welcome-header">
          <h1 className="welcome-title">
            Good to see you{username ? `, ${username}` : ""}.
          </h1>
          <p className="welcome-sub">
            Start a conversation — ask anything or experiment with prompts.
          </p>
        </header>

        <section className="welcome-card">
          <button
            className="welcome-circle-btn"
            onClick={startNewChat}
            aria-label="Start a new chat"
            disabled={loading}
          >
            ＋
          </button>

          <div className="welcome-body">
            <div className="welcome-body-title">Ask anything</div>
            <div className="welcome-body-sub">
              Click the plus to start a new chat.
            </div>
          </div>

          <div className="welcome-actions">
            <button
              className="welcome-start-btn"
              onClick={startNewChat}
              disabled={loading}
            >
              {loading ? "Starting…" : "Start a new chat"}
            </button>
          </div>
        </section>

        {err && <div className="welcome-error">{err}</div>}
      </div>
    </div>
  );
}
