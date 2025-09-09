// src/pages/Register.js
import React, { useState } from 'react';
import { registerUser, verifyRegister } from '../api/auth';
import '../CSS/Register.css';

export default function Register() {
  const [phase, setPhase] = useState('form'); // 'form' | 'otp'
  const [form, setForm] = useState({ email: '', password: '' });
  const [emailForOtp, setEmailForOtp] = useState('');
  const [otp, setOtp] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onRegister = async (e) => {
    e.preventDefault();
    if (loading) return;
    setMsg('');
    setLoading(true);
    try {
      const res = await registerUser(form);
      setMsg(typeof res === 'string' ? res : JSON.stringify(res));
      setEmailForOtp(form.email);
      setPhase('otp');
    } catch (err) {
      setMsg(err?.response?.data || err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async (e) => {
    e.preventDefault();
    if (loading) return;
    setMsg('');
    setLoading(true);
    try {
      const res = await verifyRegister({ email: emailForOtp, otp });
      setMsg(typeof res === 'string' ? res : JSON.stringify(res));
      // optionally switch back or redirect on success depending on backend response
    } catch (err) {
      setMsg(err?.response?.data || err?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-root" aria-busy={loading}>
      <div className="register-card" role="form" aria-labelledby="register-heading">
        <h2 id="register-heading">Register</h2>

        {phase === 'form' && (
          <form onSubmit={onRegister}>
            <div>
              <input
                className="register-input"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={onChange}
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div>
              <input
                className="register-input"
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={onChange}
                required
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            <div style={{ marginTop: 8 }}>
              <button
                className="register-btn register-btn-primary"
                type="submit"
                disabled={loading}
                aria-disabled={loading}
              >
                {loading ? 'Registering…' : 'Register'}
              </button>
            </div>
          </form>
        )}

        {phase === 'otp' && (
          <form onSubmit={onVerify}>
            <div style={{ marginBottom: 8, color: '#bfbfbf' }}>Email: {emailForOtp}</div>

            <div style={{ marginBottom: 8 }}>
              <input
                className="register-input otp-input"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <button
                className="register-btn register-btn-primary"
                type="submit"
                disabled={loading}
                aria-disabled={loading}
              >
                {loading ? 'Verifying…' : 'Verify Registration'}
              </button>
            </div>
          </form>
        )}

        {msg && (
          <pre className="register-msg" role="status">
            {typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
