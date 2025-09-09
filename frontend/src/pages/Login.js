// src/pages/Login.js
import React, { useState } from 'react';
import '../CSS/Login.css';
import { loginStep1, loginStep2 } from '../api/auth';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const nav = useNavigate();
  const { refresh } = useAuth();

  const [phase, setPhase] = useState('login'); // 'login' | 'otp'
  const [creds, setCreds] = useState({ email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [emailForOtp, setEmailForOtp] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setCreds(c => ({ ...c, [e.target.name]: e.target.value }));

  const doLoginStep1 = async (e) => {
    e.preventDefault();
    if (loading) return; // guard double submit
    setMsg('');
    setLoading(true);
    try {
      const res = await loginStep1(creds);
      setMsg(typeof res === 'string' ? res : JSON.stringify(res));
      setEmailForOtp(creds.email);
      setPhase('otp');
    } catch (err) {
      setMsg(err?.response?.data|| 'Login failed Enter Valid Details');
    } finally {
      setLoading(false);
    }
  };

  const doLoginStep2 = async (e) => {
    e.preventDefault();
    if (loading) return;
    setMsg('');
    setLoading(true);
    try {
      const res = await loginStep2({ email: emailForOtp, otp });
      setMsg(typeof res === 'string' ? res : JSON.stringify(res));
      await refresh();       // pulls /status and updates context
      nav('/');              // go Home
    } catch (err) {
      setMsg(err?.response?.data || err?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root" aria-busy={loading}>
      <div className="login-card" role="form" aria-labelledby="login-heading">
        <h2 id="login-heading">Login</h2>

        {phase === 'login' && (
          <form onSubmit={doLoginStep1}>
            <div className="input-group">
              <input
                className="login-input"
                name="email"
                placeholder="Email"
                value={creds.email}
                onChange={onChange}
                disabled={loading}
                autoComplete="username"
                required
              />
            </div>

            <div className="input-group">
              <input
                className="login-input"
                type="password"
                name="password"
                placeholder="Password"
                value={creds.password}
                onChange={onChange}
                disabled={loading}
                autoComplete="current-password"
                required
              />
            </div>

            <div style={{ marginTop: 8 }}>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
                aria-disabled={loading}
              >
                {loading ? 'Sending…' : 'Send OTP'}
              </button>
            </div>
          </form>
        )}

        {phase === 'otp' && (
          <form onSubmit={doLoginStep2}>
            <div className="login-meta">Email: {emailForOtp}</div>

            <div className="input-group otp-input-wrap">
              <input
                className="login-input otp-input"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div style={{ marginTop: 8 }}>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
                aria-disabled={loading}
              >
                {loading ? 'Verifying…' : 'Verify & Login'}
              </button>
            </div>
          </form>
        )}

        {msg && <pre className="login-msg" role="status">{typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)}</pre>}
      </div>
    </div>
  );
}
