import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const O  = '#f97316';
const OD = '#ea580c';

export default function MainLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const allNav = [
    { path: '/billing',   label: 'Billing POS',      labelTa: 'பில்லிங்',      icon: '🧾', roles: ['admin','cashier'] },
    { path: '/stock',     label: 'Stock Management',  labelTa: 'இருப்பு நிலை',  icon: '📦', roles: ['admin'] },
    { path: '/dashboard', label: 'Admin Dashboard',   labelTa: 'டாஷ்போர்டு',   icon: '📊', roles: ['admin'] },
    // In allNav array, add after dashboard:
{ path: '/staff', label: 'Staff Management', labelTa: 'பணியாளர்', icon: '👥', roles: ['admin'] },
{ path: '/menu', label: 'Menu Management', labelTa: 'மெனு நிர்வாகம்', icon: '🍽️', roles: ['admin'] },
{ path: '/reports', label: 'Order Reports', labelTa: 'அறிக்கைகள்', icon: '📊', roles: ['admin'] },

  ];
  const navItems = allNav.filter(n => n.roles.includes(user?.role));

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/');
  };

  const currentPage = allNav.find(n => n.path === location.pathname);
  const formatTime  = (d) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formatDate  = (d) => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  const s = {
    shell: {
      display: 'flex', height: '100vh', overflow: 'hidden',
      fontFamily: "'Inter','Segoe UI',sans-serif",
      background: '#f4f4f8',
    },

    // ── Sidebar ──
    sidebar: {
      width: sidebarOpen ? '230px' : '66px',
      minWidth: sidebarOpen ? '230px' : '66px',
      background: '#0f172a',
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.25s ease, min-width 0.25s ease',
      overflow: 'hidden',
      boxShadow: '4px 0 16px rgba(0,0,0,0.15)',
      zIndex: 20,
    },

    // Logo area
    logoArea: {
      padding: '18px 14px',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      display: 'flex', alignItems: 'center', gap: '12px',
      flexShrink: 0,
    },
    logoBox: {
      width: '38px', height: '38px', minWidth: '38px',
      borderRadius: '10px',
      background: `linear-gradient(135deg, ${O}, ${OD})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 4px 12px rgba(249,115,22,0.4)`,
      fontWeight: '900', fontSize: '14px', color: '#fff',
      flexShrink: 0,
    },
    brandWrap: {
      overflow: 'hidden',
      opacity: sidebarOpen ? 1 : 0,
      transition: 'opacity 0.2s',
      whiteSpace: 'nowrap',
    },
    brandName: { color: '#fff', fontWeight: '800', fontSize: '14px', lineHeight: 1.3 },
    brandSub:  { color: 'rgba(255,255,255,0.35)', fontSize: '10px', marginTop: '1px' },

    // Nav
    navArea: { flex: 1, padding: '16px 10px', overflow: 'hidden' },
    navLabel: {
      color: 'rgba(255,255,255,0.25)', fontSize: '10px', fontWeight: '700',
      letterSpacing: '1.2px', textTransform: 'uppercase',
      padding: '0 6px', marginBottom: '8px',
      display: sidebarOpen ? 'block' : 'none',
    },
    navItem: (active) => ({
      display: 'flex', alignItems: 'center',
      gap: '10px', padding: '10px 12px',
      borderRadius: '10px', marginBottom: '4px',
      cursor: 'pointer', transition: 'all 0.18s',
      background: active ? `linear-gradient(135deg, ${O}, ${OD})` : 'transparent',
      boxShadow: active ? `0 4px 12px rgba(249,115,22,0.3)` : 'none',
      border: 'none', width: '100%', textAlign: 'left',
    }),
    navIcon: { fontSize: '17px', minWidth: '22px', textAlign: 'center' },
    navText: (active) => ({
      color: active ? '#fff' : 'rgba(255,255,255,0.55)',
      fontSize: '13px', fontWeight: active ? '700' : '400',
      whiteSpace: 'nowrap',
      opacity: sidebarOpen ? 1 : 0,
      transition: 'opacity 0.2s',
    }),
    navSub: (active) => ({
      color: active ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)',
      fontSize: '10px',
      opacity: sidebarOpen ? 1 : 0,
      transition: 'opacity 0.2s',
      whiteSpace: 'nowrap',
    }),

    // Divider
    divider: { height: '1px', background: 'rgba(255,255,255,0.07)', margin: '8px 10px' },

    // User area bottom
    userArea: {
      padding: '12px 10px',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      flexShrink: 0,
    },
    userCard: {
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '10px 12px', borderRadius: '10px',
      background: 'rgba(255,255,255,0.05)',
      marginBottom: '6px',
    },
    avatar: {
      width: '32px', height: '32px', minWidth: '32px',
      borderRadius: '8px',
      background: `linear-gradient(135deg, ${O}, ${OD})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: '800', fontSize: '12px',
      flexShrink: 0,
    },
    userName:  { color: '#fff', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap', opacity: sidebarOpen ? 1 : 0, transition: 'opacity 0.2s' },
    userRole:  { color: 'rgba(255,255,255,0.4)', fontSize: '10px', whiteSpace: 'nowrap', opacity: sidebarOpen ? 1 : 0, transition: 'opacity 0.2s' },
    logoutBtn: {
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '9px 12px', borderRadius: '10px',
      cursor: 'pointer', border: 'none',
      background: 'rgba(239,68,68,0.1)', width: '100%',
      color: '#f87171', fontSize: '13px', fontWeight: '600',
      transition: 'background 0.18s',
    },

    // ── Main area ──
    main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 },

    // Header
    header: {
      height: '58px', minHeight: '58px',
      background: '#fff',
      borderBottom: '1px solid #eee',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 22px',
      boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
      flexShrink: 0, zIndex: 10,
    },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '14px' },
    toggleBtn: {
      width: '34px', height: '34px', borderRadius: '8px',
      background: '#f5f5f5', border: 'none', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '16px', flexShrink: 0,
    },
    breadcrumb: { display: 'flex', flexDirection: 'column', gap: '1px' },
    pageTitle: { fontSize: '16px', fontWeight: '800', color: '#0f172a' },
    pageSubtitle: { fontSize: '11px', color: '#aaa' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '10px' },
    clockBox: {
      fontSize: '13px', color: '#555', fontWeight: '600',
      background: '#f5f5f5', padding: '6px 12px',
      borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px',
    },
    rolePill: {
      fontSize: '11px', fontWeight: '800',
      padding: '5px 12px', borderRadius: '20px',
      background: user?.role === 'admin' ? '#fff3e0' : '#e0f2fe',
      color: user?.role === 'admin' ? OD : '#0369a1',
      border: `1.5px solid ${user?.role === 'admin' ? '#fed7aa' : '#bae6fd'}`,
      textTransform: 'uppercase', letterSpacing: '0.5px',
    },

    // Content
    content: { flex: 1, overflow: 'auto', padding: '20px' },
  };

  return (
    <div style={s.shell}>

      {/* ── SIDEBAR ── */}
      <div style={s.sidebar}>

        {/* Logo */}
        <div style={s.logoArea}>
          <div style={s.logoBox}>IT</div>
          <div style={s.brandWrap}>
            <div style={s.brandName}>Techon POS</div>
            {/* <div style={s.brandSub}>I துளிர் உணவகம்</div> */}
          </div>
        </div>

        {/* Nav */}
        <div style={s.navArea}>
          <div style={s.navLabel}>MENU</div>
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                style={s.navItem(active)}
                onClick={() => navigate(item.path)}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={s.navIcon}>{item.icon}</span>
                <div style={{ overflow: 'hidden' }}>
                  <div style={s.navText(active)}>{item.label}</div>
                  <div style={s.navSub(active)}>{item.labelTa}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div style={s.divider} />

        {/* User + Logout */}
        <div style={s.userArea}>
          <div style={s.userCard}>
            <div style={s.avatar}>{user?.name?.[0]?.toUpperCase() || 'U'}</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={s.userName}>{user?.name || 'User'}</div>
              <div style={s.userRole}>{user?.role?.toUpperCase()}</div>
            </div>
          </div>
          <button
            style={s.logoutBtn}
            onClick={handleLogout}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
          >
            <span style={{ fontSize: '15px' }}>🚪</span>
            <span style={{ opacity: sidebarOpen ? 1 : 0, transition: 'opacity 0.2s', whiteSpace: 'nowrap' }}>
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={s.main}>

        {/* Header */}
        <div style={s.header}>
          <div style={s.headerLeft}>
            <button
              style={s.toggleBtn}
              onClick={() => setSidebarOpen(p => !p)}
              title="Toggle Sidebar"
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>
            <div style={s.breadcrumb}>
              <div style={s.pageTitle}>{currentPage?.label || 'I Thulir POS'}</div>
              <div style={s.pageSubtitle}>Dashboard › {currentPage?.label}</div>
            </div>
          </div>
          <div style={s.headerRight}>
            <div style={s.clockBox}>
              <span>🕐</span>
              <span>{formatTime(time)}</span>
            </div>
            <div style={{ ...s.clockBox, background: '#f0fdf4', color: '#16a34a' }}>
              <span>📅</span>
              <span>{formatDate(time)}</span>
            </div>
            <div style={s.rolePill}>{user?.role}</div>
          </div>
        </div>

        {/* Page Content */}
        <div style={s.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
