import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const O  = '#f97316';
const OD = '#ea580c';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '', role: 'cashier' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Fill all fields!'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800)); // simulate delay
    const result = login(form.email, form.password, form.role);
    setLoading(false);
    if (result.success) {
      toast.success(`Welcome! Logged in as ${form.role}`);
      navigate(form.role === 'admin' ? '/dashboard' : '/billing');
    } else {
      toast.error('Invalid credentials!');
    }
  };

  const s = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 40%, #fed7aa 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter','Segoe UI',sans-serif", padding: '20px',
    },
    card: {
      background: '#fff', borderRadius: '24px', width: '420px', maxWidth: '100%',
      boxShadow: '0 20px 60px rgba(249,115,22,0.15)',
      overflow: 'hidden',
    },
    cardTop: {
      background: `linear-gradient(135deg, ${O}, ${OD})`,
      padding: '32px 32px 28px', textAlign: 'center',
    },
    logoBox: {
      width: '64px', height: '64px', borderRadius: '18px',
      background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 auto 16px', fontSize: '24px', fontWeight: '900', color: '#fff',
      border: '2px solid rgba(255,255,255,0.3)',
    },
    appName: { color: '#fff', fontSize: '22px', fontWeight: '900', marginBottom: '4px' },
    appSub:  { color: 'rgba(255,255,255,0.75)', fontSize: '13px' },
    body:    { padding: '28px 32px 32px' },
    hintBox: {
      background: '#fff7ed', borderRadius: '12px', padding: '12px 16px',
      marginBottom: '22px', border: '1px solid #fed7aa', fontSize: '13px',
    },
    hintRow: { marginBottom: '4px', color: '#92400e' },
    label: {
      display: 'block', fontSize: '13px', fontWeight: '700',
      color: '#374151', marginBottom: '6px',
    },
    inputWrap: { position: 'relative', marginBottom: '16px' },
    input: {
      width: '100%', padding: '12px 16px', fontSize: '14px',
      border: '1.5px solid #e5e7eb', borderRadius: '12px',
      outline: 'none', boxSizing: 'border-box', background: '#fafafa',
      transition: 'border 0.2s, box-shadow 0.2s', color: '#1a1a2e',
    },
    eyeBtn: {
      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
      background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px',
    },
    select: {
      width: '100%', padding: '12px 16px', fontSize: '14px',
      border: '1.5px solid #e5e7eb', borderRadius: '12px',
      outline: 'none', boxSizing: 'border-box', background: '#fafafa',
      cursor: 'pointer', marginBottom: '22px', color: '#1a1a2e',
      appearance: 'none',
    },
    submitBtn: {
      width: '100%', padding: '14px', fontSize: '16px', fontWeight: '800',
      border: 'none', borderRadius: '12px', cursor: 'pointer',
      background: loading ? '#fdba74' : `linear-gradient(135deg, ${O}, ${OD})`,
      color: '#fff', boxShadow: loading ? 'none' : `0 6px 20px rgba(249,115,22,0.4)`,
      transition: 'all 0.2s', letterSpacing: '0.3px',
    },
    footer: {
      textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6b7280',
    },
  };

  const focusStyle = { borderColor: O, boxShadow: `0 0 0 3px rgba(249,115,22,0.12)`, background: '#fff' };
  const blurStyle  = { borderColor: '#e5e7eb', boxShadow: 'none', background: '#fafafa' };

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Top gradient header */}
        <div style={s.cardTop}>
          <div style={s.logoBox}>IT</div>
          <div style={s.appName}>Techon POS</div>
          {/* <div style={s.appSub}>I துளிர் உணவகம் · Tharamangalam</div> */}
        </div>

        <div style={s.body}>
          {/* Demo credentials hint */}
          <div style={s.hintBox}>
            <div style={s.hintRow}><strong>Admin:</strong> admin@techon.com · any password</div>
            <div style={{ ...s.hintRow, marginBottom: 0 }}><strong>Cashier:</strong> cashier@techon.com · any password</div>
          </div>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <label style={s.label}>Email Address</label>
            <div style={s.inputWrap}>
              <input
                type="email"
                style={s.input}
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                onFocus={e => Object.assign(e.target.style, focusStyle)}
                onBlur={e  => Object.assign(e.target.style, blurStyle)}
              />
            </div>

            {/* Password */}
            <label style={s.label}>Password</label>
            <div style={{ ...s.inputWrap }}>
              <input
                type={showPw ? 'text' : 'password'}
                style={{ ...s.input, paddingRight: '44px' }}
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                onFocus={e => Object.assign(e.target.style, focusStyle)}
                onBlur={e  => Object.assign(e.target.style, blurStyle)}
              />
              <button type="button" style={s.eyeBtn} onClick={() => setShowPw(p => !p)}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Role */}
            <label style={s.label}>Role</label>
            <div style={{ position: 'relative' }}>
              <select
                style={s.select}
                value={form.role}
                onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
              >
                <option value="cashier">Cashier — பில் ஊழியர்</option>
                <option value="admin">Admin — நிர்வாகி</option>
              </select>
              <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', marginTop: '-8px', color: '#aaa' }}>▼</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={s.submitBtn}
              disabled={loading}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
            >
              {loading ? '⏳ Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div style={s.footer}>
            New user?{' '}
            <Link to="/register" style={{ color: O, fontWeight: '700', textDecoration: 'none' }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
