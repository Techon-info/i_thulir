import { useState } from 'react';
import toast from 'react-hot-toast';

const O  = '#f97316';
const OD = '#ea580c';

const initialStock = [
  { id: 1,  name: 'Raw Rice',        nameTa: 'பச்சை அரிசி',    qty: 25,  unit: 'kg',  price: 45,  category: 'Grains',    lastUpdated: '2026-03-22' },
  { id: 2,  name: 'Samba Rice',      nameTa: 'சம்பா அரிசி',    qty: 15,  unit: 'kg',  price: 65,  category: 'Grains',    lastUpdated: '2026-03-22' },
  { id: 3,  name: 'Urad Dal',        nameTa: 'உளுத்தம் பருப்பு', qty: 8, unit: 'kg',  price: 120, category: 'Pulses',    lastUpdated: '2026-03-21' },
  { id: 4,  name: 'Toor Dal',        nameTa: 'தூவரம் பருப்பு',  qty: 3,  unit: 'kg',  price: 110, category: 'Pulses',    lastUpdated: '2026-03-21' },
  { id: 5,  name: 'Chicken',         nameTa: 'சிக்கன்',         qty: 12, unit: 'kg',  price: 220, category: 'Meat',      lastUpdated: '2026-03-22' },
  { id: 6,  name: 'Mutton',          nameTa: 'மட்டன்',          qty: 2,  unit: 'kg',  price: 650, category: 'Meat',      lastUpdated: '2026-03-22' },
  { id: 7,  name: 'Fish',            nameTa: 'மீன்',            qty: 5,  unit: 'kg',  price: 180, category: 'Meat',      lastUpdated: '2026-03-22' },
  { id: 8,  name: 'Eggs',            nameTa: 'முட்டை',          qty: 4,  unit: 'pcs', price: 7,   category: 'Dairy',     lastUpdated: '2026-03-22' },
  { id: 9,  name: 'Milk',            nameTa: 'பால்',            qty: 10, unit: 'ltr', price: 55,  category: 'Dairy',     lastUpdated: '2026-03-22' },
  { id: 10, name: 'Cooking Oil',     nameTa: 'சமையல் எண்ணெய்', qty: 6,  unit: 'ltr', price: 140, category: 'Oils',      lastUpdated: '2026-03-20' },
  { id: 11, name: 'Ghee',            nameTa: 'நெய்',            qty: 2,  unit: 'kg',  price: 550, category: 'Oils',      lastUpdated: '2026-03-20' },
  { id: 12, name: 'Onion',           nameTa: 'வெங்காயம்',       qty: 20, unit: 'kg',  price: 35,  category: 'Vegetables',lastUpdated: '2026-03-22' },
  { id: 13, name: 'Tomato',          nameTa: 'தக்காளி',         qty: 8,  unit: 'kg',  price: 40,  category: 'Vegetables',lastUpdated: '2026-03-22' },
  { id: 14, name: 'Potato',          nameTa: 'உருளைக்கிழங்கு', qty: 1,  unit: 'kg',  price: 30,  category: 'Vegetables',lastUpdated: '2026-03-21' },
  { id: 15, name: 'Green Chilli',    nameTa: 'பச்சை மிளகாய்',  qty: 2,  unit: 'kg',  price: 80,  category: 'Vegetables',lastUpdated: '2026-03-21' },
  { id: 16, name: 'Turmeric',        nameTa: 'மஞ்சள்',          qty: 1,  unit: 'kg',  price: 180, category: 'Spices',    lastUpdated: '2026-03-18' },
  { id: 17, name: 'Red Chilli Pwd',  nameTa: 'மிளகாய் பொடி',   qty: 3,  unit: 'kg',  price: 160, category: 'Spices',    lastUpdated: '2026-03-18' },
  { id: 18, name: 'Coriander Pwd',   nameTa: 'தனியா பொடி',     qty: 2,  unit: 'kg',  price: 130, category: 'Spices',    lastUpdated: '2026-03-18' },
  { id: 19, name: 'Coffee Powder',   nameTa: 'காபி பொடி',       qty: 3,  unit: 'kg',  price: 420, category: 'Beverages', lastUpdated: '2026-03-19' },
  { id: 20, name: 'Tea Powder',      nameTa: 'தேயிலை பொடி',    qty: 2,  unit: 'kg',  price: 320, category: 'Beverages', lastUpdated: '2026-03-19' },
  { id: 21, name: 'Sugar',           nameTa: 'சர்க்கரை',        qty: 10, unit: 'kg',  price: 42,  category: 'Grains',    lastUpdated: '2026-03-20' },
  { id: 22, name: 'Salt',            nameTa: 'உப்பு',           qty: 5,  unit: 'kg',  price: 20,  category: 'Spices',    lastUpdated: '2026-03-20' },
  { id: 23, name: 'Maida',           nameTa: 'மைதா',            qty: 8,  unit: 'kg',  price: 38,  category: 'Grains',    lastUpdated: '2026-03-21' },
  { id: 24, name: 'Ragi Flour',      nameTa: 'கேழ்வரகு மாவு',  qty: 4,  unit: 'kg',  price: 60,  category: 'Grains',    lastUpdated: '2026-03-21' },
  { id: 25, name: 'LPG Cylinder',    nameTa: 'எரிவாயு சிலிண்டர்', qty: 1, unit: 'pcs', price: 900, category: 'Fuel',   lastUpdated: '2026-03-15' },
];

const CATEGORIES = ['All', 'Grains', 'Pulses', 'Meat', 'Dairy', 'Oils', 'Vegetables', 'Spices', 'Beverages', 'Fuel'];
const LOW_STOCK_THRESHOLD = 3;
const UNITS = ['kg', 'ltr', 'pcs', 'g', 'ml', 'dozen'];

const emptyForm = { name: '', nameTa: '', qty: '', unit: 'kg', price: '', category: 'Grains' };

export default function StockManagement() {
  const [stock, setStock]           = useState(initialStock);
  const [filterCat, setFilterCat]   = useState('All');
  const [filterLow, setFilterLow]   = useState(false);
  const [search, setSearch]         = useState('');
  const [showModal, setShowModal]   = useState(false);
  const [editItem, setEditItem]     = useState(null);   // null = add, object = edit
  const [form, setForm]             = useState(emptyForm);
  const [deleteId, setDeleteId]     = useState(null);
  const [sortBy, setSortBy]         = useState('name');
  const [sortDir, setSortDir]       = useState('asc');

  // ── Derived list ─────────────────────────────────────
  const filtered = stock
    .filter(i => filterCat === 'All' || i.category === filterCat)
    .filter(i => !filterLow || i.qty <= LOW_STOCK_THRESHOLD)
    .filter(i =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.nameTa.includes(search)
    )
    .sort((a, b) => {
      const va = sortBy === 'qty' || sortBy === 'price' ? a[sortBy] : a[sortBy]?.toLowerCase?.() || a[sortBy];
      const vb = sortBy === 'qty' || sortBy === 'price' ? b[sortBy] : b[sortBy]?.toLowerCase?.() || b[sortBy];
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });

  const lowCount = stock.filter(i => i.qty <= LOW_STOCK_THRESHOLD).length;
  const totalValue = stock.reduce((s, i) => s + i.qty * i.price, 0);

  // ── Sort toggle ───────────────────────────────────────
  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  // ── Modal open/close ──────────────────────────────────
  const openAdd  = () => { setEditItem(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name, nameTa: item.nameTa, qty: item.qty, unit: item.unit, price: item.price, category: item.category });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditItem(null); setForm(emptyForm); };

  // ── Save (add or edit) ────────────────────────────────
  const handleSave = () => {
    if (!form.name.trim() || !form.qty || !form.price) {
      toast.error('Fill all required fields!'); return;
    }
    if (editItem) {
      setStock(prev => prev.map(i => i.id === editItem.id
        ? { ...i, ...form, qty: Number(form.qty), price: Number(form.price), lastUpdated: new Date().toISOString().split('T')[0] }
        : i
      ));
      toast.success(`${form.name} updated!`);
    } else {
      const newItem = {
        ...form, id: Date.now(),
        qty: Number(form.qty), price: Number(form.price),
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      setStock(prev => [...prev, newItem]);
      toast.success(`${form.name} added to stock!`);
    }
    closeModal();
  };

  // ── Delete ────────────────────────────────────────────
  const handleDelete = (id) => {
    const item = stock.find(i => i.id === id);
    setStock(prev => prev.filter(i => i.id !== id));
    setDeleteId(null);
    toast.success(`${item.name} removed!`);
  };

  // ── Quick qty adjust ──────────────────────────────────
  const adjustQty = (id, delta) => {
    setStock(prev => prev.map(i => {
      if (i.id !== id) return i;
      const newQty = Math.max(0, i.qty + delta);
      return { ...i, qty: newQty, lastUpdated: new Date().toISOString().split('T')[0] };
    }));
  };

  // ── Styles ────────────────────────────────────────────
  const s = {
    wrap: { fontFamily: "'Inter','Segoe UI',sans-serif", height: '100%', display: 'flex', flexDirection: 'column', gap: '16px', minHeight: 0 },

    // Summary cards
    summaryRow: { display: 'flex', gap: '14px', flexShrink: 0 },
    sumCard: (color) => ({
      flex: 1, background: '#fff', borderRadius: '14px',
      padding: '16px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
      borderLeft: `4px solid ${color}`,
      display: 'flex', flexDirection: 'column', gap: '4px',
    }),
    sumLabel: { fontSize: '12px', color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
    sumValue: (color) => ({ fontSize: '22px', fontWeight: '800', color }),
    sumSub:   { fontSize: '12px', color: '#aaa' },

    // Controls
    controls: {
      background: '#fff', borderRadius: '14px', padding: '14px 18px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.06)', flexShrink: 0,
      display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap',
    },
    searchInput: {
      flex: 1, minWidth: '180px', padding: '9px 14px', fontSize: '14px',
      border: '1.5px solid #e5e5e5', borderRadius: '10px', outline: 'none',
    },
    filterSelect: {
      padding: '9px 12px', fontSize: '13px', fontWeight: '600',
      border: '1.5px solid #e5e5e5', borderRadius: '10px', outline: 'none',
      background: '#fff', cursor: 'pointer',
    },
    lowBtn: (active) => ({
      padding: '9px 14px', fontSize: '13px', fontWeight: '700',
      border: `1.5px solid ${active ? '#ef4444' : '#e5e5e5'}`,
      borderRadius: '10px', cursor: 'pointer',
      background: active ? '#fee2e2' : '#fff',
      color: active ? '#dc2626' : '#666',
      display: 'flex', alignItems: 'center', gap: '6px',
    }),
    addBtn: {
      padding: '9px 20px', fontSize: '14px', fontWeight: '700',
      border: 'none', borderRadius: '10px', cursor: 'pointer',
      background: `linear-gradient(135deg, ${O}, ${OD})`,
      color: '#fff', boxShadow: `0 3px 10px rgba(249,115,22,0.3)`,
      display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
    },

    // Table
    tableWrap: {
      flex: 1, background: '#fff', borderRadius: '14px', overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column',
      minHeight: 0,
    },
    tableScroll: { flex: 1, overflowY: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
    th: (sortable) => ({
      padding: '12px 16px', textAlign: 'left',
      background: '#fafafa', borderBottom: '2px solid #f0f0f0',
      fontSize: '12px', fontWeight: '700', color: '#555',
      textTransform: 'uppercase', letterSpacing: '0.5px',
      cursor: sortable ? 'pointer' : 'default',
      userSelect: 'none', whiteSpace: 'nowrap',
    }),
    tr: (low, idx) => ({
      background: low ? '#fff5f5' : idx % 2 === 0 ? '#fff' : '#fafafa',
      transition: 'background 0.15s',
    }),
    td: { padding: '12px 16px', borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle' },

    // Status badge
    badge: (low) => ({
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
      background: low ? '#fee2e2' : '#dcfce7',
      color: low ? '#dc2626' : '#16a34a',
    }),

    // Qty adjust buttons
    qtyWrap: { display: 'flex', alignItems: 'center', gap: '6px' },
    qBtn: (type) => ({
      width: '24px', height: '24px', border: 'none', borderRadius: '6px',
      cursor: 'pointer', fontWeight: '700', fontSize: '14px',
      background: type === 'minus' ? '#fee2e2' : '#dcfce7',
      color: type === 'minus' ? '#dc2626' : '#16a34a',
      display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
    }),
    qtyNum: (low) => ({
      fontSize: '14px', fontWeight: '700',
      color: low ? '#dc2626' : '#1a1a2e',
      minWidth: '28px', textAlign: 'center',
    }),

    // Action buttons
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

    // Category tag
    catTag: (cat) => {
      const colors = {
        Grains: ['#fef9c3','#854d0e'], Pulses: ['#fef3c7','#92400e'],
        Meat: ['#fee2e2','#991b1b'],   Dairy: ['#e0f2fe','#075985'],
        Oils: ['#fce7f3','#9d174d'],   Vegetables: ['#dcfce7','#166534'],
        Spices: ['#fef3c7','#78350f'], Beverages: ['#ede9fe','#4c1d95'],
        Fuel: ['#f0fdf4','#14532d'],
      };
      const [bg, color] = colors[cat] || ['#f3f4f6','#374151'];
      return { padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: bg, color };
    },

    // Modal overlay
    overlay: {
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(3px)',
    },
    modal: {
      background: '#fff', borderRadius: '18px', width: '440px', maxWidth: '95vw',
      boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden',
    },
    modalHeader: {
      padding: '20px 24px', borderBottom: '1px solid #f0f0f0',
      background: `linear-gradient(135deg, ${O}, ${OD})`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    },
    modalTitle: { color: '#fff', fontSize: '16px', fontWeight: '800' },
    modalClose: {
      width: '30px', height: '30px', borderRadius: '50%',
      border: 'none', background: 'rgba(255,255,255,0.25)',
      color: '#fff', fontWeight: '700', fontSize: '16px',
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    modalBody: { padding: '24px' },
    formGroup: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '700', color: '#555', marginBottom: '6px' },
    input: {
      width: '100%', padding: '10px 14px', fontSize: '14px',
      border: '1.5px solid #e5e5e5', borderRadius: '10px',
      outline: 'none', boxSizing: 'border-box', background: '#fafafa',
    },
    formRow: { display: 'flex', gap: '12px' },
    modalFooter: {
      padding: '16px 24px', borderTop: '1px solid #f0f0f0',
      display: 'flex', gap: '10px', justifyContent: 'flex-end',
      background: '#fafafa',
    },
    cancelBtn: {
      padding: '10px 20px', fontSize: '14px', fontWeight: '700',
      border: '1.5px solid #e5e5e5', borderRadius: '10px',
      background: '#fff', color: '#666', cursor: 'pointer',
    },
    saveBtn: {
      padding: '10px 24px', fontSize: '14px', fontWeight: '700',
      border: 'none', borderRadius: '10px', cursor: 'pointer',
      background: `linear-gradient(135deg, ${O}, ${OD})`,
      color: '#fff', boxShadow: `0 3px 10px rgba(249,115,22,0.3)`,
    },

    // Delete confirm
    confirmBox: {
      background: '#fff', borderRadius: '16px', padding: '32px',
      width: '360px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    },
  };

  const sortIcon = (col) => sortBy === col ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕';

  return (
    <div style={s.wrap}>

      {/* ── Summary Cards ── */}
      <div style={s.summaryRow}>
        <div style={s.sumCard('#f97316')}>
          <div style={s.sumLabel}>Total Items</div>
          <div style={s.sumValue('#f97316')}>{stock.length}</div>
          <div style={s.sumSub}>{CATEGORIES.length - 1} categories</div>
        </div>
        <div style={s.sumCard('#ef4444')}>
          <div style={s.sumLabel}>⚠ Low Stock</div>
          <div style={s.sumValue('#ef4444')}>{lowCount}</div>
          <div style={s.sumSub}>Below {LOW_STOCK_THRESHOLD} units</div>
        </div>
        <div style={s.sumCard('#16a34a')}>
          <div style={s.sumLabel}>Stock Value</div>
          <div style={s.sumValue('#16a34a')}>₹{totalValue.toLocaleString('en-IN')}</div>
          <div style={s.sumSub}>Total inventory worth</div>
        </div>
        <div style={s.sumCard('#6366f1')}>
          <div style={s.sumLabel}>Showing</div>
          <div style={s.sumValue('#6366f1')}>{filtered.length}</div>
          <div style={s.sumSub}>of {stock.length} items</div>
        </div>
      </div>

      {/* ── Controls ── */}
      <div style={s.controls}>
        <input
          style={s.searchInput}
          placeholder="Search stock items... பொருட்கள் தேடு"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onFocus={e => { e.target.style.borderColor = O; }}
          onBlur={e =>  { e.target.style.borderColor = '#e5e5e5'; }}
        />
        <select style={s.filterSelect} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <button style={s.lowBtn(filterLow)} onClick={() => setFilterLow(p => !p)}>
          <span>⚠</span> Low Stock {lowCount > 0 && `(${lowCount})`}
        </button>
        <button style={s.addBtn} onClick={openAdd}>
          <span>＋</span> Add Stock
        </button>
      </div>

      {/* ── Table ── */}
      <div style={s.tableWrap}>
        <div style={s.tableScroll}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th(false)}>#</th>
                <th style={s.th(true)} onClick={() => toggleSort('name')}>Item Name{sortIcon('name')}</th>
                <th style={s.th(false)}>Tamil / தமிழ்</th>
                <th style={s.th(false)}>Category</th>
                <th style={s.th(true)} onClick={() => toggleSort('qty')}>Quantity{sortIcon('qty')}</th>
                <th style={s.th(false)}>Unit</th>
                <th style={s.th(true)} onClick={() => toggleSort('price')}>Price/Unit{sortIcon('price')}</th>
                <th style={s.th(false)}>Status</th>
                <th style={s.th(false)}>Last Updated</th>
                <th style={s.th(false)}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ ...s.td, textAlign: 'center', padding: '48px', color: '#ccc' }}>
                    <div style={{ fontSize: '36px' }}>📦</div>
                    <div style={{ marginTop: '8px', fontSize: '15px' }}>No items found</div>
                  </td>
                </tr>
              ) : filtered.map((item, idx) => {
                const isLow = item.qty <= LOW_STOCK_THRESHOLD;
                return (
                  <tr
                    key={item.id}
                    style={s.tr(isLow, idx)}
                    onMouseEnter={e => e.currentTarget.style.background = isLow ? '#fee2e2' : '#fff7ed'}
                    onMouseLeave={e => e.currentTarget.style.background = isLow ? '#fff5f5' : idx % 2 === 0 ? '#fff' : '#fafafa'}
                  >
                    <td style={{ ...s.td, color: '#aaa', fontSize: '12px' }}>{idx + 1}</td>

                    <td style={s.td}>
                      <div style={{ fontWeight: '700', color: '#1a1a2e' }}>{item.name}</div>
                    </td>

                    <td style={s.td}>
                      <div style={{ fontSize: '13px', color: '#666' }}>{item.nameTa}</div>
                    </td>

                    <td style={s.td}>
                      <span style={s.catTag(item.category)}>{item.category}</span>
                    </td>

                    <td style={s.td}>
                      <div style={s.qtyWrap}>
                        <button style={s.qBtn('minus')} onClick={() => adjustQty(item.id, -1)}>−</button>
                        <span style={s.qtyNum(isLow)}>{item.qty}</span>
                        <button style={s.qBtn('plus')}  onClick={() => adjustQty(item.id, +1)}>+</button>
                      </div>
                    </td>

                    <td style={{ ...s.td, color: '#666', fontSize: '13px' }}>{item.unit}</td>

                    <td style={{ ...s.td, fontWeight: '700', color: '#1a1a2e' }}>
                      ₹{item.price}
                      <div style={{ fontSize: '11px', color: '#aaa', fontWeight: '400' }}>
                        Val: ₹{(item.price * item.qty).toLocaleString('en-IN')}
                      </div>
                    </td>

                    <td style={s.td}>
                      <span style={s.badge(isLow)}>
                        {isLow ? '⚠ Low' : '✓ OK'}
                      </span>
                    </td>

                    <td style={{ ...s.td, fontSize: '12px', color: '#888' }}>{item.lastUpdated}</td>

                    <td style={s.td}>
                      <button style={s.editBtn} onClick={() => openEdit(item)}>✏ Edit</button>
                      <button style={s.delBtn}  onClick={() => setDeleteId(item.id)}>🗑 Del</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div style={{ padding: '10px 18px', borderTop: '1px solid #f0f0f0', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#888' }}>
            Showing <strong>{filtered.length}</strong> of <strong>{stock.length}</strong> items
          </span>
          {lowCount > 0 && (
            <span style={{ fontSize: '13px', color: '#dc2626', fontWeight: '700' }}>
              ⚠ {lowCount} item{lowCount > 1 ? 's' : ''} running low!
            </span>
          )}
        </div>
      </div>

      {/* ── Add/Edit Modal ── */}
      {showModal && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && closeModal()}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <div style={s.modalTitle}>
                {editItem ? `✏ Edit — ${editItem.name}` : '＋ Add New Stock Item'}
              </div>
              <button style={s.modalClose} onClick={closeModal}>✕</button>
            </div>

            <div style={s.modalBody}>
              {/* Name row */}
              <div style={s.formRow}>
                <div style={{ ...s.formGroup, flex: 1 }}>
                  <label style={s.label}>Item Name (English) *</label>
                  <input
                    style={s.input}
                    placeholder="e.g. Chicken"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = O}
                    onBlur={e  => e.target.style.borderColor = '#e5e5e5'}
                  />
                </div>
                <div style={{ ...s.formGroup, flex: 1 }}>
                  <label style={s.label}>Tamil Name (தமிழ்)</label>
                  <input
                    style={s.input}
                    placeholder="e.g. சிக்கன்"
                    value={form.nameTa}
                    onChange={e => setForm(p => ({ ...p, nameTa: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = O}
                    onBlur={e  => e.target.style.borderColor = '#e5e5e5'}
                  />
                </div>
              </div>

              {/* Qty + Unit row */}
              <div style={s.formRow}>
                <div style={{ ...s.formGroup, flex: 1 }}>
                  <label style={s.label}>Quantity *</label>
                  <input
                    style={s.input} type="number" min="0"
                    placeholder="e.g. 10"
                    value={form.qty}
                    onChange={e => setForm(p => ({ ...p, qty: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = O}
                    onBlur={e  => e.target.style.borderColor = '#e5e5e5'}
                  />
                </div>
                <div style={{ ...s.formGroup, flex: 1 }}>
                  <label style={s.label}>Unit</label>
                  <select
                    style={{ ...s.input, cursor: 'pointer' }}
                    value={form.unit}
                    onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
                  >
                    {UNITS.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              {/* Price + Category row */}
              <div style={s.formRow}>
                <div style={{ ...s.formGroup, flex: 1 }}>
                  <label style={s.label}>Price per Unit (₹) *</label>
                  <input
                    style={s.input} type="number" min="0"
                    placeholder="e.g. 220"
                    value={form.price}
                    onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = O}
                    onBlur={e  => e.target.style.borderColor = '#e5e5e5'}
                  />
                </div>
                <div style={{ ...s.formGroup, flex: 1 }}>
                  <label style={s.label}>Category</label>
                  <select
                    style={{ ...s.input, cursor: 'pointer' }}
                    value={form.category}
                    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Low stock warning preview */}
              {form.qty && Number(form.qty) <= LOW_STOCK_THRESHOLD && (
                <div style={{ background: '#fee2e2', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#dc2626', fontWeight: '600', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  ⚠ This quantity ({form.qty}) is below low-stock threshold ({LOW_STOCK_THRESHOLD})
                </div>
              )}
            </div>

            <div style={s.modalFooter}>
              <button style={s.cancelBtn} onClick={closeModal}>Cancel</button>
              <button style={s.saveBtn}   onClick={handleSave}>
                {editItem ? '✓ Update Item' : '＋ Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteId && (
        <div style={s.overlay}>
          <div style={s.confirmBox}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🗑️</div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#1a1a2e', marginBottom: '8px' }}>
              Delete Item?
            </div>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '24px' }}>
              <strong>{stock.find(i => i.id === deleteId)?.name}</strong> will be permanently removed from stock.
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                style={{ ...s.cancelBtn, padding: '10px 24px' }}
                onClick={() => setDeleteId(null)}
              >Cancel</button>
              <button
                style={{ padding: '10px 24px', fontSize: '14px', fontWeight: '700', border: 'none', borderRadius: '10px', cursor: 'pointer', background: '#ef4444', color: '#fff' }}
                onClick={() => handleDelete(deleteId)}
              >Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
