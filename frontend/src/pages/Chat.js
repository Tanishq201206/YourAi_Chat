// src/pages/Chat.js
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { getHistory, sendMessageStream, renameAuto } from "../api/chat";
import { useAuth } from "../auth/AuthContext";
import "../CSS/Chat.css";

/* Minimal typing dots */
function TypingDots({ active }) {
  const [dots, setDots] = useState("");
  useEffect(() => {
    if (!active) return setDots("");
    let i = 0;
    const iv = setInterval(() => {
      i = (i + 1) % 4;
      setDots(".".repeat(i));
    }, 350);
    return () => clearInterval(iv);
  }, [active]);
  return <span>{active ? ` ${dots}` : ""}</span>;
}

export default function Chat() {
  const { id } = useParams();
  const { authenticated, loading } = useAuth();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [msg, setMsg] = useState("");
  const [streaming, setStreaming] = useState(false);

  const scrollerRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  // auto-scroll toggle: true when user is at (or near) bottom
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  const scrollToBottom = (smooth = false) => {
    const el = scrollerRef.current;
    if (!el) return;
    if (smooth) {
      try {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      } catch {
        el.scrollTop = el.scrollHeight;
      }
    } else {
      el.scrollTop = el.scrollHeight;
    }
  };

  const isAtBottom = (threshold = 80) => {
    const el = scrollerRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  };

  const loadHistory = useCallback(
    async () => {
      try {
        const data = await getHistory(id);
        const list = Array.isArray(data) ? data : [];
        setMessages(list);
        // scroll if allowed
        setTimeout(() => {
          if (autoScrollEnabled) scrollToBottom(false);
        }, 0);
      } catch (e) {
        setMsg(e?.response?.data || e?.message || "Failed to load history");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, autoScrollEnabled]
  );

  useEffect(() => {
    if (authenticated) loadHistory();
    inputRef.current?.focus();
    // keep previous autoScrollEnabled; do not forcibly enable on session open
  }, [authenticated, loadHistory, id]);

  useEffect(() => {
    if (autoScrollEnabled) scrollToBottom();
  }, [messages, autoScrollEnabled]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const threshold = 80; // px
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
      setAutoScrollEnabled(atBottom);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  if (loading) return <div className="chat-loading">Loading...</div>;
  if (!authenticated) return <div className="chat-loading">Please login.</div>;

  const stopStreaming = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
      setStreaming(false);
    }
  };

  const onSend = async (e) => {
    e?.preventDefault?.();
    const text = input.trim();
    if (!text || streaming) return;

    // determine if user is currently at bottom; preserve that preference
    const wasAtBottom = isAtBottom();
    setAutoScrollEnabled(wasAtBottom);

    // optimistic messages (no role labels shown)
    const userMsg = { role: "user", content: text };
    const assistantMsg = { role: "assistant", content: "" };

    setMessages((m) => [...m, userMsg, assistantMsg]);
    setInput("");
    setMsg("");
    setStreaming(true);
    if (wasAtBottom) {
      // only scroll if user was at bottom
      setTimeout(() => scrollToBottom(true), 0);
    }
    inputRef.current?.focus();

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await sendMessageStream(
        id,
        { message: text },
        (evt) => {
          if (evt.type === "token") {
            const token = evt.content || "";
            setMessages((m) => {
              const copy = m.slice();
              copy[copy.length - 1] = {
                ...copy[copy.length - 1],
                content: (copy[copy.length - 1].content || "") + token,
              };
              return copy;
            });
            if (autoScrollEnabled) scrollToBottom(true);
          } else if (evt.type === "end") {
            setStreaming(false);
            abortRef.current = null;
            // canonicalize: reload history then attempt server auto-rename,
            // then notify sidebar to refresh sessions list (always)
            setTimeout(async () => {
              await loadHistory();
              try {
                await renameAuto(id);
              } catch (err) {
                // ignore
              } finally {
                window.dispatchEvent(new Event("sessions:refresh"));
              }
            }, 0);
          } else if (evt.type === "error") {
            setMsg(evt.content || "Stream error");
            setStreaming(false);
            abortRef.current = null;
          }
        },
        controller.signal
      );
    } catch (err) {
      if (controller.signal.aborted) setMsg("Stopped.");
      else setMsg(err?.message || "Stream failed");
      setStreaming(false);
      abortRef.current = null;
    }
  };

  // Enter to send (Shift+Enter newline), Escape to stop
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !streaming) {
      e.preventDefault();
      onSend();
    } else if (e.key === "Escape") {
      if (streaming) stopStreaming();
    }
  };

  const showPlaceholder = messages.length === 0;

  return (
    <div className="chat-root">
      {/* controls row */}
      <div className="chat-controls">
        <div className="chat-controls-left">
          <button className="btn" onClick={loadHistory} title="Reload">Reload</button>
          {streaming ? (
            <button className="btn" onClick={stopStreaming} title="Stop">Stop</button>
          ) : null}
          <button className="btn" onClick={() => { setAutoScrollEnabled(true); scrollToBottom(true); }} title="Scroll to bottom">Scroll to bottom</button>
        </div>
        <div className="chat-controls-right">
          <div className={`auto-scroll-indicator ${autoScrollEnabled ? "on" : "off"}`}>
            {/* {autoScrollEnabled ? "Auto-scroll: on" : "Auto-scroll: off"} */}
          </div>
        </div>
      </div>

      {/* messages area */}
      <div ref={scrollerRef} className="chat-messages" role="log" aria-live="polite">
        {showPlaceholder ? (
          <div className="chat-placeholder">
            <div className="placeholder-title">Ask me anything…</div>
            <div className="placeholder-sub">Start the conversation by typing below.</div>
          </div>
        ) : (
          messages.map((m, idx) => {
            const isUser = m.role === "user";
            return (
              <div className={`chat-row ${isUser ? "user" : "assistant"}`} key={idx}>
                <div className="chat-bubble">{m.content}</div>
              </div>
            );
          })
        )}

        {streaming && !showPlaceholder && (
          <div className="chat-row assistant typing">
            <em className="typing-text">Assistant is typing<TypingDots active={streaming} /></em>
          </div>
        )}
      </div>

      {/* input bar (fixed at bottom of chat area) */}
      {/* input bar (curved pill) */}
<form className="chat-inputbar" onSubmit={onSend}>
  <div className="chat-input-wrapper" role="group" aria-label="Send message">
    <textarea
      ref={inputRef}
      rows={2}
      className="chat-textarea"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder="Send a message. Press Enter to send, Shift+Enter for a newline."
      disabled={streaming}
      aria-label="Message"
    />

    <button
      type="submit"
      className="btn-send"
      disabled={streaming || !input.trim()}
      aria-label="Send message"
      title={streaming ? "Sending…" : "Send"}
    >
      ➤
    </button>
  </div>
</form>


      {msg && <pre className="chat-msgbox">{typeof msg === "string" ? msg : JSON.stringify(msg, null, 2)}</pre>}
    </div>
  );
}
