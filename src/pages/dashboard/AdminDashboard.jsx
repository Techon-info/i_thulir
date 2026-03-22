import { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const O  = '#f97316';
const OD = '#ea580c';

// ── Mock Data ─────────────────────────────────────────
const dailySales = [
  { day: 'Mon',  sales: 4200, orders: 38 },
  { day: 'Tue',  sales: 5800, orders: 52 },
  { day: 'Wed',  sales: 4900, orders: 44 },
  { day: 'Thu',  sales: 7200, orders: 65 },
  { day: 'Fri',  sales: 8900, orders: 80 },
  { day: 'Sat',  sales: 11400, orders: 102 },
  { day: 'Sun',  sales: 9600, orders: 87 },
];

const monthlySales = [
  { month: 'Oct', sales: 98000  },
  { month: 'Nov', sales: 112000 },
  { month: 'Dec', sales: 145000 },
  { month: 'Jan', sales: 108000 },
  { month: 'Feb', sales: 132000 },
  { month: 'Mar', sales: 158000 },
];

const categorySales = [
  { name: 'Breakfast & Tiffin', value: 32, color: '#f97316' },
  { name: 'Parotta & Main',     value: 24, color: '#6366f1' },
  { name: 'Meat Specials',      value: 18, color: '#ef4444' },
  { name: 'Beverages',          value: 12, color: '#06b6d4' },
  { name: 'Village Specials',   value: 8,  color: '#16a34a' },
  { name: 'Others',             value: 6,  color: '#a855f7' },
];

const recentOrders = [
  { id: '#1042', customer: 'Table 4',  items: 'Idli, Coffee, Vada',        mode: 'Dine In',   total: 115, time: '12:28 PM', status: 'Paid' },
  { id: '#1041', customer: 'Take Away',items: 'Parotta × 3, Chicken Gravy',mode: 'Take Away', total: 245, time: '12:21 PM', status: 'Paid' },
  { id: '#1040', customer: 'Table 1',  items: 'Samba Biryani × 2',         mode: 'Dine In',   total: 390, time: '12:15 PM', status: 'Paid' },
  { id: '#1039', customer: 'Table 6',  items: 'Meals × 2, Lemon Juice × 2',mode: 'Dine In',   total: 320, time: '12:08 PM', status: 'Paid' },
  { id: '#1038', customer: 'Take Away',items: 'Kothu Parotta, Tea',         mode: 'Take Away', total: 150, time: '11:55 AM', status: 'Paid' },
  { id: '#1037', customer: 'Table 3',  items: 'Ghee Roast × 2, Filter Coffee × 2', mode: 'Dine In', total: 200, time: '11:48 AM', status: 'Paid' },
  { id: '#1036', customer: 'Table 2',  items: 'Chicken 65, Butter Naan × 2',mode: 'Dine In',  total: 265, time: '11:40 AM', status: 'Paid' },
  { id: '#1035', customer: 'Take Away',items: 'Pongal, Vada, Tea',         mode: 'Take Away', total: 85,  time: '11:30 AM', status: 'Paid' },
];

const topItems = [
  { rank: 1, name: 'Parotta',              nameTa: 'பரோட்டா',          sold: 142, revenue: 3550,  trend: '+12%' },
  { rank: 2, name: 'Filter Coffee',        nameTa: 'பில்டர் காபி',     sold: 138, revenue: 3450,  trend: '+8%'  },
  { rank: 3, name: 'Idli (2 pcs)',         nameTa: 'இட்லி',            sold: 121, revenue: 3025,  trend: '+5%'  },
  { rank: 4, name: 'Samba Biryani',        nameTa: 'சீரக சம்பா பிரியாணி', sold: 84, revenue: 16380, trend: '+22%' },
  { rank: 5, name: 'Chicken 65',           nameTa: 'சிக்கன் 65',       sold: 76,  revenue: 11780, trend: '+18%' },
  { rank: 6, name: 'Kothu Parotta',        nameTa: 'கொத்து புரோட்டா',  sold: 68,  revenue: 8500,  trend: '+7%'  },
  { rank: 7, name: 'Meals (Veg)',          nameTa: 'சாப்பாடு (சைவம்)', sold: 62,  revenue: 7440,  trend: '-2%'  },
  { rank: 8, name: 'Ghee Roast',           nameTa: 'நெய் ரோஸ்ட்',     sold: 58,  revenue: 4350,  trend: '+4%'  },
];

const lowStockItems = [
  { name: 'Mutton',         nameTa: 'மட்டன்',          qty: 2,  unit: 'kg',  needed: 8  },
  { name: 'Toor Dal',       nameTa: 'தூவரம் பருப்பு',  qty: 3,  unit: 'kg',  needed: 10 },
  { name: 'LPG Cylinder',   nameTa: 'எரிவாயு',         qty: 1,  unit: 'pcs', needed: 3  },
  { name: 'Turmeric',       nameTa: 'மஞ்சள்',          qty: 1,  unit: 'kg',  needed: 4  },
  { name: 'Green Chilli',   nameTa: 'பச்சை மிளகாய்',  qty: 2,  unit: 'kg',  needed: 5  },
];

// ── Custom Tooltip ────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#1a1a2e', borderRadius: '10px', padding: '10px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
      <div style={{ color: '#fff', fontWeight: '700', marginBottom: '4px', fontSize: '13px' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontSize: '13px' }}>
          {p.name}: <strong>{p.name === 'sales' || p.name === 'Sales (₹)' ? `₹${p.value.toLocaleString('en-IN')}` : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const [chartView, setChartView] = useState('week'); // 'week' | 'month'
  const [dateFilter, setDateFilter] = useState('today');

  const chartData = chartView === 'week' ? dailySales : monthlySales;

  // ── Styles ────────────────────────────────────────────
  const s = {
    wrap: {
      fontFamily: "'Inter','Segoe UI',sans-serif",
      height: '100%', display: 'flex', flexDirection: 'column',
      gap: '16px', minHeight: 0, overflowY: 'auto',
    },

    // Summary cards
    summaryRow: { display: 'flex', gap: '14px', flexShrink: 0 },
    sumCard: (gradient, shadow) => ({
      flex: 1, borderRadius: '16px', padding: '20px 22px',
      background: gradient,
      boxShadow: shadow,
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    }),
    sumLeft: { display: 'flex', flexDirection: 'column', gap: '4px' },
    sumLabel: { fontSize: '13px', color: 'rgba(255,255,255,0.75)', fontWeight: '600' },
    sumValue: { fontSize: '26px', fontWeight: '900', color: '#fff', lineHeight: 1.2 },
    sumSub:   { fontSize: '12px', color: 'rgba(255,255,255,0.6)' },
    sumIcon:  { fontSize: '32px', opacity: 0.85 },
    trendUp:   { fontSize: '12px', fontWeight: '700', color: '#86efac', background: 'rgba(255,255,255,0.15)', padding: '3px 8px', borderRadius: '20px' },
    trendDown: { fontSize: '12px', fontWeight: '700', color: '#fca5a5', background: 'rgba(255,255,255,0.15)', padding: '3px 8px', borderRadius: '20px' },

    // Section title
    sectionTitle: { fontSize: '15px', fontWeight: '800', color: '#1a1a2e', marginBottom: '0' },
    sectionSub:   { fontSize: '12px', color: '#aaa', marginTop: '2px' },

    // Chart card
    chartCard: {
      background: '#fff', borderRadius: '16px', padding: '20px 22px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    },
    chartHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
    chartToggle: { display: 'flex', gap: '6px' },
    toggleBtn: (active) => ({
      padding: '6px 14px', fontSize: '12px', fontWeight: '700',
      border: `1.5px solid ${active ? O : '#e5e5e5'}`,
      borderRadius: '8px', cursor: 'pointer',
      background: active ? O : '#fff', color: active ? '#fff' : '#666',
    }),

    // Two-col layout
    twoCol: { display: 'flex', gap: '16px' },
    col60: { flex: '0 0 60%' },
    col40: { flex: '0 0 calc(40% - 16px)' },

    // Table card
    tableCard: {
      background: '#fff', borderRadius: '16px', overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    },
    tableHead: {
      padding: '16px 20px', borderBottom: '1px solid #f0f0f0',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      background: '#fafafa',
    },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
    th: {
      padding: '10px 16px', textAlign: 'left',
      background: '#fafafa', borderBottom: '2px solid #f0f0f0',
      fontSize: '11px', fontWeight: '700', color: '#888',
      textTransform: 'uppercase', letterSpacing: '0.5px',
    },
    td: { padding: '11px 16px', borderBottom: '1px solid #f8f8f8', verticalAlign: 'middle' },

    // Status badge
    paidBadge: {
      padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
      background: '#dcfce7', color: '#16a34a',
    },
    modeBadge: (mode) => ({
      padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
      background: mode === 'Dine In' ? '#e0f2fe' : '#fff3e0',
      color: mode === 'Dine In' ? '#0369a1' : OD,
    }),

    // Low stock
    lowRow: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 0', borderBottom: '1px solid #f5f5f5',
    },
    lowName: { fontSize: '13px', fontWeight: '700', color: '#1a1a2e' },
    lowTa:   { fontSize: '11px', color: '#999' },
    lowQty:  (critical) => ({
      fontSize: '13px', fontWeight: '800',
      color: critical ? '#dc2626' : '#f97316',
      background: critical ? '#fee2e2' : '#fff3e0',
      padding: '3px 10px', borderRadius: '20px',
    }),

    // Rank badge
    rankBadge: (rank) => {
      const colors = { 1: ['#ffd700','#92400e'], 2: ['#e5e7eb','#374151'], 3: ['#fed7aa','#9a3412'] };
      const [bg, color] = colors[rank] || ['#f3f4f6','#6b7280'];
      return {
        width: '24px', height: '24px', borderRadius: '50%',
        background: bg, color, fontSize: '11px', fontWeight: '800',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      };
    },

    // trend pill
    trendPill: (val) => ({
      fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px',
      background: val.startsWith('+') ? '#dcfce7' : '#fee2e2',
      color: val.startsWith('+') ? '#16a34a' : '#dc2626',
    }),
  };

  return (
    <div style={s.wrap}>

      {/* ── Summary Cards ── */}
      <div style={s.summaryRow}>
        <div style={s.sumCard('linear-gradient(135deg,#f97316,#ea580c)', '0 6px 20px rgba(249,115,22,0.35)')}>
          <div style={s.sumLeft}>
            <div style={s.sumLabel}>Today's Revenue</div>
            <div style={s.sumValue}>₹9,600</div>
            <div style={s.sumSub}>87 orders completed</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'8px' }}>
            <div style={s.sumIcon}>💰</div>
            <div style={s.trendUp}>↑ +14%</div>
          </div>
        </div>

        <div style={s.sumCard('linear-gradient(135deg,#6366f1,#4f46e5)', '0 6px 20px rgba(99,102,241,0.35)')}>
          <div style={s.sumLeft}>
            <div style={s.sumLabel}>Total Orders</div>
            <div style={s.sumValue}>87</div>
            <div style={s.sumSub}>vs 76 yesterday</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'8px' }}>
            <div style={s.sumIcon}>🧾</div>
            <div style={s.trendUp}>↑ +14.5%</div>
          </div>
        </div>

        <div style={s.sumCard('linear-gradient(135deg,#16a34a,#15803d)', '0 6px 20px rgba(22,163,74,0.35)')}>
          <div style={s.sumLeft}>
            <div style={s.sumLabel}>Avg Order Value</div>
            <div style={s.sumValue}>₹110</div>
            <div style={s.sumSub}>Per bill average</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'8px' }}>
            <div style={s.sumIcon}>📈</div>
            <div style={s.trendUp}>↑ +5%</div>
          </div>
        </div>

        <div style={s.sumCard('linear-gradient(135deg,#ef4444,#dc2626)', '0 6px 20px rgba(239,68,68,0.35)')}>
          <div style={s.sumLeft}>
            <div style={s.sumLabel}>Low Stock Alerts</div>
            <div style={s.sumValue}>5</div>
            <div style={s.sumSub}>Items need restock</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'8px' }}>
            <div style={s.sumIcon}>⚠️</div>
            <div style={s.trendDown}>↑ +2 new</div>
          </div>
        </div>
      </div>

      {/* ── Charts Row ── */}
      <div style={s.twoCol}>

        {/* Sales Chart */}
        <div style={{ ...s.chartCard, ...s.col60 }}>
          <div style={s.chartHeader}>
            <div>
              <div style={s.sectionTitle}>Sales Overview</div>
              <div style={s.sectionSub}>
                {chartView === 'week' ? 'This week — daily revenue' : 'Last 6 months'}
              </div>
            </div>
            <div style={s.chartToggle}>
              <button style={s.toggleBtn(chartView === 'week')}  onClick={() => setChartView('week')}>Week</button>
              <button style={s.toggleBtn(chartView === 'month')} onClick={() => setChartView('month')}>6 Months</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            {chartView === 'week' ? (
              <BarChart data={chartData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="day"    tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sales" name="Sales (₹)" fill={O} radius={[6,6,0,0]} />
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="sales" name="Sales (₹)" stroke={O} strokeWidth={3} dot={{ fill: O, r: 5 }} activeDot={{ r: 7 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Category Pie Chart */}
        <div style={{ ...s.chartCard, ...s.col40 }}>
          <div style={s.chartHeader}>
            <div>
              <div style={s.sectionTitle}>Category Sales</div>
              <div style={s.sectionSub}>Revenue by category %</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={categorySales} cx="50%" cy="50%"
                innerRadius={50} outerRadius={80}
                paddingAngle={3} dataKey="value"
              >
                {categorySales.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => `${val}%`} />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '8px' }}>
            {categorySales.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: '#555' }}>{c.name}</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#1a1a2e' }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Orders + Low Stock Row ── */}
      <div style={s.twoCol}>

        {/* Recent Orders Table */}
        <div style={{ ...s.tableCard, ...s.col60 }}>
          <div style={s.tableHead}>
            <div>
              <div style={s.sectionTitle}>🧾 Recent Orders</div>
              <div style={s.sectionSub}>Latest {recentOrders.length} transactions</div>
            </div>
            <select
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              style={{ padding: '6px 12px', fontSize: '12px', border: '1.5px solid #e5e5e5', borderRadius: '8px', outline: 'none', color: '#555', fontWeight: '600', cursor: 'pointer' }}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Order ID</th>
                  <th style={s.th}>Customer</th>
                  <th style={s.th}>Items</th>
                  <th style={s.th}>Mode</th>
                  <th style={s.th}>Time</th>
                  <th style={s.th}>Total</th>
                  <th style={s.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, idx) => (
                  <tr
                    key={order.id}
                    style={{ background: idx % 2 === 0 ? '#fff' : '#fafafa' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fff7ed'}
                    onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : '#fafafa'}
                  >
                    <td style={{ ...s.td, fontWeight: '700', color: O }}>{order.id}</td>
                    <td style={{ ...s.td, fontWeight: '600', color: '#1a1a2e' }}>{order.customer}</td>
                    <td style={{ ...s.td, color: '#666', maxWidth: '160px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.items}
                      </div>
                    </td>
                    <td style={s.td}><span style={s.modeBadge(order.mode)}>{order.mode}</span></td>
                    <td style={{ ...s.td, color: '#888', whiteSpace: 'nowrap' }}>{order.time}</td>
                    <td style={{ ...s.td, fontWeight: '800', color: '#1a1a2e', whiteSpace: 'nowrap' }}>₹{order.total}</td>
                    <td style={s.td}><span style={s.paidBadge}>✓ Paid</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column — Low Stock + Top Items */}
        <div style={{ ...s.col40, display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Low Stock Alert */}
          <div style={s.tableCard}>
            <div style={{ ...s.tableHead, background: '#fff5f5' }}>
              <div>
                <div style={{ ...s.sectionTitle, color: '#dc2626' }}>⚠ Low Stock Alert</div>
                <div style={s.sectionSub}>Items needing restock</div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: '700', background: '#fee2e2', color: '#dc2626', padding: '4px 10px', borderRadius: '20px' }}>
                {lowStockItems.length} items
              </span>
            </div>
            <div style={{ padding: '4px 18px 12px' }}>
              {lowStockItems.map((item, i) => (
                <div key={i} style={s.lowRow}>
                  <div>
                    <div style={s.lowName}>{item.name}</div>
                    <div style={s.lowTa}>{item.nameTa} · Need {item.needed} {item.unit}</div>
                  </div>
                  <span style={s.lowQty(item.qty <= 1)}>
                    {item.qty} {item.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Orders by Mode */}
          <div style={s.chartCard}>
            <div style={{ marginBottom: '14px' }}>
              <div style={s.sectionTitle}>Orders by Mode</div>
              <div style={s.sectionSub}>Today's breakdown</div>
            </div>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart
                layout="vertical"
                data={[
                  { mode: 'Dine In',   count: 52 },
                  { mode: 'Take Away', count: 29 },
                  { mode: 'Dine Out',  count: 6  },
                ]}
                barSize={18}
              >
                <XAxis type="number" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="mode" tick={{ fontSize: 12, fill: '#555' }} axisLine={false} tickLine={false} width={72} />
                <Tooltip cursor={{ fill: '#f5f5f5' }} contentStyle={{ borderRadius: '10px', fontSize: '13px' }} />
                <Bar dataKey="count" name="Orders" fill={O} radius={[0,6,6,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Top Selling Items ── */}
      <div style={s.tableCard}>
        <div style={s.tableHead}>
          <div>
            <div style={s.sectionTitle}>🏆 Top Selling Items</div>
            <div style={s.sectionSub}>Ranked by units sold today</div>
          </div>
        </div>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Rank</th>
              <th style={s.th}>Item Name</th>
              <th style={s.th}>Tamil</th>
              <th style={s.th}>Units Sold</th>
              <th style={s.th}>Revenue</th>
              <th style={s.th}>vs Yesterday</th>
              <th style={s.th}>Share</th>
            </tr>
          </thead>
          <tbody>
            {topItems.map((item, idx) => {
              const maxSold = topItems[0].sold;
              const pct = Math.round((item.sold / maxSold) * 100);
              return (
                <tr
                  key={item.rank}
                  style={{ background: idx % 2 === 0 ? '#fff' : '#fafafa' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fff7ed'}
                  onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : '#fafafa'}
                >
                  <td style={s.td}>
                    <div style={s.rankBadge(item.rank)}>{item.rank}</div>
                  </td>
                  <td style={{ ...s.td, fontWeight: '700', color: '#1a1a2e' }}>{item.name}</td>
                  <td style={{ ...s.td, color: '#888', fontSize: '12px' }}>{item.nameTa}</td>
                  <td style={{ ...s.td, fontWeight: '800', color: O }}>{item.sold}</td>
                  <td style={{ ...s.td, fontWeight: '700', color: '#1a1a2e' }}>₹{item.revenue.toLocaleString('en-IN')}</td>
                  <td style={s.td}><span style={s.trendPill(item.trend)}>{item.trend}</span></td>
                  <td style={{ ...s.td, minWidth: '120px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '6px', background: '#f0f0f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: O, borderRadius: '3px', transition: 'width 0.5s' }} />
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#888', minWidth: '30px' }}>{pct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom padding */}
      <div style={{ height: '8px', flexShrink: 0 }} />
    </div>
  );
}
