import { useState, useMemo } from 'react';
import { mockOrders } from '../../data/mockOrders';

const O  = '#f97316';
const OD = '#ea580c';

const CATEGORIES = ['All','Breakfast','Lunch','Dinner','Snacks','Beverages','Cool Drinks','Ice Cream'];
const TIME_SLOTS  = ['All','Morning','Afternoon','Evening','Night'];
const MODES       = ['All','DINE IN','TAKE AWAY','DINING OUT'];
const STATUSES    = ['All','paid','pending','refunded'];
const today       = new Date().toISOString().split('T')[0];
const thisMonth   = new Date().toISOString().slice(0, 7);
const thisYear    = String(new Date().getFullYear());

export default function OrderReports() {
  // ── Filter State ──────────────────────────────────────
  const [filterDate,     setFilterDate]     = useState('');
  const [filterMonth,    setFilterMonth]    = useState('');
  const [filterYear,     setFilterYear]     = useState('');
  const [filterTimeSlot, setFilterTimeSlot] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterMode,     setFilterMode]     = useState('All');
  const [filterStatus,   setFilterStatus]   = useState('All');
  const [filterName,     setFilterName]     = useState('');
  const [filterDish,     setFilterDish]     = useState('');
  const [filterMinAmt,   setFilterMinAmt]   = useState('');
  const [filterMaxAmt,   setFilterMaxAmt]   = useState('');
  const [quickRange,     setQuickRange]     = useState('all'); // all|today|week|month|year
  const [sortBy,         setSortBy]         = useState('date_desc');
  const [expandedId,     setExpandedId]     = useState(null);
  const [page,           setPage]           = useState(1);
  const PER_PAGE = 15;

  // ── Quick range helper ────────────────────────────────
  const applyQuickRange = (range) => {
    setQuickRange(range);
    setFilterDate(''); setFilterMonth(''); setFilterYear('');
    if (range === 'today') setFilterDate(today);
    else if (range === 'week') {}   // handled in filter logic
    else if (range === 'month') setFilterMonth(thisMonth);
    else if (range === 'year')  setFilterYear(thisYear);
  };

  const resetAllFilters = () => {
    setFilterDate(''); setFilterMonth(''); setFilterYear('');
    setFilterTimeSlot('All'); setFilterCategory('All');
    setFilterMode('All'); setFilterStatus('All');
    setFilterName(''); setFilterDish('');
    setFilterMinAmt(''); setFilterMaxAmt('');
    setQuickRange('all'); setSortBy('date_desc'); setPage(1);
  };

  // ── Filtered + Sorted orders ──────────────────────────
  const filtered = useMemo(() => {
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);

    let list = mockOrders.filter(o => {
      const oDate = new Date(`${o.date} ${o.time}`);

      // Quick range
      if (quickRange === 'week' && oDate < weekAgo) return false;

      // Date
      if (filterDate  && o.date !== filterDate)              return false;
      // Month
      if (filterMonth && !o.date.startsWith(filterMonth))    return false;
      // Year
      if (filterYear  && !o.date.startsWith(filterYear))     return false;
      // Time slot
      if (filterTimeSlot !== 'All' && o.timeSlot !== filterTimeSlot) return false;
      // Mode
      if (filterMode !== 'All' && o.mode !== filterMode)     return false;
      // Status
      if (filterStatus !== 'All' && o.status !== filterStatus) return false;
      // Customer name
      if (filterName.trim() && !o.customer.toLowerCase().includes(filterName.toLowerCase())) return false;
      // Dish name
      if (filterDish.trim() && !o.items.some(i =>
        i.name.toLowerCase().includes(filterDish.toLowerCase()) ||
        i.nameTa.includes(filterDish))) return false;
      // Category
      if (filterCategory !== 'All' && !o.items.some(i => i.category === filterCategory)) return false;
      // Amount range
      if (filterMinAmt && o.total < Number(filterMinAmt)) return false;
      if (filterMaxAmt && o.total > Number(filterMaxAmt)) return false;

      return true;
    });

    // Sort
    list = [...list].sort((a, b) => {
      if (sortBy === 'date_desc')  return new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`);
      if (sortBy === 'date_asc')   return new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`);
      if (sortBy === 'amt_desc')   return b.total - a.total;
      if (sortBy === 'amt_asc')    return a.total - b.total;
      if (sortBy === 'name_asc')   return a.customer.localeCompare(b.customer);
      return 0;
    });

    return list;
  }, [filterDate,filterMonth,filterYear,filterTimeSlot,filterCategory,
      filterMode,filterStatus,filterName,filterDish,filterMinAmt,filterMaxAmt,
      quickRange,sortBy]);

  // ── Summary stats from filtered ───────────────────────
  const stats = useMemo(() => {
    const total   = filtered.reduce((s, o) => s + o.total, 0);
    const paid    = filtered.filter(o => o.status === 'paid').length;
    const pending = filtered.filter(o => o.status === 'pending').length;
    const avgAmt  = filtered.length ? Math.round(total / filtered.length) : 0;

    // Category breakdown
    const catMap = {};
    filtered.forEach(o => o.items.forEach(i => {
      catMap[i.category] = (catMap[i.category] || 0) + i.price * i.qty;
    }));

    // Top dish
    const dishMap = {};
    filtered.forEach(o => o.items.forEach(i => {
      dishMap[i.name] = (dishMap[i.name] || 0) + i.qty;
    }));
    const topDish = Object.entries(dishMap).sort((a,b) => b[1]-a[1])[0];

    // Time slot breakdown
    const slotMap = { Morning:0, Afternoon:0, Evening:0, Night:0 };
    filtered.forEach(o => { if (slotMap[o.timeSlot] !== undefined) slotMap[o.timeSlot]++; });

    return { total, paid, pending, avgAmt, catMap, topDish, slotMap };
  }, [filtered]);

  // ── Pagination ────────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // ── Active filter count ───────────────────────────────
  const activeFilters = [filterDate,filterMonth,filterYear,
    filterTimeSlot !== 'All' ? filterTimeSlot : '',
    filterCategory !== 'All' ? filterCategory : '',
    filterMode !== 'All' ? filterMode : '',
    filterStatus !== 'All' ? filterStatus : '',
    filterName, filterDish, filterMinAmt, filterMaxAmt,
    quickRange !== 'all' ? quickRange : '',
  ].filter(Boolean).length;

  // ── Styles ────────────────────────────────────────────
  const s = {
    wrap: { fontFamily:"'Inter','Segoe UI',sans-serif", height:'100%', display:'flex', flexDirection:'column', gap:'14px', minHeight:0 },

    // Summary cards
    summaryRow: { display:'flex', gap:'12px', flexShrink:0 },
    sumCard: (color, dark) => ({
      flex:1, background:`linear-gradient(135deg,${color},${dark})`,
      borderRadius:'14px', padding:'16px 18px',
      boxShadow:`0 6px 18px ${color}44`,
      display:'flex', justifyContent:'space-between', alignItems:'center',
    }),
    sumLeft:  { display:'flex', flexDirection:'column', gap:'2px' },
    sumLabel: { color:'rgba(255,255,255,0.75)', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.5px' },
    sumValue: { color:'#fff', fontSize:'22px', fontWeight:'900' },
    sumSub:   { color:'rgba(255,255,255,0.6)', fontSize:'10px' },
    sumIcon:  { fontSize:'26px', opacity:0.85 },

    // Filter panel
    filterPanel: {
      background:'#fff', borderRadius:'14px', padding:'16px 18px',
      boxShadow:'0 2px 10px rgba(0,0,0,0.06)', flexShrink:0,
    },
    filterHeader: {
      display:'flex', justifyContent:'space-between', alignItems:'center',
      marginBottom:'14px',
    },
    filterTitle: { fontSize:'14px', fontWeight:'800', color:'#1a1a2e' },
    filterBadge: {
      background:`${O}18`, color:OD, fontSize:'11px', fontWeight:'700',
      padding:'3px 10px', borderRadius:'20px', border:`1px solid ${O}40`,
    },
    resetBtn: {
      padding:'6px 14px', fontSize:'12px', fontWeight:'700',
      border:'1.5px solid #e5e5e5', borderRadius:'8px',
      background:'#fff', color:'#666', cursor:'pointer',
    },

    // Quick range pills
    quickRow: { display:'flex', gap:'6px', marginBottom:'14px', flexWrap:'wrap' },
    quickBtn: (active) => ({
      padding:'7px 14px', fontSize:'12px', fontWeight:'700',
      border:`1.5px solid ${active ? O : '#e5e5e5'}`,
      borderRadius:'20px', cursor:'pointer',
      background: active ? O : '#fff',
      color: active ? '#fff' : '#666',
      transition:'all 0.15s',
    }),

    // Filter grid
    filterGrid: {
      display:'grid',
      gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',
      gap:'10px',
    },
    filterGroup: { display:'flex', flexDirection:'column', gap:'5px' },
    filterLabel: { fontSize:'11px', fontWeight:'700', color:'#888', textTransform:'uppercase', letterSpacing:'0.5px' },
    filterInput: {
      padding:'8px 12px', fontSize:'13px',
      border:'1.5px solid #e5e5e5', borderRadius:'9px',
      outline:'none', background:'#fafafa', width:'100%', boxSizing:'border-box',
    },
    filterSelect: {
      padding:'8px 12px', fontSize:'13px', fontWeight:'600',
      border:'1.5px solid #e5e5e5', borderRadius:'9px',
      outline:'none', background:'#fafafa', cursor:'pointer',
      width:'100%', boxSizing:'border-box',
    },

    // Stats bar
    statsBar: {
      background:'#fff', borderRadius:'12px', padding:'12px 18px',
      boxShadow:'0 2px 10px rgba(0,0,0,0.06)', flexShrink:0,
      display:'flex', gap:'16px', alignItems:'center', flexWrap:'wrap',
    },
    statPill: (color, bg) => ({
      padding:'5px 12px', borderRadius:'20px', fontSize:'12px',
      fontWeight:'700', background:bg, color, display:'flex', gap:'5px', alignItems:'center',
    }),
    sortSelect: {
      padding:'7px 12px', fontSize:'12px', fontWeight:'600',
      border:'1.5px solid #e5e5e5', borderRadius:'9px',
      outline:'none', background:'#fff', cursor:'pointer', marginLeft:'auto',
    },

    // Table
    tableCard: {
      flex:1, background:'#fff', borderRadius:'14px', overflow:'hidden',
      boxShadow:'0 2px 10px rgba(0,0,0,0.06)', display:'flex', flexDirection:'column', minHeight:0,
    },
    tableScroll: { flex:1, overflowY:'auto', overflowX:'auto' },
    table: { width:'100%', borderCollapse:'collapse', fontSize:'13px' },
    th: {
      padding:'11px 14px', textAlign:'left', background:'#fafafa',
      borderBottom:'2px solid #f0f0f0', fontSize:'11px', fontWeight:'700',
      color:'#888', textTransform:'uppercase', letterSpacing:'0.5px', whiteSpace:'nowrap',
    },
    td: { padding:'11px 14px', borderBottom:'1px solid #f8f8f8', verticalAlign:'middle' },

    // Status badge
    statusBadge: (status) => {
      const map = { paid:['#dcfce7','#16a34a'], pending:['#fef9c3','#854d0e'], refunded:['#fee2e2','#dc2626'] };
      const [bg, color] = map[status] || ['#f5f5f5','#555'];
      return { padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'700', background:bg, color };
    },
    modeBadge: (mode) => {
      const map = { 'DINE IN':['#e0f2fe','#0369a1'], 'TAKE AWAY':['#fff3e0','#ea580c'], 'DINING OUT':['#f3e8ff','#7e22ce'] };
      const [bg, color] = map[mode] || ['#f5f5f5','#555'];
      return { padding:'3px 8px', borderRadius:'20px', fontSize:'11px', fontWeight:'700', background:bg, color };
    },
    slotBadge: (slot) => {
      const map = { Morning:['#fef9c3','#854d0e'], Afternoon:['#fff3e0','#ea580c'], Evening:['#f3e8ff','#7e22ce'], Night:['#1e1b4b','#a5b4fc'] };
      const [bg, color] = map[slot] || ['#f5f5f5','#555'];
      return { padding:'3px 8px', borderRadius:'20px', fontSize:'11px', fontWeight:'700', background:bg, color };
    },

    // Expanded row
    expandRow: {
      background:'#fafafa', padding:'14px 18px',
      borderBottom:'1px solid #f0f0f0',
    },
    itemPill: {
      display:'inline-flex', alignItems:'center', gap:'4px',
      padding:'4px 10px', background:'#fff', border:'1px solid #e5e5e5',
      borderRadius:'8px', fontSize:'12px', margin:'3px',
    },

    // Pagination
    pagination: {
      padding:'12px 18px', borderTop:'1px solid #f0f0f0', background:'#fafafa',
      display:'flex', gap:'6px', alignItems:'center', justifyContent:'center', flexShrink:0,
    },
    pageBtn: (active, disabled) => ({
      width:'34px', height:'34px', borderRadius:'8px', border:'none',
      cursor: disabled ? 'not-allowed' : 'pointer', fontWeight:'700', fontSize:'13px',
      background: active ? O : '#fff',
      color: active ? '#fff' : disabled ? '#ccc' : '#555',
      border: `1.5px solid ${active ? O : '#e5e5e5'}`,
      opacity: disabled ? 0.5 : 1,
    }),

    // Insight strip
    insightRow: {
      display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',
      gap:'10px', flexShrink:0,
    },
    insightCard: (color, bg) => ({
      background:bg, borderRadius:'12px', padding:'12px 16px',
      border:`1.5px solid ${color}30`,
      display:'flex', alignItems:'center', gap:'12px',
    }),
    insightIcon: { fontSize:'24px' },
    insightLabel: { fontSize:'11px', color:'#888', fontWeight:'600' },
    insightVal: (color) => ({ fontSize:'15px', fontWeight:'900', color }),
  };

  const foc = (e) => { e.target.style.borderColor = O; e.target.style.boxShadow = `0 0 0 3px rgba(249,115,22,0.12)`; };
  const blr = (e) => { e.target.style.borderColor = '#e5e5e5'; e.target.style.boxShadow = 'none'; };

  return (
    <div style={s.wrap}>

      {/* ── Summary Cards ── */}
      <div style={s.summaryRow}>
        <div style={s.sumCard('#f97316','#ea580c')}>
          <div style={s.sumLeft}>
            <div style={s.sumLabel}>Filtered Orders</div>
            <div style={s.sumValue}>{filtered.length}</div>
            <div style={s.sumSub}>of {mockOrders.length} total</div>
          </div>
          <div style={s.sumIcon}>🧾</div>
        </div>
        <div style={s.sumCard('#16a34a','#15803d')}>
          <div style={s.sumLeft}>
            <div style={s.sumLabel}>Total Revenue</div>
            <div style={s.sumValue}>₹{(stats.total/1000).toFixed(1)}k</div>
            <div style={s.sumSub}>₹{stats.total.toLocaleString('en-IN')}</div>
          </div>
          <div style={s.sumIcon}>💰</div>
        </div>
        <div style={s.sumCard('#6366f1','#4f46e5')}>
          <div style={s.sumLeft}>
            <div style={s.sumLabel}>Avg Order Value</div>
            <div style={s.sumValue}>₹{stats.avgAmt}</div>
            <div style={s.sumSub}>Per bill average</div>
          </div>
          <div style={s.sumIcon}>📈</div>
        </div>
        <div style={s.sumCard('#06b6d4','#0891b2')}>
          <div style={s.sumLeft}>
            <div style={s.sumLabel}>Paid / Pending</div>
            <div style={s.sumValue}>{stats.paid} / {stats.pending}</div>
            <div style={s.sumSub}>{filtered.filter(o=>o.status==='refunded').length} refunded</div>
          </div>
          <div style={s.sumIcon}>✅</div>
        </div>
      </div>

      {/* ── Insight Strip ── */}
      <div style={s.insightRow}>
        {/* Time slot breakdown */}
        {Object.entries(stats.slotMap).map(([slot, count]) => {
          const icons = { Morning:'🌅', Afternoon:'☀️', Evening:'🌆', Night:'🌙' };
          const colors = { Morning:['#854d0e','#fef9c3'], Afternoon:['#ea580c','#fff3e0'], Evening:['#7e22ce','#f3e8ff'], Night:['#4f46e5','#e0e7ff'] };
          const [color, bg] = colors[slot];
          return (
            <div key={slot} style={s.insightCard(color, bg)}>
              <div style={s.insightIcon}>{icons[slot]}</div>
              <div>
                <div style={s.insightLabel}>{slot} Orders</div>
                <div style={s.insightVal(color)}>{count} orders</div>
              </div>
            </div>
          );
        })}
        {/* Top dish */}
        {stats.topDish && (
          <div style={s.insightCard('#16a34a','#dcfce7')}>
            <div style={s.insightIcon}>🏆</div>
            <div>
              <div style={s.insightLabel}>Top Dish</div>
              <div style={s.insightVal('#16a34a')}>{stats.topDish[0]} ×{stats.topDish[1]}</div>
            </div>
          </div>
        )}
      </div>

      {/* ── Filter Panel ── */}
      <div style={s.filterPanel}>
        <div style={s.filterHeader}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={s.filterTitle}>🔍 Filters</div>
            {activeFilters > 0 && (
              <div style={s.filterBadge}>{activeFilters} active</div>
            )}
          </div>
          <button style={s.resetBtn} onClick={resetAllFilters}>↺ Reset All</button>
        </div>

        {/* Quick Range Pills */}
        <div style={s.quickRow}>
          {[
            { key:'all',   label:'📋 All Time'    },
            { key:'today', label:'📅 Today'        },
            { key:'week',  label:'📆 Last 7 Days'  },
            { key:'month', label:'🗓 This Month'   },
            { key:'year',  label:'📊 This Year'    },
          ].map(q => (
            <button key={q.key} style={s.quickBtn(quickRange===q.key)} onClick={() => applyQuickRange(q.key)}>
              {q.label}
            </button>
          ))}
        </div>

        {/* Filter Grid */}
        <div style={s.filterGrid}>

          {/* Date */}
          <div style={s.filterGroup}>
            <label style={s.filterLabel}>📅 Specific Date</label>
            <input type="date" style={s.filterInput}
              value={filterDate}
              onChange={e => { setFilterDate(e.target.value); setQuickRange(''); setFilterMonth(''); setFilterYear(''); setPage(1); }}
              onFocus={foc} onBlur={blr} />
          </div>

          {/* Month */}
          <div style={s.filterGroup}>
            <label style={s.filterLabel}>🗓 Month</label>
            <input type="month" style={s.filterInput}
              value={filterMonth}
              onChange={e => { setFilterMonth(e.target.value); setQuickRange(''); setFilterDate(''); setFilterYear(''); setPage(1); }}
              onFocus={foc} onBlur={blr} />
          </div>

          {/* Year */}
          <div style={s.filterGroup}>
            <label style={s.filterLabel}>📆 Year</label>
            <select style={s.filterSelect}
              value={filterYear}
              onChange={e => { setFilterYear(e.target.value); setQuickRange(''); setFilterDate(''); setFilterMonth(''); setPage(1); }}>
              <option value=''>All Years</option>
              {['2026','2025','2024'].map(y => <option key={y}>{y}</option>)}
            </select>
          </div>

          {/* Time Slot */}
          <div style={s.filterGroup}>
            <label style={s.filterLabel}>🕐 Time of Day</label>
            <select style={s.filterSelect} value={filterTimeSlot} onChange={e => { setFilterTimeSlot(e.target.value); setPage(1); }}>
              {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* Category */}
          <div style={s.filterGroup}>
            <label style={s.filterLabel}>🍽️ Category</label>
            <select style={s.filterSelect} value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1); }}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Order Mode */}
          <div style={s.filterGroup}>
            <label style={s.filterLabel}>🛵 Order Mode</label>
            <select style={s.filterSelect} value={filterMode} onChange={e => { setFilterMode(e.target.value); setPage(1); }}>
              {MODES.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>

          {/* Status */}
          <div style={s.filterGroup}>
            <label style={s.filterLabel}>💳 Status</label>
            <select style={s.filterSelect} value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Customer Name */}
          <div style={s.filterGroup}>
            <label style={s.filterLabel}>👤 Customer Name</label>
            <input style={s.filterInput} placeholder="Search name..."
              value={filterName}
              onChange={e => { setFilterName(e.target.value); setPage(1); }}
              onFocus={foc} onBlur={blr} />
          </div>

          {/* Dish Name */}
          <div style={s.filterGroup}>
            <label style={s.filterLabel}>🍛 Dish Name / Tamil</label>
            <input style={s.filterInput} placeholder="Idli / இட்லி..."
              value={filterDish}
              onChange={e => { setFilterDish(e.target.value); setPage(1); }}
              onFocus={foc} onBlur={blr} />
          </div>

          {/* Amount Range */}
          <div style={s.filterGroup}>
            <label style={s.filterLabel}>💰 Min Amount (₹)</label>
            <input type="number" style={s.filterInput} placeholder="e.g. 100"
              value={filterMinAmt}
              onChange={e => { setFilterMinAmt(e.target.value); setPage(1); }}
              onFocus={foc} onBlur={blr} />
          </div>
          <div style={s.filterGroup}>
            <label style={s.filterLabel}>💰 Max Amount (₹)</label>
            <input type="number" style={s.filterInput} placeholder="e.g. 500"
              value={filterMaxAmt}
              onChange={e => { setFilterMaxAmt(e.target.value); setPage(1); }}
              onFocus={foc} onBlur={blr} />
          </div>

        </div>
      </div>

      {/* ── Stats + Sort Bar ── */}
      <div style={s.statsBar}>
        <div style={s.statPill('#16a34a','#dcfce7')}>📋 {filtered.length} results</div>
        <div style={s.statPill('#f97316','#fff3e0')}>💰 ₹{stats.total.toLocaleString('en-IN')}</div>
        <div style={s.statPill('#6366f1','#e0e7ff')}>📊 Avg ₹{stats.avgAmt}</div>
        {/* Category revenue pills */}
        {Object.entries(stats.catMap).slice(0,3).map(([cat, rev]) => (
          <div key={cat} style={s.statPill('#0891b2','#e0f2fe')}>
            {cat}: ₹{rev.toLocaleString('en-IN')}
          </div>
        ))}
        <select style={s.sortSelect} value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}>
          <option value="date_desc">🕐 Newest First</option>
          <option value="date_asc">🕐 Oldest First</option>
          <option value="amt_desc">💰 High Amount</option>
          <option value="amt_asc">💰 Low Amount</option>
          <option value="name_asc">👤 Name A–Z</option>
        </select>
      </div>

      {/* ── Orders Table ── */}
      <div style={s.tableCard}>
        <div style={s.tableScroll}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}></th>
                <th style={s.th}>Bill No</th>
                <th style={s.th}>Customer</th>
                <th style={s.th}>Date</th>
                <th style={s.th}>Time</th>
                <th style={s.th}>Slot</th>
                <th style={s.th}>Mode</th>
                <th style={s.th}>Items</th>
                <th style={s.th}>Total</th>
                <th style={s.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ ...s.td, textAlign:'center', padding:'40px', color:'#ccc' }}>
                    <div style={{ fontSize:'36px' }}>🔍</div>
                    <div style={{ marginTop:'8px', fontSize:'14px' }}>No orders match your filters</div>
                    <button style={{ marginTop:'12px', padding:'8px 20px', border:'none', borderRadius:'8px', background:O, color:'#fff', fontWeight:'700', cursor:'pointer' }}
                      onClick={resetAllFilters}>Clear Filters</button>
                  </td>
                </tr>
              ) : paginated.map((order, idx) => (
                <>
                  <tr
                    key={order.id}
                    style={{ background: expandedId===order.id ? '#fff7ed' : idx%2===0 ? '#fff' : '#fafafa', cursor:'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fff7ed'}
                    onMouseLeave={e => e.currentTarget.style.background = expandedId===order.id ? '#fff7ed' : idx%2===0 ? '#fff' : '#fafafa'}
                    onClick={() => setExpandedId(expandedId===order.id ? null : order.id)}
                  >
                    <td style={{ ...s.td, width:'32px', textAlign:'center', color: O, fontWeight:'700' }}>
                      {expandedId===order.id ? '▼' : '▶'}
                    </td>
                    <td style={s.td}>
                      <span style={{ fontWeight:'700', color:'#1a1a2e' }}>{order.billNo}</span>
                    </td>
                    <td style={s.td}>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                        <div style={{ width:'30px', height:'30px', borderRadius:'8px', background:`linear-gradient(135deg,${O},${OD})`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:'800', fontSize:'12px', flexShrink:0 }}>
                          {order.customer[0]}
                        </div>
                        <span style={{ fontWeight:'600' }}>{order.customer}</span>
                      </div>
                    </td>
                    <td style={{ ...s.td, color:'#555', fontSize:'12px' }}>{order.date}</td>
                    <td style={{ ...s.td, color:'#555', fontSize:'12px' }}>{order.time}</td>
                    <td style={s.td}><span style={s.slotBadge(order.timeSlot)}>{order.timeSlot}</span></td>
                    <td style={s.td}><span style={s.modeBadge(order.mode)}>{order.mode}</span></td>
                    <td style={{ ...s.td, color:'#888', fontSize:'12px' }}>
                      {order.items.map(i => i.name).join(', ').slice(0, 30)}{order.items.map(i=>i.name).join(', ').length > 30 ? '...' : ''}
                      <div style={{ fontSize:'11px', color:'#ccc' }}>{order.items.length} items</div>
                    </td>
                    <td style={{ ...s.td, fontWeight:'800', color:O, fontSize:'14px' }}>₹{order.total}</td>
                    <td style={s.td}><span style={s.statusBadge(order.status)}>{order.status}</span></td>
                  </tr>

                  {/* Expanded Row */}
                  {expandedId === order.id && (
                    <tr key={`exp-${order.id}`}>
                      <td colSpan={10} style={{ padding:0 }}>
                        <div style={s.expandRow}>
                          <div style={{ display:'flex', gap:'24px', flexWrap:'wrap' }}>
                            {/* Items */}
                            <div style={{ flex:1, minWidth:'280px' }}>
                              <div style={{ fontSize:'12px', fontWeight:'800', color:'#888', marginBottom:'8px', textTransform:'uppercase' }}>
                                🍽️ Order Items
                              </div>
                              <div style={{ display:'flex', flexWrap:'wrap' }}>
                                {order.items.map((item, i) => (
                                  <div key={i} style={s.itemPill}>
                                    <span style={{ fontSize:'11px', fontWeight:'700', color:'#1a1a2e' }}>{item.name}</span>
                                    <span style={{ fontSize:'10px', color:'#aaa' }}>{item.nameTa}</span>
                                    <span style={{ fontSize:'11px', color:'#888' }}>×{item.qty}</span>
                                    <span style={{ fontSize:'11px', fontWeight:'700', color:O }}>₹{item.price * item.qty}</span>
                                    <span style={{ fontSize:'10px', background:'#f0f0f0', padding:'1px 5px', borderRadius:'4px', color:'#666' }}>{item.category}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* Bill summary */}
                            <div style={{ minWidth:'200px' }}>
                              <div style={{ fontSize:'12px', fontWeight:'800', color:'#888', marginBottom:'8px', textTransform:'uppercase' }}>
                                💰 Bill Summary
                              </div>
                              <div style={{ display:'flex', flexDirection:'column', gap:'5px', fontSize:'13px' }}>
                                <div style={{ display:'flex', justifyContent:'space-between', color:'#555' }}>
                                  <span>Subtotal</span><span>₹{order.subtotal}</span>
                                </div>
                                <div style={{ display:'flex', justifyContent:'space-between', color:'#555' }}>
                                  <span>GST (5%)</span><span>₹{order.gst}</span>
                                </div>
                                <div style={{ display:'flex', justifyContent:'space-between', fontWeight:'800', color:'#1a1a2e', paddingTop:'4px', borderTop:'1px dashed #e5e5e5' }}>
                                  <span>Grand Total</span><span style={{ color:O }}>₹{order.total}</span>
                                </div>
                                <div style={{ fontSize:'12px', color:'#aaa', marginTop:'4px' }}>
                                  Cashier: {order.cashier}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={s.pagination}>
          <button style={s.pageBtn(false, page===1)} disabled={page===1} onClick={() => setPage(1)}>«</button>
          <button style={s.pageBtn(false, page===1)} disabled={page===1} onClick={() => setPage(p=>p-1)}>‹</button>
          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
            let p;
            if (totalPages <= 7) p = i + 1;
            else if (page <= 4) p = i + 1;
            else if (page >= totalPages - 3) p = totalPages - 6 + i;
            else p = page - 3 + i;
            return (
              <button key={p} style={s.pageBtn(page===p, false)} onClick={() => setPage(p)}>{p}</button>
            );
          })}
          <button style={s.pageBtn(false, page===totalPages)} disabled={page===totalPages} onClick={() => setPage(p=>p+1)}>›</button>
          <button style={s.pageBtn(false, page===totalPages)} disabled={page===totalPages} onClick={() => setPage(totalPages)}>»</button>
          <span style={{ fontSize:'12px', color:'#aaa', marginLeft:'8px' }}>
            Page {page} of {totalPages} · {filtered.length} records
          </span>
        </div>
      </div>

    </div>
  );
}
