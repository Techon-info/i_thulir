import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const O = '#f97316';
const OD = '#ea580c';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'cashier' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Fill all fields!'); return; }
    if (form.password !== form.confirm) { toast.error('Passwords do not match!'); return; }
    if (form.password.length < 6) { toast.error('Password must be 6+ characters!'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    register(form.name, form.email, form.role);
    setLoading(false);
    toast.success(`Account created! Welcome, ${form.name}`);
    navigate(form.role === 'admin' ? '/dashboard' : '/billing');
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
      boxShadow: '0 20px 60px rgba(249,115,22,0.15)', overflow: 'hidden',
    },
    cardTop: {
      background: `linear-gradient(135deg, ${O}, ${OD})`,
      padding: '26px 32px 22px', textAlign: 'center',
    },
    logoBox: {
      width: '52px', height: '52px', borderRadius: '14px',
      background: 'rgba(255,255,255,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 auto 12px', fontSize: '20px', fontWeight: '900', color: '#fff',
      border: '2px solid rgba(255,255,255,0.3)',
    },
    appName: { color: '#fff', fontSize: '20px', fontWeight: '900', marginBottom: '2px' },
    appSub:  { color: 'rgba(255,255,255,0.75)', fontSize: '12px' },
    body:    { padding: '24px 32px 28px' },
    label:   { display: 'block', fontSize: '13px', fontWeight: '700', color: '#374151', marginBottom: '6px' },
    inputWrap: { position: 'relative', marginBottom: '14px' },
    input: {
      width: '100%', padding: '11px 16px', fontSize: '14px',
      border: '1.5px solid #e5e7eb', borderRadius: '12px',
      outline: 'none', boxSizing: 'border-box', background: '#fafafa',
      transition: 'border 0.2s, box-shadow 0.2s', color: '#1a1a2e',
    },
    select: {
      width: '100%', padding: '11px 16px', fontSize: '14px',
      border: '1.5px solid #e5e7eb', borderRadius: '12px',
      outline: 'none', boxSizing: 'border-box', background: '#fafafa',
      cursor: 'pointer', marginBottom: '18px', color: '#1a1a2e',
    },
    submitBtn: {
      width: '100%', padding: '13px', fontSize: '15px', fontWeight: '800',
      border: 'none', borderRadius: '12px', cursor: 'pointer',
      background: loading ? '#fdba74' : `linear-gradient(135deg, ${O}, ${OD})`,
      color: '#fff', boxShadow: loading ? 'none' : `0 6px 20px rgba(249,115,22,0.4)`,
    },
    footer: { textAlign: 'center', marginTop: '18px', fontSize: '14px', color: '#6b7280' },
    eyeBtn: {
      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
      background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px',
    },
  };

  const focusStyle = { borderColor: O, boxShadow: `0 0 0 3px rgba(249,115,22,0.12)`, background: '#fff' };
  const blurStyle  = { borderColor: '#e5e7eb', boxShadow: 'none', background: '#fafafa' };

  const Field = ({ label, type, placeholder, key_, icon }) => (
    <div>
      <label style={s.label}>{label}</label>
      <div style={s.inputWrap}>
        <input
          type={key_ === 'password' || key_ === 'confirm' ? (showPw ? 'text' : 'password') : type}
          style={{ ...s.input, paddingRight: icon ? '44px' : '16px' }}
          placeholder={placeholder}
          value={form[key_]}
          onChange={e => setForm(p => ({ ...p, [key_]: e.target.value }))}
          onFocus={e => Object.assign(e.target.style, focusStyle)}
          onBlur={e  => Object.assign(e.target.style, blurStyle)}
        />
        {icon && (
          <button type="button" style={s.eyeBtn} onClick={() => setShowPw(p => !p)}>
            {showPw ? '🙈' : '👁️'}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.cardTop}>
          <div style={s.logoBox}>IT</div>
          <div style={s.appName}>Create Account</div>
          <div style={s.appSub}>I Thulir POS · I துளிர் உணவகம்</div>
        </div>

        <div style={s.body}>
          <form onSubmit={handleRegister}>
            <Field label="Full Name"         type="text"     placeholder="Your full name"    key_="name" />
            <Field label="Email Address"     type="email"    placeholder="your@email.com"    key_="email" />
            <Field label="Password"          type="password" placeholder="Min 6 characters"  key_="password" icon />
            <Field label="Confirm Password"  type="password" placeholder="Re-enter password" key_="confirm" icon />

            <label style={s.label}>Role</label>
            <select style={s.select} value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
              <option value="cashier">Cashier — பில் ஊழியர்</option>
              <option value="admin">Admin — நிர்வாகி</option>
            </select>

            <button type="submit" style={s.submitBtn} disabled={loading}>
              {loading ? '⏳ Creating...' : '✓ Create Account'}
            </button>
          </form>

          <div style={s.footer}>
            Already have an account?{' '}
            <Link to="/" style={{ color: O, fontWeight: '700', textDecoration: 'none' }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
