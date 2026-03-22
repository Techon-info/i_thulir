import { useState } from 'react';
import toast from 'react-hot-toast';

const O  = '#f97316';
const OD = '#ea580c';

// ── Mock Data ─────────────────────────────────────────
const today = new Date().toISOString().split('T')[0];
const thisMonth = new Date().toISOString().slice(0, 7);

const initialStaff = [
  { id: 1,  name: 'Murugan K',      nameTa: 'முருகன் க',      role: 'Chef',        phone: '9876543210', joinDate: '2024-01-15', salary: 18000, status: 'active' },
  { id: 2,  name: 'Priya S',        nameTa: 'பிரியா ச',       role: 'Cashier',     phone: '9876543211', joinDate: '2024-02-01', salary: 14000, status: 'active' },
  { id: 3,  name: 'Ravi T',         nameTa: 'ரவி த',          role: 'Waiter',      phone: '9876543212', joinDate: '2024-03-10', salary: 11000, status: 'active' },
  { id: 4,  name: 'Selvi M',        nameTa: 'செல்வி ம',       role: 'Waiter',      phone: '9876543213', joinDate: '2024-03-15', salary: 11000, status: 'active' },
  { id: 5,  name: 'Kumar P',        nameTa: 'குமார் ப',        role: 'Helper',      phone: '9876543214', joinDate: '2024-04-01', salary: 9000,  status: 'active' },
  { id: 6,  name: 'Anitha R',       nameTa: 'அனிதா ர',        role: 'Cleaner',     phone: '9876543215', joinDate: '2024-05-20', salary: 8000,  status: 'active' },
  { id: 7,  name: 'Vijay N',        nameTa: 'விஜய் ந',         role: 'Chef',        phone: '9876543216', joinDate: '2024-06-01', salary: 16000, status: 'inactive' },
  { id: 8,  name: 'Lakshmi B',      nameTa: 'லட்சுமி ப',      role: 'Cashier',     phone: '9876543217', joinDate: '2024-07-10', salary: 14000, status: 'active' },
];

// Generate attendance for current month
const generateAttendance = (staffList) => {
  const records = {};
  staffList.forEach(staff => {
    records[staff.id] = {};
    // Pre-fill some past days
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const todayDate   = new Date().getDate();
    for (let d = 1; d < todayDate; d++) {
      const dateKey = `${thisMonth}-${String(d).padStart(2, '0')}`;
      // Simulate realistic attendance
      const rand = Math.random();
      records[staff.id][dateKey] = rand > 0.15 ? 'present' : rand > 0.05 ? 'absent' : 'halfday';
    }
  });
  return records;
};

const ROLES = ['Chef', 'Cashier', 'Waiter', 'Helper', 'Cleaner', 'Manager', 'Security'];
const TABS  = ['staff', 'attendance', 'salary'];

const emptyForm = { name: '', nameTa: '', role: 'Waiter', phone: '', joinDate: today, salary: '', status: 'active' };

export default function StaffManagement() {
  const [staff, setStaff]           = useState(initialStaff);
  const [attendance, setAttendance] = useState(() => generateAttendance(initialStaff));
  const [activeTab, setActiveTab]   = useState('staff');
  const [showModal, setShowModal]   = useState(false);
  const [editStaff, setEditStaff]   = useState(null);
  const [form, setForm]             = useState(emptyForm);
  const [deleteId, setDeleteId]     = useState(null);
  const [salaryMonth, setSalaryMonth] = useState(thisMonth);
  const [attendanceMonth, setAttendanceMonth] = useState(thisMonth);
  const [filterRole, setFilterRole] = useState('All');
  const [search, setSearch]         = useState('');

  // ── Attendance helpers ────────────────────────────────
  const getDaysInMonth = (monthStr) => {
    const [y, m] = monthStr.split('-').map(Number);
    return new Date(y, m, 0).getDate();
  };

  const markAttendance = (staffId, dateKey, status) => {
    setAttendance(prev => ({
      ...prev,
      [staffId]: { ...(prev[staffId] || {}), [dateKey]: status },
    }));
  };

  const getAttendanceSummary = (staffId, monthStr) => {
    const days    = getDaysInMonth(monthStr);
    const records = attendance[staffId] || {};
    let present = 0, absent = 0, halfday = 0;
    for (let d = 1; d <= days; d++) {
      const key = `${monthStr}-${String(d).padStart(2, '0')}`;
      if (records[key] === 'present') present++;
      else if (records[key] === 'absent') absent++;
      else if (records[key] === 'halfday') halfday++;
    }
    return { present, absent, halfday, unmarked: days - present - absent - halfday };
  };

  // ── Salary calculation ────────────────────────────────
  const calcSalary = (staffMember, monthStr) => {
    const days   = getDaysInMonth(monthStr);
    const { present, halfday } = getAttendanceSummary(staffMember.id, monthStr);
    const perDay = staffMember.salary / 26; // 26 working days
    const earned = (present * perDay) + (halfday * perDay * 0.5);
    const deduction = staffMember.salary - earned;
    return {
      basic: staffMember.salary,
      perDay: Math.round(perDay),
      workingDays: 26,
      present,
      halfday,
      earned: Math.round(earned),
      deduction: Math.round(Math.max(0, deduction)),
      net: Math.round(Math.max(0, earned)),
    };
  };

  // ── Staff CRUD ────────────────────────────────────────
  const openAdd  = () => { setEditStaff(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (s) => {
    setEditStaff(s);
    setForm({ name: s.name, nameTa: s.nameTa, role: s.role, phone: s.phone, joinDate: s.joinDate, salary: s.salary, status: s.status });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditStaff(null); };

  const handleSave = () => {
    if (!form.name || !form.salary || !form.phone) { toast.error('Fill all required fields!'); return; }
    if (editStaff) {
      setStaff(prev => prev.map(s => s.id === editStaff.id ? { ...s, ...form, salary: Number(form.salary) } : s));
      toast.success(`${form.name} updated!`);
    } else {
      const newStaff = { ...form, id: Date.now(), salary: Number(form.salary) };
      setStaff(prev => [...prev, newStaff]);
      setAttendance(prev => ({ ...prev, [newStaff.id]: {} }));
      toast.success(`${form.name} added!`);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    const s = staff.find(s => s.id === id);
    setStaff(prev => prev.filter(s => s.id !== id));
    setDeleteId(null);
    toast.success(`${s.name} removed!`);
  };

  // ── Filtered staff ────────────────────────────────────
  const filtered = staff
    .filter(s => filterRole === 'All' || s.role === filterRole)
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.nameTa.includes(search));

  const activeStaff   = staff.filter(s => s.status === 'active');
  const totalSalary   = activeStaff.reduce((sum, s) => sum + s.salary, 0);
  const todayPresent  = activeStaff.filter(s => (attendance[s.id] || {})[today] === 'present').length;
  const todayAbsent   = activeStaff.filter(s => (attendance[s.id] || {})[today] === 'absent').length;

  // ── Styles ────────────────────────────────────────────
  const s = {
    wrap: { fontFamily: "'Inter','Segoe UI',sans-serif", height: '100%', display: 'flex', flexDirection: 'column', gap: '16px', minHeight: 0 },

    // Summary cards
    summaryRow: { display: 'flex', gap: '14px', flexShrink: 0 },
    sumCard: (color, shadow) => ({
      flex: 1, background: `linear-gradient(135deg, ${color}, ${shadow})`,
      borderRadius: '14px', padding: '18px 20px',
      boxShadow: `0 6px 20px ${color}44`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }),
    sumLeft:  { display: 'flex', flexDirection: 'column', gap: '4px' },
    sumLabel: { color: 'rgba(255,255,255,0.75)', fontSize: '12px', fontWeight: '600' },
    sumValue: { color: '#fff', fontSize: '24px', fontWeight: '900' },
    sumIcon:  { fontSize: '28px', opacity: 0.8 },

    // Tabs
    tabRow: {
      display: 'flex', gap: '8px', flexShrink: 0,
      background: '#fff', borderRadius: '12px', padding: '6px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
    },
    tab: (active) => ({
      flex: 1, padding: '10px 16px', border: 'none', borderRadius: '9px',
      cursor: 'pointer', fontSize: '14px', fontWeight: '700',
      background: active ? O : 'transparent',
      color: active ? '#fff' : '#888',
      boxShadow: active ? `0 3px 10px rgba(249,115,22,0.3)` : 'none',
      transition: 'all 0.18s',
    }),

    // Controls
    controls: {
      background: '#fff', borderRadius: '12px', padding: '12px 16px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.06)', flexShrink: 0,
      display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap',
    },
    searchInput: {
      flex: 1, minWidth: '160px', padding: '9px 14px', fontSize: '14px',
      border: '1.5px solid #e5e5e5', borderRadius: '10px', outline: 'none',
    },
    select: {
      padding: '9px 12px', fontSize: '13px', fontWeight: '600',
      border: '1.5px solid #e5e5e5', borderRadius: '10px', outline: 'none',
      background: '#fff', cursor: 'pointer',
    },
    addBtn: {
      padding: '9px 20px', fontSize: '14px', fontWeight: '700',
      border: 'none', borderRadius: '10px', cursor: 'pointer',
      background: `linear-gradient(135deg, ${O}, ${OD})`,
      color: '#fff', boxShadow: `0 3px 10px rgba(249,115,22,0.3)`,
      display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
    },

    // Table
    tableCard: {
      flex: 1, background: '#fff', borderRadius: '14px', overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', minHeight: 0,
    },
    tableScroll: { flex: 1, overflowY: 'auto', overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
    th: {
      padding: '11px 14px', textAlign: 'left', background: '#fafafa',
      borderBottom: '2px solid #f0f0f0', fontSize: '11px', fontWeight: '700',
      color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap',
    },
    td: { padding: '12px 14px', borderBottom: '1px solid #f8f8f8', verticalAlign: 'middle' },

    // Badges
    roleBadge: (role) => {
      const map = {
        Chef: ['#fff3e0','#ea580c'], Cashier: ['#e0f2fe','#0369a1'],
        Waiter: ['#dcfce7','#16a34a'], Helper: ['#f3e8ff','#7e22ce'],
        Cleaner: ['#fce7f3','#9d174d'], Manager: ['#fef9c3','#854d0e'],
        Security: ['#f0fdf4','#14532d'],
      };
      const [bg, color] = map[role] || ['#f3f4f6','#374151'];
      return { padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: bg, color };
    },
    statusBadge: (status) => ({
      padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
      background: status === 'active' ? '#dcfce7' : '#fee2e2',
      color: status === 'active' ? '#16a34a' : '#dc2626',
    }),
    editBtn: {
      padding: '5px 12px', fontSize: '12px', fontWeight: '700',
      border: `1.5px solid ${O}`, borderRadius: '7px',
      background: '#fff3e0', color: OD, cursor: 'pointer', marginRight: '6px',
    },
    delBtn: {
      padding: '5px 12px', fontSize: '12px', fontWeight: '700',
      border: '1.5px solid #fca5a5', borderRadius: '7px',
      background: '#fee2e2', color: '#dc2626', cursor: 'pointer',
    },

    // Attendance grid
    attGrid: { flex: 1, overflowY: 'auto', padding: '16px' },
    attCard: {
      background: '#fff', borderRadius: '14px', marginBottom: '14px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.06)', overflow: 'hidden',
    },
    attCardHead: {
      padding: '12px 18px', background: '#fafafa', borderBottom: '1px solid #f0f0f0',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    },
    attDayGrid: { padding: '14px 18px', display: 'flex', flexWrap: 'wrap', gap: '5px' },
    dayBtn: (status) => {
      const colors = {
        present: ['#dcfce7','#16a34a','#16a34a'],
        absent:  ['#fee2e2','#dc2626','#dc2626'],
        halfday: ['#fef9c3','#854d0e','#ca8a04'],
        none:    ['#f5f5f5','#ccc','#999'],
      };
      const [bg, border, color] = colors[status] || colors.none;
      return {
        width: '34px', height: '34px', borderRadius: '8px',
        background: bg, border: `1.5px solid ${border}`, color,
        fontSize: '11px', fontWeight: '700', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
      };
    },
    attSummaryPills: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
    pill: (color, bg) => ({
      padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
      background: bg, color,
    }),

    // Salary section
    salaryWrap: { flex: 1, overflowY: 'auto', padding: '4px 0' },
    salaryCard: {
      background: '#fff', borderRadius: '14px', marginBottom: '14px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.06)', overflow: 'hidden',
    },
    salaryHead: {
      padding: '14px 18px', background: `linear-gradient(135deg, ${O}, ${OD})`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    },
    salaryBody: { padding: '16px 18px' },
    salaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' },

    // Modal
    overlay: {
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(3px)',
    },
    modal: {
      background: '#fff', borderRadius: '18px', width: '460px', maxWidth: '95vw',
      boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden',
    },
    modalHeader: {
      padding: '18px 24px', background: `linear-gradient(135deg, ${O}, ${OD})`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    },
    modalTitle: { color: '#fff', fontSize: '16px', fontWeight: '800' },
    modalClose: {
      width: '30px', height: '30px', borderRadius: '50%',
      border: 'none', background: 'rgba(255,255,255,0.25)',
      color: '#fff', fontWeight: '700', cursor: 'pointer', fontSize: '16px',
    },
    modalBody: { padding: '22px 24px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '700', color: '#555', marginBottom: '6px' },
    input: {
      width: '100%', padding: '10px 14px', fontSize: '14px',
      border: '1.5px solid #e5e5e5', borderRadius: '10px',
      outline: 'none', boxSizing: 'border-box', background: '#fafafa',
    },
    formRow: { display: 'flex', gap: '12px', marginBottom: '14px' },
    formGroup: { flex: 1 },
    modalFooter: {
      padding: '14px 24px', borderTop: '1px solid #f0f0f0',
      display: 'flex', gap: '10px', justifyContent: 'flex-end', background: '#fafafa',
    },
    cancelBtn: {
      padding: '10px 20px', fontSize: '14px', fontWeight: '700',
      border: '1.5px solid #e5e5e5', borderRadius: '10px', background: '#fff', color: '#666', cursor: 'pointer',
    },
    saveBtn: {
      padding: '10px 24px', fontSize: '14px', fontWeight: '700',
      border: 'none', borderRadius: '10px', cursor: 'pointer',
      background: `linear-gradient(135deg, ${O}, ${OD})`, color: '#fff',
    },
    confirmBox: {
      background: '#fff', borderRadius: '16px', padding: '32px',
      width: '360px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    },
  };

  // ── Today attendance quick mark ───────────────────────
  const cycleToday = (staffId) => {
    const cur = (attendance[staffId] || {})[today] || 'none';
    const next = cur === 'none' ? 'present' : cur === 'present' ? 'absent' : cur === 'absent' ? 'halfday' : 'none';
    markAttendance(staffId, today, next === 'none' ? undefined : next);
    toast.success(`${staff.find(s => s.id === staffId)?.name}: marked ${next}`);
  };

  const daysInAttMonth = getDaysInMonth(attendanceMonth);
  const today_d = new Date().getDate();

  return (
    <div style={s.wrap}>

      {/* ── Summary Cards ── */}
      <div style={s.summaryRow}>
        <div style={s.sumCard('#f97316', '#ea580c')}>
          <div style={s.sumLeft}>
            <div style={s.sumLabel}>Total Staff</div>
            <div style={s.sumValue}>{staff.length}</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>{activeStaff.length} active</div>
          </div>
          <div style={s.sumIcon}>👥</div>
        </div>
        <div style={s.sumCard('#16a34a', '#15803d')}>
          <div style={s.sumLeft}>
            <div style={s.sumLabel}>Today Present</div>
            <div style={s.sumValue}>{todayPresent}</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>{todayAbsent} absent</div>
          </div>
          <div style={s.sumIcon}>✅</div>
        </div>
        <div style={s.sumCard('#6366f1', '#4f46e5')}>
          <div style={s.sumLeft}>
            <div style={s.sumLabel}>Monthly Payroll</div>
            <div style={s.sumValue}>₹{(totalSalary / 1000).toFixed(0)}k</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>₹{totalSalary.toLocaleString('en-IN')}</div>
          </div>
          <div style={s.sumIcon}>💰</div>
        </div>
        <div style={s.sumCard('#ef4444', '#dc2626')}>
          <div style={s.sumLeft}>
            <div style={s.sumLabel}>Absent Today</div>
            <div style={s.sumValue}>{todayAbsent}</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>of {activeStaff.length} active</div>
          </div>
          <div style={s.sumIcon}>⚠️</div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={s.tabRow}>
        {[
          { key: 'staff',      label: '👤 Staff List',      sub: 'Add / Edit / Delete' },
          { key: 'attendance', label: '📅 Attendance',      sub: 'Daily Mark' },
          { key: 'salary',     label: '💵 Salary',          sub: 'Monthly Payslip' },
        ].map(t => (
          <button key={t.key} style={s.tab(activeTab === t.key)} onClick={() => setActiveTab(t.key)}>
            <div>{t.label}</div>
            <div style={{ fontSize: '10px', opacity: 0.7, fontWeight: '400' }}>{t.sub}</div>
          </button>
        ))}
      </div>

      {/* ══════════════ TAB: STAFF LIST ══════════════ */}
      {activeTab === 'staff' && (
        <>
          {/* Controls */}
          <div style={s.controls}>
            <input
              style={s.searchInput}
              placeholder="Search staff... பணியாளர் தேடு"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={e => e.target.style.borderColor = O}
              onBlur={e  => e.target.style.borderColor = '#e5e5e5'}
            />
            <select style={s.select} value={filterRole} onChange={e => setFilterRole(e.target.value)}>
              <option>All</option>
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
            <button style={s.addBtn} onClick={openAdd}>＋ Add Staff</button>
          </div>

          {/* Table */}
          <div style={s.tableCard}>
            <div style={s.tableScroll}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>#</th>
                    <th style={s.th}>Name</th>
                    <th style={s.th}>Tamil</th>
                    <th style={s.th}>Role</th>
                    <th style={s.th}>Phone</th>
                    <th style={s.th}>Join Date</th>
                    <th style={s.th}>Salary</th>
                    <th style={s.th}>Status</th>
                    <th style={s.th}>Today</th>
                    <th style={s.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((member, idx) => {
                    const todayAtt = (attendance[member.id] || {})[today];
                    return (
                      <tr
                        key={member.id}
                        style={{ background: idx % 2 === 0 ? '#fff' : '#fafafa' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fff7ed'}
                        onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : '#fafafa'}
                      >
                        <td style={{ ...s.td, color: '#aaa', fontSize: '12px' }}>{idx + 1}</td>
                        <td style={s.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '34px', height: '34px', borderRadius: '10px',
                              background: `linear-gradient(135deg, ${O}, ${OD})`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#fff', fontWeight: '800', fontSize: '13px', flexShrink: 0,
                            }}>
                              {member.name[0]}
                            </div>
                            <div>
                              <div style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '13px' }}>{member.name}</div>
                              <div style={{ fontSize: '11px', color: '#aaa' }}>ID: {String(member.id).slice(-4)}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ ...s.td, color: '#666', fontSize: '12px' }}>{member.nameTa}</td>
                        <td style={s.td}><span style={s.roleBadge(member.role)}>{member.role}</span></td>
                        <td style={{ ...s.td, color: '#555', fontSize: '13px' }}>{member.phone}</td>
                        <td style={{ ...s.td, color: '#888', fontSize: '12px' }}>{member.joinDate}</td>
                        <td style={{ ...s.td, fontWeight: '700', color: O }}>₹{member.salary.toLocaleString('en-IN')}</td>
                        <td style={s.td}><span style={s.statusBadge(member.status)}>{member.status}</span></td>
                        <td style={s.td}>
                          <button
                            style={{
                              ...s.dayBtn(todayAtt || 'none'),
                              width: 'auto', height: 'auto',
                              padding: '4px 10px', borderRadius: '8px', fontSize: '11px',
                            }}
                            onClick={() => cycleToday(member.id)}
                            title="Click to cycle: Present → Absent → Half Day"
                          >
                            {todayAtt === 'present' ? '✓ P' : todayAtt === 'absent' ? '✗ A' : todayAtt === 'halfday' ? '½ H' : '— ?'}
                          </button>
                        </td>
                        <td style={s.td}>
                          <button style={s.editBtn} onClick={() => openEdit(member)}>✏ Edit</button>
                          <button style={s.delBtn}  onClick={() => setDeleteId(member.id)}>🗑 Del</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '10px 16px', borderTop: '1px solid #f0f0f0', background: '#fafafa', fontSize: '13px', color: '#888' }}>
              Showing <strong>{filtered.length}</strong> of <strong>{staff.length}</strong> staff members
            </div>
          </div>
        </>
      )}

      {/* ══════════════ TAB: ATTENDANCE ══════════════ */}
      {activeTab === 'attendance' && (
        <>
          <div style={s.controls}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#555' }}>📅 Month:</div>
            <input
              type="month"
              style={{ ...s.searchInput, flex: 'none', width: '180px' }}
              value={attendanceMonth}
              onChange={e => setAttendanceMonth(e.target.value)}
            />
            <div style={{ fontSize: '12px', color: '#888', flex: 1 }}>
              Click a day box → cycle: <span style={{ color: '#16a34a', fontWeight: '700' }}>Present</span> →{' '}
              <span style={{ color: '#dc2626', fontWeight: '700' }}>Absent</span> →{' '}
              <span style={{ color: '#ca8a04', fontWeight: '700' }}>Half Day</span> → Unmarked
            </div>
            {/* Legend */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {[['#16a34a','#dcfce7','P'],['#dc2626','#fee2e2','A'],['#ca8a04','#fef9c3','H'],['#ccc','#f5f5f5','?']].map(([c,bg,l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: bg, border: `1.5px solid ${c}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '700', color: c }}>{l}</div>
                  <span style={{ fontSize: '11px', color: '#888' }}>{l === 'P' ? 'Present' : l === 'A' ? 'Absent' : l === 'H' ? 'Half Day' : 'Unknown'}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={s.attGrid}>
            {activeStaff.map(member => {
              const summary = getAttendanceSummary(member.id, attendanceMonth);
              const records = attendance[member.id] || {};
              return (
                <div key={member.id} style={s.attCard}>
                  <div style={s.attCardHead}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `linear-gradient(135deg,${O},${OD})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '14px' }}>
                        {member.name[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', color: '#1a1a2e' }}>{member.name}</div>
                        <div style={{ fontSize: '11px', color: '#aaa' }}>{member.role}</div>
                      </div>
                    </div>
                    <div style={s.attSummaryPills}>
                      <span style={s.pill('#16a34a','#dcfce7')}>✓ {summary.present} P</span>
                      <span style={s.pill('#dc2626','#fee2e2')}>✗ {summary.absent} A</span>
                      <span style={s.pill('#ca8a04','#fef9c3')}>½ {summary.halfday} H</span>
                      <span style={s.pill('#888','#f5f5f5')}>? {summary.unmarked}</span>
                    </div>
                  </div>
                  <div style={s.attDayGrid}>
                    {Array.from({ length: daysInAttMonth }, (_, i) => {
                      const day     = i + 1;
                      const dateKey = `${attendanceMonth}-${String(day).padStart(2, '0')}`;
                      const status  = records[dateKey] || 'none';
                      const isFuture = attendanceMonth === thisMonth && day > today_d;
                      return (
                        <button
                          key={day}
                          style={{
                            ...s.dayBtn(status),
                            opacity: isFuture ? 0.35 : 1,
                            cursor: isFuture ? 'not-allowed' : 'pointer',
                          }}
                          disabled={isFuture}
                          onClick={() => {
                            const next = status === 'none' ? 'present' : status === 'present' ? 'absent' : status === 'absent' ? 'halfday' : 'none';
                            if (next === 'none') {
                              setAttendance(prev => {
                                const updated = { ...prev[member.id] };
                                delete updated[dateKey];
                                return { ...prev, [member.id]: updated };
                              });
                            } else {
                              markAttendance(member.id, dateKey, next);
                            }
                          }}
                          title={dateKey}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ══════════════ TAB: SALARY ══════════════ */}
      {activeTab === 'salary' && (
        <>
          <div style={s.controls}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#555' }}>💵 Payroll Month:</div>
            <input
              type="month"
              style={{ ...s.searchInput, flex: 'none', width: '180px' }}
              value={salaryMonth}
              onChange={e => setSalaryMonth(e.target.value)}
            />
            <div style={{ flex: 1 }} />
            <div style={{
              padding: '9px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '700',
              background: '#dcfce7', color: '#16a34a',
            }}>
              Total Payroll: ₹{activeStaff.reduce((sum, m) => sum + calcSalary(m, salaryMonth).net, 0).toLocaleString('en-IN')}
            </div>
          </div>

          <div style={s.salaryWrap}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '14px' }}>
              {activeStaff.map(member => {
                const sal = calcSalary(member, salaryMonth);
                return (
                  <div key={member.id} style={s.salaryCard}>
                    {/* Card Header */}
                    <div style={s.salaryHead}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '900', fontSize: '16px' }}>
                          {member.name[0]}
                        </div>
                        <div>
                          <div style={{ color: '#fff', fontWeight: '800', fontSize: '14px' }}>{member.name}</div>
                          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>{member.role} · {member.nameTa}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#fff', fontWeight: '900', fontSize: '18px' }}>₹{sal.net.toLocaleString('en-IN')}</div>
                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px' }}>Net Payable</div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div style={s.salaryBody}>
                      <div style={s.salaryRow}>
                        <span style={{ color: '#666' }}>Basic Salary</span>
                        <span style={{ fontWeight: '700' }}>₹{sal.basic.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={s.salaryRow}>
                        <span style={{ color: '#666' }}>Per Day Rate</span>
                        <span style={{ fontWeight: '600', color: '#555' }}>₹{sal.perDay}</span>
                      </div>
                      <div style={{ height: '1px', background: '#f0f0f0', margin: '8px 0' }} />
                      <div style={s.salaryRow}>
                        <span style={{ color: '#16a34a', fontWeight: '600' }}>✓ Days Present</span>
                        <span style={{ fontWeight: '700', color: '#16a34a' }}>{sal.present} days</span>
                      </div>
                      <div style={s.salaryRow}>
                        <span style={{ color: '#ca8a04', fontWeight: '600' }}>½ Half Days</span>
                        <span style={{ fontWeight: '700', color: '#ca8a04' }}>{sal.halfday} days</span>
                      </div>
                      <div style={s.salaryRow}>
                        <span style={{ color: '#dc2626', fontWeight: '600' }}>✗ Deduction</span>
                        <span style={{ fontWeight: '700', color: '#dc2626' }}>- ₹{sal.deduction.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ height: '1px', background: '#f0f0f0', margin: '8px 0' }} />
                      <div style={{ ...s.salaryRow, marginBottom: 0 }}>
                        <span style={{ fontWeight: '800', color: '#1a1a2e', fontSize: '14px' }}>Net Payable</span>
                        <span style={{ fontWeight: '900', color: O, fontSize: '16px' }}>₹{sal.net.toLocaleString('en-IN')}</span>
                      </div>

                      {/* Pay button */}
                      <button
                        style={{
                          width: '100%', marginTop: '12px', padding: '10px',
                          border: 'none', borderRadius: '10px', cursor: 'pointer',
                          background: `linear-gradient(135deg,${O},${OD})`,
                          color: '#fff', fontWeight: '700', fontSize: '14px',
                          boxShadow: `0 3px 10px rgba(249,115,22,0.3)`,
                        }}
                        onClick={() => toast.success(`Salary of ₹${sal.net.toLocaleString('en-IN')} marked as paid for ${member.name}!`)}
                      >
                        💵 Mark as Paid
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && closeModal()}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <div style={s.modalTitle}>{editStaff ? `✏ Edit — ${editStaff.name}` : '＋ Add New Staff'}</div>
              <button style={s.modalClose} onClick={closeModal}>✕</button>
            </div>
            <div style={s.modalBody}>
              <div style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.label}>Full Name *</label>
                  <input style={s.input} placeholder="e.g. Murugan K" value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = O}
                    onBlur={e  => e.target.style.borderColor = '#e5e5e5'} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Tamil Name</label>
                  <input style={s.input} placeholder="e.g. முருகன் க" value={form.nameTa}
                    onChange={e => setForm(p => ({ ...p, nameTa: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = O}
                    onBlur={e  => e.target.style.borderColor = '#e5e5e5'} />
                </div>
              </div>
              <div style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.label}>Role</label>
                  <select style={{ ...s.input, cursor: 'pointer' }} value={form.role}
                    onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Status</label>
                  <select style={{ ...s.input, cursor: 'pointer' }} value={form.status}
                    onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.label}>Phone *</label>
                  <input style={s.input} placeholder="10-digit number" value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = O}
                    onBlur={e  => e.target.style.borderColor = '#e5e5e5'} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Join Date</label>
                  <input type="date" style={s.input} value={form.joinDate}
                    onChange={e => setForm(p => ({ ...p, joinDate: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = O}
                    onBlur={e  => e.target.style.borderColor = '#e5e5e5'} />
                </div>
              </div>
              <div style={{ ...s.formRow, marginBottom: 0 }}>
                <div style={s.formGroup}>
                  <label style={s.label}>Monthly Salary (₹) *</label>
                  <input type="number" style={s.input} placeholder="e.g. 15000" value={form.salary}
                    onChange={e => setForm(p => ({ ...p, salary: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = O}
                    onBlur={e  => e.target.style.borderColor = '#e5e5e5'} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Per Day (auto)</label>
                  <div style={{ ...s.input, background: '#f5f5f5', color: '#888', display: 'flex', alignItems: 'center' }}>
                    ₹{form.salary ? Math.round(Number(form.salary) / 26) : 0} / day
                  </div>
                </div>
              </div>
            </div>
            <div style={s.modalFooter}>
              <button style={s.cancelBtn} onClick={closeModal}>Cancel</button>
              <button style={s.saveBtn}   onClick={handleSave}>{editStaff ? '✓ Update' : '＋ Add Staff'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteId && (
        <div style={s.overlay}>
          <div style={s.confirmBox}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>👤</div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#1a1a2e', marginBottom: '8px' }}>Remove Staff?</div>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '24px' }}>
              <strong>{staff.find(s => s.id === deleteId)?.name}</strong> will be permanently removed.
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button style={{ ...s.cancelBtn, padding: '10px 24px' }} onClick={() => setDeleteId(null)}>Cancel</button>
              <button style={{ padding: '10px 24px', fontSize: '14px', fontWeight: '700', border: 'none', borderRadius: '10px', cursor: 'pointer', background: '#ef4444', color: '#fff' }}
                onClick={() => handleDelete(deleteId)}>Remove</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
